import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function refreshTokenIfNeeded(
  supabase: ReturnType<typeof createClient>,
  account: { id: string; platform: string; access_token: string; refresh_token: string | null; token_expires_at: string | null }
): Promise<string> {
  if (!account.token_expires_at) return account.access_token;
  const expiresAt = new Date(account.token_expires_at).getTime();
  if (Date.now() < expiresAt - 60_000) return account.access_token;
  if (!account.refresh_token) throw new Error(`Token expired for ${account.platform} and no refresh token available`);

  let tokenUrl: string;
  let body: Record<string, string>;

  switch (account.platform) {
    case "x": {
      const clientId = Deno.env.get("X_CLIENT_ID");
      const clientSecret = Deno.env.get("X_CLIENT_SECRET");
      if (!clientId || !clientSecret) throw new Error("X_CLIENT_ID/X_CLIENT_SECRET not configured");
      tokenUrl = "https://api.twitter.com/2/oauth2/token";
      body = { grant_type: "refresh_token", refresh_token: account.refresh_token, client_id: clientId };
      break;
    }
    case "facebook":
    case "instagram": {
      const appId = Deno.env.get("FB_APP_ID");
      const appSecret = Deno.env.get("FB_APP_SECRET");
      if (!appId || !appSecret) throw new Error("FB_APP_ID/FB_APP_SECRET not configured");
      tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${account.access_token}`;
      // Facebook uses GET for token exchange
      const fbResp = await fetch(tokenUrl);
      const fbData = await fbResp.json();
      if (fbData.access_token) {
        await supabase.from("social_accounts").update({
          access_token: fbData.access_token,
          token_expires_at: fbData.expires_in ? new Date(Date.now() + fbData.expires_in * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        }).eq("id", account.id);
        return fbData.access_token;
      }
      throw new Error(`Failed to refresh Facebook token: ${JSON.stringify(fbData)}`);
    }
    case "tiktok": {
      const clientKey = Deno.env.get("TIKTOK_CLIENT_KEY");
      const clientSecret = Deno.env.get("TIKTOK_CLIENT_SECRET");
      if (!clientKey || !clientSecret) throw new Error("TIKTOK_CLIENT_KEY/TIKTOK_CLIENT_SECRET not configured");
      tokenUrl = "https://open.tiktokapis.com/v2/oauth/token/";
      body = { grant_type: "refresh_token", refresh_token: account.refresh_token, client_key: clientKey, client_secret: clientSecret };
      break;
    }
    default:
      throw new Error(`Unknown platform: ${account.platform}`);
  }

  // For X and TikTok
  const resp = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body!),
  });
  const data = await resp.json();
  if (!data.access_token) throw new Error(`Token refresh failed for ${account.platform}: ${JSON.stringify(data)}`);

  await supabase.from("social_accounts").update({
    access_token: data.access_token,
    refresh_token: data.refresh_token || account.refresh_token,
    token_expires_at: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  }).eq("id", account.id);

  return data.access_token;
}

async function publishToX(token: string, post: { title: string; excerpt: string; slug: string; featured_image: string | null }, siteUrl: string) {
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const base = `${post.title} — ${post.excerpt || ""}`;
  const maxLen = 280 - postUrl.length - 2;
  const text = base.length > maxLen ? base.slice(0, maxLen - 1) + "…" : base;
  const fullText = `${text} ${postUrl}`;

  const resp = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ text: fullText }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(`X API error: ${JSON.stringify(data)}`);
  return {
    platform_post_id: data.data?.id,
    platform_post_url: `https://x.com/i/web/status/${data.data?.id}`,
  };
}

async function publishToFacebook(token: string, account: { platform_user_id: string | null }, post: { title: string; excerpt: string; slug: string }, siteUrl: string) {
  const pageId = account.platform_user_id;
  if (!pageId) throw new Error("Facebook page ID not configured in social account");
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const message = `${post.title}\n\n${post.excerpt || ""}`;

  const resp = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, link: postUrl, access_token: token }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(`Facebook API error: ${JSON.stringify(data)}`);
  return {
    platform_post_id: data.id,
    platform_post_url: `https://www.facebook.com/${data.id}`,
  };
}

async function publishToInstagram(token: string, account: { platform_user_id: string | null }, post: { title: string; excerpt: string; featured_image: string | null }, siteUrl: string) {
  const igUserId = account.platform_user_id;
  if (!igUserId) throw new Error("Instagram user ID not configured in social account");
  if (!post.featured_image) throw new Error("Instagram requires a featured image");

  const caption = `${post.title}\n\n${post.excerpt || ""}\n\n🏠 Link in bio`;

  // Step 1: Create media container
  const createResp = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: post.featured_image, caption, access_token: token }),
  });
  const createData = await createResp.json();
  if (!createResp.ok) throw new Error(`Instagram media create error: ${JSON.stringify(createData)}`);

  // Step 2: Publish
  const publishResp = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creation_id: createData.id, access_token: token }),
  });
  const publishData = await publishResp.json();
  if (!publishResp.ok) throw new Error(`Instagram publish error: ${JSON.stringify(publishData)}`);

  return {
    platform_post_id: publishData.id,
    platform_post_url: `https://www.instagram.com/p/${publishData.id}/`,
  };
}

async function publishToTiktok(token: string, post: { type: string; video_url: string | null; title: string; excerpt: string }) {
  if (post.type !== "vlog" || !post.video_url) {
    throw new Error("TikTok requires video content");
  }

  const resp = await fetch("https://open.tiktokapis.com/v2/post/publish/inbox/video/init/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      post_info: { title: post.title, description: post.excerpt || "" },
      source_info: { source: "PULL_FROM_URL", video_url: post.video_url },
    }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(`TikTok API error: ${JSON.stringify(data)}`);

  return {
    platform_post_id: data.data?.publish_id,
    platform_post_url: null,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { post_id, platform } = await req.json();
    if (!post_id || !platform) return jsonResponse({ error: "post_id and platform are required" }, 400);

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const siteUrl = Deno.env.get("SITE_URL") || "https://k8tsestates.com";

    // Get post
    const { data: post, error: postError } = await supabase
      .from("posts").select("*").eq("id", post_id).single();
    if (postError || !post) return jsonResponse({ error: "Post not found" }, 404);

    // Get social account
    const { data: account, error: accountError } = await supabase
      .from("social_accounts").select("*").eq("platform", platform).eq("is_active", true).single();
    if (accountError || !account) return jsonResponse({ error: `No active ${platform} account connected` }, 400);

    // Upsert distribution record as publishing
    await supabase.from("post_distributions").upsert({
      post_id,
      platform,
      social_account_id: account.id,
      status: "publishing",
      error_message: null,
    }, { onConflict: "post_id,platform" });

    // Refresh token if needed
    const token = await refreshTokenIfNeeded(supabase, account);

    // Publish
    let result: { platform_post_id?: string; platform_post_url?: string | null };
    switch (platform) {
      case "x":
        result = await publishToX(token, post, siteUrl);
        break;
      case "facebook":
        result = await publishToFacebook(token, account, post, siteUrl);
        break;
      case "instagram":
        result = await publishToInstagram(token, account, post, siteUrl);
        break;
      case "tiktok":
        result = await publishToTiktok(token, post);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    // Update distribution as published
    await supabase.from("post_distributions").update({
      status: "published",
      platform_post_id: result.platform_post_id || null,
      platform_post_url: result.platform_post_url || null,
      published_at: new Date().toISOString(),
      error_message: null,
    }).eq("post_id", post_id).eq("platform", platform);

    return jsonResponse({ success: true, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    // Try to update the distribution record with the error
    try {
      const { post_id, platform } = await req.clone().json();
      if (post_id && platform) {
        const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
        await supabase.from("post_distributions").update({
          status: "failed",
          error_message: message,
        }).eq("post_id", post_id).eq("platform", platform);
      }
    } catch { /* ignore */ }

    return jsonResponse({ error: message }, 500);
  }
});

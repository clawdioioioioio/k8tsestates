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

async function exchangeX(code: string, codeVerifier: string, redirectUri: string) {
  const clientId = Deno.env.get("X_CLIENT_ID");
  const clientSecret = Deno.env.get("X_CLIENT_SECRET");
  if (!clientId || !clientSecret) throw new Error("X_CLIENT_ID/X_CLIENT_SECRET not configured");

  const resp = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
      client_id: clientId,
    }),
  });
  const data = await resp.json();
  if (!data.access_token) throw new Error(`X token exchange failed: ${JSON.stringify(data)}`);

  // Get user info
  const userResp = await fetch("https://api.twitter.com/2/users/me", {
    headers: { Authorization: `Bearer ${data.access_token}` },
  });
  const userData = await userResp.json();

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token || null,
    token_expires_at: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : null,
    scopes: data.scope ? data.scope.split(" ") : [],
    platform_user_id: userData.data?.id || null,
    platform_username: userData.data?.username || null,
  };
}

async function exchangeFacebook(code: string, redirectUri: string, forInstagram: boolean) {
  const appId = Deno.env.get("FB_APP_ID");
  const appSecret = Deno.env.get("FB_APP_SECRET");
  if (!appId || !appSecret) throw new Error("FB_APP_ID/FB_APP_SECRET not configured");

  // Exchange code for short-lived token
  const tokenResp = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`);
  const tokenData = await tokenResp.json();
  if (!tokenData.access_token) throw new Error(`Facebook token exchange failed: ${JSON.stringify(tokenData)}`);

  // Exchange for long-lived token
  const longResp = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${tokenData.access_token}`);
  const longData = await longResp.json();
  const accessToken = longData.access_token || tokenData.access_token;

  if (forInstagram) {
    // Get Instagram business account
    const pagesResp = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
    const pagesData = await pagesResp.json();
    const page = pagesData.data?.[0];
    if (!page) throw new Error("No Facebook pages found. Instagram Business requires a linked Facebook Page.");

    const igResp = await fetch(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token || accessToken}`);
    const igData = await igResp.json();
    const igId = igData.instagram_business_account?.id;
    if (!igId) throw new Error("No Instagram Business account linked to this Facebook Page.");

    return {
      access_token: page.access_token || accessToken,
      refresh_token: null,
      token_expires_at: longData.expires_in ? new Date(Date.now() + longData.expires_in * 1000).toISOString() : null,
      scopes: ["instagram_basic", "instagram_content_publish"],
      platform_user_id: igId,
      platform_username: null,
    };
  }

  // Facebook — get page access token
  const pagesResp = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
  const pagesData = await pagesResp.json();
  const page = pagesData.data?.[0];

  return {
    access_token: page?.access_token || accessToken,
    refresh_token: null,
    token_expires_at: longData.expires_in ? new Date(Date.now() + longData.expires_in * 1000).toISOString() : null,
    scopes: ["pages_manage_posts", "pages_read_engagement"],
    platform_user_id: page?.id || null,
    platform_username: page?.name || null,
  };
}

async function exchangeTiktok(code: string, redirectUri: string) {
  const clientKey = Deno.env.get("TIKTOK_CLIENT_KEY");
  const clientSecret = Deno.env.get("TIKTOK_CLIENT_SECRET");
  if (!clientKey || !clientSecret) throw new Error("TIKTOK_CLIENT_KEY/TIKTOK_CLIENT_SECRET not configured");

  const resp = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_key: clientKey,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });
  const data = await resp.json();
  if (!data.access_token) throw new Error(`TikTok token exchange failed: ${JSON.stringify(data)}`);

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token || null,
    token_expires_at: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : null,
    scopes: data.scope ? data.scope.split(",") : [],
    platform_user_id: data.open_id || null,
    platform_username: null,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { platform, code, state, code_verifier, redirect_uri } = await req.json();
    if (!platform || !code) return jsonResponse({ error: "platform and code are required" }, 400);

    const siteUrl = Deno.env.get("SITE_URL") || "https://k8tsestates.com";
    const callbackUri = redirect_uri || `${siteUrl}/api/auth/social-callback`;

    let result: {
      access_token: string;
      refresh_token: string | null;
      token_expires_at: string | null;
      scopes: string[];
      platform_user_id: string | null;
      platform_username: string | null;
    };

    switch (platform) {
      case "x":
        result = await exchangeX(code, code_verifier || "", callbackUri);
        break;
      case "facebook":
        result = await exchangeFacebook(code, callbackUri, false);
        break;
      case "instagram":
        result = await exchangeFacebook(code, callbackUri, true);
        break;
      case "tiktok":
        result = await exchangeTiktok(code, callbackUri);
        break;
      default:
        return jsonResponse({ error: `Unsupported platform: ${platform}` }, 400);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Upsert social account
    const { error: upsertError } = await supabase
      .from("social_accounts")
      .upsert(
        {
          platform,
          access_token: result.access_token,
          refresh_token: result.refresh_token || null,
          token_expires_at: result.token_expires_at || null,
          scopes: result.scopes || null,
          platform_user_id: result.platform_user_id || null,
          platform_username: result.platform_username || null,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "platform" }
      );

    if (upsertError) throw new Error(`Failed to save account: ${upsertError.message}`);

    return jsonResponse({ success: true, platform, username: result.platform_username });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonResponse({ error: message }, 500);
  }
});

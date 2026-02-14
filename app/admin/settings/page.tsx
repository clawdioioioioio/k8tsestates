'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Settings, CheckCircle2, XCircle, Loader2, ExternalLink, Trash2 } from 'lucide-react';

// Platform SVG icons (reused from SocialShare)
function XIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
}
function FacebookIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
}
function InstagramIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>;
}
function TikTokIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>;
}

interface SocialAccount {
  id: string;
  platform: string;
  platform_user_id: string | null;
  platform_username: string | null;
  is_active: boolean;
  created_at: string;
}

const PLATFORMS = [
  { key: 'x', name: 'X (Twitter)', icon: XIcon, color: 'bg-black', textColor: 'text-white' },
  { key: 'facebook', name: 'Facebook', icon: FacebookIcon, color: 'bg-[#1877F2]', textColor: 'text-white' },
  { key: 'instagram', name: 'Instagram', icon: InstagramIcon, color: 'bg-gradient-to-br from-purple-600 to-pink-500', textColor: 'text-white' },
  { key: 'tiktok', name: 'TikTok', icon: TikTokIcon, color: 'bg-black', textColor: 'text-white' },
];

function generatePKCE() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const verifier = btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
    .then(hash => {
      const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      return { verifier, challenge };
    });
}

export default function AdminSettingsPage() {
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const successMsg = searchParams.get('success');
  const errorMsg = searchParams.get('error');

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    const supabase = createClient();
    const { data } = await supabase.from('social_accounts').select('*').eq('is_active', true);
    setAccounts(data || []);
    setLoading(false);
  }

  async function handleConnect(platform: string) {
    const siteUrl = window.location.origin;
    const callbackUrl = `${siteUrl}/api/auth/social-callback`;

    switch (platform) {
      case 'x': {
        const { verifier, challenge } = await generatePKCE();
        // Store verifier in cookie for callback
        document.cookie = `pkce_code_verifier=${verifier}; path=/; max-age=600; SameSite=Lax`;
        const clientId = process.env.NEXT_PUBLIC_X_CLIENT_ID;
        if (!clientId) { alert('X_CLIENT_ID not configured. Add NEXT_PUBLIC_X_CLIENT_ID to your environment.'); return; }
        const url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=tweet.read+tweet.write+users.read&state=x&code_challenge=${challenge}&code_challenge_method=S256`;
        window.location.href = url;
        break;
      }
      case 'facebook': {
        const appId = process.env.NEXT_PUBLIC_FB_APP_ID;
        if (!appId) { alert('FB_APP_ID not configured. Add NEXT_PUBLIC_FB_APP_ID to your environment.'); return; }
        const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=pages_manage_posts,pages_read_engagement&state=facebook`;
        window.location.href = url;
        break;
      }
      case 'instagram': {
        const appId = process.env.NEXT_PUBLIC_FB_APP_ID;
        if (!appId) { alert('FB_APP_ID not configured. Add NEXT_PUBLIC_FB_APP_ID to your environment.'); return; }
        const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish&state=instagram`;
        window.location.href = url;
        break;
      }
      case 'tiktok': {
        const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY;
        if (!clientKey) { alert('TIKTOK_CLIENT_KEY not configured. Add NEXT_PUBLIC_TIKTOK_CLIENT_KEY to your environment.'); return; }
        const url = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=user.info.basic,video.upload,video.publish&response_type=code&redirect_uri=${encodeURIComponent(callbackUrl)}&state=tiktok`;
        window.location.href = url;
        break;
      }
    }
  }

  async function handleDisconnect(platform: string) {
    if (!confirm(`Disconnect ${platform}? You won't be able to publish to this platform until you reconnect.`)) return;
    setDisconnecting(platform);
    const supabase = createClient();
    await supabase.from('social_accounts').delete().eq('platform', platform);
    setAccounts(prev => prev.filter(a => a.platform !== platform));
    setDisconnecting(null);
  }

  const getAccount = (platform: string) => accounts.find(a => a.platform === platform);

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Settings className="h-6 w-6 text-brand-400" />
        <h1 className="text-2xl font-bold text-brand-900">Settings</h1>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex items-center gap-2">
          <XCircle className="h-4 w-4" /> {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-xl border border-brand-100 p-6">
        <h2 className="text-lg font-semibold text-brand-900 mb-1">Connected Social Accounts</h2>
        <p className="text-sm text-brand-500 mb-6">Connect your social media accounts to publish directly from the admin panel.</p>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-brand-400">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading accounts...
          </div>
        ) : (
          <div className="space-y-3">
            {PLATFORMS.map(platform => {
              const account = getAccount(platform.key);
              const Icon = platform.icon;
              return (
                <div key={platform.key} className="flex items-center justify-between p-4 rounded-lg border border-brand-100 hover:border-brand-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${platform.textColor}`} />
                    </div>
                    <div>
                      <p className="font-medium text-brand-900">{platform.name}</p>
                      {account ? (
                        <p className="text-sm text-brand-500">
                          {account.platform_username ? `@${account.platform_username}` : 'Connected'}
                        </p>
                      ) : (
                        <p className="text-sm text-brand-400">Not connected</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {account ? (
                      <>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                          <CheckCircle2 className="h-3 w-3" /> Connected
                        </span>
                        <button
                          onClick={() => handleDisconnect(platform.key)}
                          disabled={disconnecting === platform.key}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {disconnecting === platform.key ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnect(platform.key)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 text-white text-sm font-medium rounded-lg hover:bg-brand-800 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Connect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 bg-brand-50 rounded-xl p-6">
        <h3 className="font-semibold text-brand-900 mb-2">Setup Instructions</h3>
        <div className="text-sm text-brand-600 space-y-2">
          <p>To connect social accounts, you need to register developer apps on each platform and add the credentials as environment variables:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>X (Twitter):</strong> <code className="text-xs bg-white px-1.5 py-0.5 rounded">NEXT_PUBLIC_X_CLIENT_ID</code>, <code className="text-xs bg-white px-1.5 py-0.5 rounded">X_CLIENT_SECRET</code></li>
            <li><strong>Facebook &amp; Instagram:</strong> <code className="text-xs bg-white px-1.5 py-0.5 rounded">NEXT_PUBLIC_FB_APP_ID</code>, <code className="text-xs bg-white px-1.5 py-0.5 rounded">FB_APP_SECRET</code></li>
            <li><strong>TikTok:</strong> <code className="text-xs bg-white px-1.5 py-0.5 rounded">NEXT_PUBLIC_TIKTOK_CLIENT_KEY</code>, <code className="text-xs bg-white px-1.5 py-0.5 rounded">TIKTOK_CLIENT_SECRET</code></li>
          </ul>
          <p>OAuth callback URL for all platforms: <code className="text-xs bg-white px-1.5 py-0.5 rounded">{typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/social-callback</code></p>
        </div>
      </div>
    </div>
  );
}

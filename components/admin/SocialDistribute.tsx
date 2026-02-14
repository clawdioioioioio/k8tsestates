'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Copy, Check, ExternalLink, Loader2, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

// Platform SVG icons
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

const TAG_HASHTAGS: Record<string, string[]> = {
  'market update': ['#RealEstate', '#MarketUpdate', '#TorontoRealEstate', '#GTA'],
  'buying tips': ['#HomeBuying', '#FirstTimeBuyer', '#RealEstateTips'],
  'selling tips': ['#HomeSelling', '#ListingTips', '#SellYourHome'],
  'neighborhood spotlight': ['#Toronto', '#Vaughan', '#Markham', '#RichmondHill'],
  'investment': ['#RealEstateInvesting', '#PropertyInvestment', '#ROI'],
  'commercial': ['#CommercialRealEstate', '#CRE', '#BusinessBrokerage'],
  'luxury': ['#LuxuryRealEstate', '#LuxuryHomes', '#DreamHome'],
};
const DEFAULT_HASHTAGS = ['#RealEstate', '#K8tsEstates', '#TorontoRealEstate', '#REMAX'];

function getHashtags(tags: string[]): string[] {
  const set = new Set(DEFAULT_HASHTAGS);
  tags.forEach(tag => {
    const key = tag.toLowerCase();
    (TAG_HASHTAGS[key] || []).forEach(h => set.add(h));
  });
  return Array.from(set);
}

interface SocialAccount {
  id: string;
  platform: string;
  platform_username: string | null;
  is_active: boolean;
}

interface PostDistribution {
  id: string;
  platform: string;
  status: string;
  platform_post_url: string | null;
  error_message: string | null;
  published_at: string | null;
}

const PLATFORMS = [
  { key: 'x', name: 'X (Twitter)', icon: XIcon, color: 'bg-black', textColor: 'text-white' },
  { key: 'facebook', name: 'Facebook', icon: FacebookIcon, color: 'bg-[#1877F2]', textColor: 'text-white' },
  { key: 'instagram', name: 'Instagram', icon: InstagramIcon, color: 'bg-gradient-to-br from-purple-600 to-pink-500', textColor: 'text-white' },
  { key: 'tiktok', name: 'TikTok', icon: TikTokIcon, color: 'bg-black', textColor: 'text-white' },
];

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="inline-flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-700 transition-colors" title={`Copy ${label}`}>
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied!' : `Copy ${label}`}
    </button>
  );
}

interface SocialDistributeProps {
  postId: string;
  title: string;
  excerpt: string;
  slug: string;
  tags: string[];
  status: string;
}

export function SocialDistribute({ postId, title, excerpt, slug, tags, status }: SocialDistributeProps) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [distributions, setDistributions] = useState<PostDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<Set<string>>(new Set());
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://k8tsestates.com';
  const postUrl = `${siteUrl}/blog/${slug}`;
  const hashtags = getHashtags(tags);

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const [accountsRes, distRes] = await Promise.all([
      supabase.from('social_accounts').select('id, platform, platform_username, is_active').eq('is_active', true),
      supabase.from('post_distributions').select('*').eq('post_id', postId),
    ]);
    setAccounts(accountsRes.data || []);
    setDistributions(distRes.data || []);
    setLoading(false);
  }, [postId]);

  useEffect(() => { loadData(); }, [loadData]);

  const getAccount = (platform: string) => accounts.find(a => a.platform === platform);
  const getDistribution = (platform: string) => distributions.find(d => d.platform === platform);

  async function publishTo(platform: string) {
    setPublishing(prev => new Set(prev).add(platform));
    try {
      const supabase = createClient();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const { data: { session } } = await supabase.auth.getSession();

      const resp = await fetch(`${supabaseUrl}/functions/v1/social-publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({ post_id: postId, platform }),
      });

      await resp.json();
      // Reload distributions to get updated status
      await loadData();
    } catch {
      await loadData();
    } finally {
      setPublishing(prev => {
        const next = new Set(prev);
        next.delete(platform);
        return next;
      });
    }
  }

  async function publishSelected() {
    const platforms = Array.from(selectedPlatforms);
    await Promise.all(platforms.map(p => publishTo(p)));
    setSelectedPlatforms(new Set());
  }

  function toggleSelect(platform: string) {
    setSelectedPlatforms(prev => {
      const next = new Set(prev);
      if (next.has(platform)) next.delete(platform);
      else next.add(platform);
      return next;
    });
  }

  if (status !== 'published') {
    return (
      <div className="bg-brand-50 rounded-xl p-6">
        <h3 className="font-semibold text-brand-900 mb-2">Distribute & Share</h3>
        <p className="text-sm text-brand-500">Publish this post to enable distribution options.</p>
      </div>
    );
  }

  // Generate platform-specific copy-paste text
  const tweetText = (() => {
    const base = `${title} — ${excerpt}`;
    const maxLen = 280 - postUrl.length - 2;
    return base.length > maxLen ? base.slice(0, maxLen - 1) + '…' : base;
  })();
  const instagramCaption = `${title}\n\n${excerpt}\n\n${hashtags.join(' ')}\n\n🏠 Link in bio`;
  const facebookText = `${title}\n\n${excerpt}\n\n${postUrl}`;

  // Platforms that are connected but not yet published (available for bulk publish)
  const publishablePlatforms = PLATFORMS.filter(p => {
    const account = getAccount(p.key);
    const dist = getDistribution(p.key);
    return account && (!dist || dist.status === 'failed');
  });

  return (
    <div className="bg-brand-50 rounded-xl p-6 space-y-6">
      <h3 className="font-semibold text-brand-900">Distribute & Share</h3>

      {/* Direct Publishing */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-brand-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading accounts...
        </div>
      ) : (
        <div className="space-y-3">
          {PLATFORMS.map(platform => {
            const account = getAccount(platform.key);
            const dist = getDistribution(platform.key);
            const isPublishing = publishing.has(platform.key);
            const Icon = platform.icon;

            return (
              <div key={platform.key} className="bg-white rounded-lg border border-brand-100 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {account && (!dist || dist.status === 'failed') && (
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.has(platform.key)}
                        onChange={() => toggleSelect(platform.key)}
                        className="rounded border-brand-300 text-accent-600 focus:ring-accent-500"
                      />
                    )}
                    <div className={`w-7 h-7 rounded-md ${platform.color} flex items-center justify-center`}>
                      <Icon className={`h-3.5 w-3.5 ${platform.textColor}`} />
                    </div>
                    <span className="text-sm font-medium text-brand-800">{platform.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!account ? (
                      <Link
                        href="/admin/settings"
                        className="text-xs text-accent-600 hover:text-accent-700 font-medium"
                      >
                        Connect in Settings →
                      </Link>
                    ) : isPublishing ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-brand-500">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Publishing...
                      </span>
                    ) : dist?.status === 'published' ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Published
                        </span>
                        {dist.platform_post_url && (
                          <a href={dist.platform_post_url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-400 hover:text-brand-600">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    ) : dist?.status === 'failed' ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs text-rose-600" title={dist.error_message || 'Unknown error'}>
                          <XCircle className="h-3.5 w-3.5" /> Failed
                        </span>
                        <button
                          onClick={() => publishTo(platform.key)}
                          className="inline-flex items-center gap-1 text-xs text-brand-500 hover:text-brand-700"
                        >
                          <RefreshCw className="h-3 w-3" /> Retry
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => publishTo(platform.key)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-900 text-white text-xs font-medium rounded-md hover:bg-brand-800 transition-colors"
                      >
                        Publish
                      </button>
                    )}
                  </div>
                </div>
                {dist?.status === 'failed' && dist.error_message && (
                  <p className="mt-2 text-xs text-rose-500 flex items-start gap-1">
                    <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                    {dist.error_message}
                  </p>
                )}
                {dist?.status === 'published' && dist.published_at && (
                  <p className="mt-1 text-xs text-brand-400">
                    Published {new Date(dist.published_at).toLocaleDateString()} at {new Date(dist.published_at).toLocaleTimeString()}
                  </p>
                )}
              </div>
            );
          })}

          {/* Bulk publish button */}
          {publishablePlatforms.length > 1 && selectedPlatforms.size > 0 && (
            <button
              onClick={publishSelected}
              disabled={publishing.size > 0}
              className="w-full py-2.5 bg-brand-900 text-white text-sm font-semibold rounded-lg hover:bg-brand-800 transition-colors disabled:opacity-50"
            >
              Publish to {selectedPlatforms.size} platform{selectedPlatforms.size > 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}

      {/* Fallback: Copy-paste section */}
      <details className="group">
        <summary className="text-sm font-medium text-brand-600 cursor-pointer hover:text-brand-800 transition-colors">
          Manual sharing (copy-paste)
        </summary>
        <div className="mt-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider flex items-center gap-1.5">
                <XIcon className="h-3 w-3" /> X / Twitter
              </span>
              <CopyButton text={`${tweetText} ${postUrl}`} label="tweet" />
            </div>
            <div className="bg-white rounded-lg p-3 text-sm text-brand-700 border border-brand-100">
              {tweetText} <span className="text-accent-600">{postUrl}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider flex items-center gap-1.5">
                <InstagramIcon className="h-3 w-3" /> Instagram
              </span>
              <CopyButton text={instagramCaption} label="caption" />
            </div>
            <div className="bg-white rounded-lg p-3 text-sm text-brand-700 border border-brand-100 whitespace-pre-line">
              {instagramCaption}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider flex items-center gap-1.5">
                <FacebookIcon className="h-3 w-3" /> Facebook
              </span>
              <CopyButton text={facebookText} label="text" />
            </div>
            <div className="bg-white rounded-lg p-3 text-sm text-brand-700 border border-brand-100 whitespace-pre-line">
              {facebookText}
            </div>
          </div>

          {/* Hashtag Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Suggested Hashtags</span>
              <CopyButton text={hashtags.join(' ')} label="all" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {hashtags.map(tag => (
                <button
                  key={tag}
                  onClick={() => navigator.clipboard.writeText(tag)}
                  className="px-2.5 py-1 bg-white border border-brand-100 rounded-full text-xs text-brand-600 hover:bg-accent-50 hover:text-accent-700 hover:border-accent-200 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}

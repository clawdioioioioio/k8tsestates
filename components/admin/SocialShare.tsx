'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

// SVG icons for social platforms (inline to avoid extra deps)
function XIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
}
function FacebookIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
}
function LinkedInIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
}
function InstagramIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>;
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

interface SocialShareProps {
  title: string;
  excerpt: string;
  slug: string;
  tags: string[];
  status: string;
}

export function SocialShare({ title, excerpt, slug, tags, status }: SocialShareProps) {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://k8tsestates.com';
  const postUrl = `${siteUrl}/blog/${slug}`;
  const hashtags = getHashtags(tags);

  // Generate platform-specific text
  const tweetText = (() => {
    const base = `${title} — ${excerpt}`;
    const maxLen = 280 - postUrl.length - 2;
    return base.length > maxLen ? base.slice(0, maxLen - 1) + '…' : base;
  })();

  const instagramCaption = `${title}\n\n${excerpt}\n\n${hashtags.join(' ')}\n\n🏠 Link in bio`;

  const facebookText = `${title}\n\n${excerpt}\n\n${postUrl}`;

  const [copiedLink, setCopiedLink] = useState(false);

  if (status !== 'published') {
    return (
      <div className="bg-brand-50 rounded-xl p-6">
        <h3 className="font-semibold text-brand-900 mb-2">Share & Distribute</h3>
        <p className="text-sm text-brand-500">Publish this post to enable sharing options.</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-50 rounded-xl p-6 space-y-6">
      <h3 className="font-semibold text-brand-900">Share & Distribute</h3>

      {/* Quick Share Buttons */}
      <div className="flex gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(postUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <XIcon className="h-4 w-4" /> Post
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg text-sm font-medium hover:bg-[#1565C0] transition-colors"
        >
          <FacebookIcon className="h-4 w-4" /> Share
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg text-sm font-medium hover:bg-[#004182] transition-colors"
        >
          <LinkedInIcon className="h-4 w-4" /> Share
        </a>
        <button
          onClick={() => { navigator.clipboard.writeText(postUrl); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-brand-200 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-50 transition-colors"
        >
          {copiedLink ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          {copiedLink ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      {/* Suggested Copy */}
      <div className="space-y-4">
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
  );
}

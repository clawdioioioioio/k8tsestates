'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { TiptapEditor } from './TiptapEditor';
import { SocialShare } from './SocialShare';
import {
  ArrowLeft, Save, Eye, Upload, X, FileText, Video, Loader2,
} from 'lucide-react';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

interface PostEditorProps {
  postId?: string;
}

export function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!postId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManual, setSlugManual] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState<'blog' | 'vlog'>('blog');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState('draft');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [existingTags, setExistingTags] = useState<string[]>([]);

  // Load existing post
  useEffect(() => {
    if (!postId) return;
    async function load() {
      const supabase = createClient();
      const { data: post } = await supabase.from('posts').select('*').eq('id', postId).single();
      if (!post) { setError('Post not found'); setLoading(false); return; }

      setTitle(post.title);
      setSlug(post.slug);
      setType(post.type as 'blog' | 'vlog');
      setContent(post.content || '');
      setExcerpt(post.excerpt || '');
      setVideoUrl(post.video_url || '');
      setFeaturedImage(post.featured_image || '');
      setStatus(post.status);
      setSlugManual(true);

      const { data: tagsData } = await supabase.from('post_tags').select('tag').eq('post_id', postId);
      if (tagsData) setTags(tagsData.map(t => t.tag));

      setLoading(false);
    }
    load();
  }, [postId]);

  // Load existing tags for suggestions
  useEffect(() => {
    async function loadTags() {
      const supabase = createClient();
      const { data } = await supabase.from('post_tags').select('tag');
      if (data) {
        const unique = [...new Set(data.map(t => t.tag))];
        setExistingTags(unique);
      }
    }
    loadTags();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManual && title) setSlug(slugify(title));
  }, [title, slugManual]);

  const addTag = useCallback((tag: string) => {
    const t = tag.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  }, [tags]);

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage.from('post-images').upload(path, file);
    if (uploadError) { setError(uploadError.message); setUploading(false); return; }

    const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(path);
    setFeaturedImage(publicUrl);
    setUploading(false);
  };

  const handleSave = async (publishAction?: 'publish' | 'draft') => {
    if (!title.trim() || !slug.trim()) { setError('Title and slug are required'); return; }
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const newStatus = publishAction === 'publish' ? 'published' : publishAction === 'draft' ? 'draft' : status;
    const postData = {
      title: title.trim(),
      slug: slug.trim(),
      content,
      excerpt: excerpt.trim(),
      type,
      featured_image: featuredImage || null,
      video_url: type === 'vlog' ? videoUrl || null : null,
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : null,
      author_id: user?.id,
      updated_at: new Date().toISOString(),
    };

    let savedId = postId;

    if (postId) {
      const { error: updateError } = await supabase.from('posts').update(postData).eq('id', postId);
      if (updateError) { setError(updateError.message); setSaving(false); return; }
    } else {
      const { data, error: insertError } = await supabase.from('posts').insert(postData).select('id').single();
      if (insertError) { setError(insertError.message); setSaving(false); return; }
      savedId = data.id;
    }

    // Sync tags
    await supabase.from('post_tags').delete().eq('post_id', savedId!);
    if (tags.length > 0) {
      await supabase.from('post_tags').insert(tags.map(tag => ({ post_id: savedId!, tag })));
    }

    setSaving(false);
    setStatus(newStatus);

    if (!postId) {
      router.push(`/admin/content/${savedId}`);
    }
  };

  const getVideoEmbed = (url: string) => {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const tiktokMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
    if (tiktokMatch) return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;
    return null;
  };

  if (loading) return <div className="text-center py-20 text-brand-400">Loading…</div>;

  const suggestedTags = existingTags.filter(t => !tags.includes(t) && t.includes(tagInput.toLowerCase()));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.push('/admin/content')} className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-700 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Content
        </button>
        <div className="flex gap-2">
          {status === 'published' && (
            <a
              href={`/blog/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 border border-brand-200 text-brand-700 text-sm font-medium rounded-lg hover:bg-brand-50 transition-colors"
            >
              <Eye className="h-4 w-4" /> View Post
            </a>
          )}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-brand-200 text-brand-700 text-sm font-medium rounded-lg hover:bg-brand-50 transition-colors"
          >
            <Eye className="h-4 w-4" /> {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 border border-brand-200 text-brand-700 text-sm font-medium rounded-lg hover:bg-brand-50 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> Save Draft
          </button>
          <button
            onClick={() => handleSave('publish')}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-900 text-white text-sm font-semibold rounded-lg hover:bg-brand-800 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Publish
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">{error}</div>
      )}

      {showPreview ? (
        /* Preview Mode */
        <div className="bg-white rounded-xl border border-brand-100 p-8 max-w-3xl mx-auto">
          {featuredImage && (
            <img src={featuredImage} alt="" className="w-full aspect-video object-cover rounded-xl mb-8" />
          )}
          {type === 'vlog' && videoUrl && getVideoEmbed(videoUrl) && (
            <div className="aspect-video mb-8 rounded-xl overflow-hidden">
              <iframe src={getVideoEmbed(videoUrl)!} className="w-full h-full" allowFullScreen />
            </div>
          )}
          <h1 className="text-3xl font-bold text-brand-900 mb-4">{title || 'Untitled'}</h1>
          <div className="flex items-center gap-3 text-sm text-brand-500 mb-6">
            <span>Katherine Minovski</span>
            <span>·</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          {tags.length > 0 && (
            <div className="flex gap-2 mb-6">
              {tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-brand-50 text-brand-600 rounded-full text-xs">{tag}</span>
              ))}
            </div>
          )}
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      ) : (
        /* Edit Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); if (!slugManual) setSlug(slugify(e.target.value)); }}
              placeholder="Post title"
              className="w-full text-2xl font-bold text-brand-900 bg-transparent border-none outline-none placeholder:text-brand-300"
            />

            {/* Slug */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-brand-400">/blog/</span>
              <input
                type="text"
                value={slug}
                onChange={e => { setSlug(slugify(e.target.value)); setSlugManual(true); }}
                className="flex-1 px-2 py-1 text-brand-600 bg-brand-50 rounded border border-brand-100 text-sm"
              />
            </div>

            {/* Type Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('blog')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  type === 'blog' ? 'bg-brand-900 text-white' : 'bg-brand-50 text-brand-600 hover:bg-brand-100'
                }`}
              >
                <FileText className="h-4 w-4" /> Blog
              </button>
              <button
                type="button"
                onClick={() => setType('vlog')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  type === 'vlog' ? 'bg-brand-900 text-white' : 'bg-brand-50 text-brand-600 hover:bg-brand-100'
                }`}
              >
                <Video className="h-4 w-4" /> Vlog
              </button>
            </div>

            {/* Video URL (vlog only) */}
            {type === 'vlog' && (
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1.5">Video URL</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or TikTok URL"
                  className="w-full px-4 py-2.5 bg-white border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
                />
                {videoUrl && getVideoEmbed(videoUrl) && (
                  <div className="mt-3 aspect-video rounded-lg overflow-hidden border border-brand-100">
                    <iframe src={getVideoEmbed(videoUrl)!} className="w-full h-full" allowFullScreen />
                  </div>
                )}
              </div>
            )}

            {/* Rich Text Editor */}
            <TiptapEditor content={content} onChange={setContent} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="bg-white rounded-xl border border-brand-100 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-brand-600">Status</span>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                  status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {status}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl border border-brand-100 p-5">
              <label className="block text-sm font-medium text-brand-700 mb-3">Featured Image</label>
              {featuredImage ? (
                <div className="relative">
                  <img src={featuredImage} alt="" className="w-full aspect-video object-cover rounded-lg" />
                  <button
                    onClick={() => setFeaturedImage('')}
                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-brand-200 rounded-lg cursor-pointer hover:border-accent-400 hover:bg-accent-50/30 transition-colors">
                  <Upload className="h-8 w-8 text-brand-300 mb-2" />
                  <span className="text-sm text-brand-400">
                    {uploading ? 'Uploading…' : 'Click or drag to upload'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </label>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl border border-brand-100 p-5">
              <label className="block text-sm font-medium text-brand-700 mb-1.5">Excerpt</label>
              <p className="text-xs text-brand-400 mb-2">Short summary for listings and social sharing</p>
              <textarea
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                rows={3}
                placeholder="A brief summary of this post…"
                className="w-full px-3 py-2 bg-brand-50 border border-brand-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 resize-none"
              />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-brand-100 p-5">
              <label className="block text-sm font-medium text-brand-700 mb-1.5">Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-600 rounded-full text-xs">
                    {tag}
                    <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-rose-500">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tag and press Enter"
                className="w-full px-3 py-2 bg-brand-50 border border-brand-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
              />
              {tagInput && suggestedTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {suggestedTags.slice(0, 5).map(tag => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="px-2 py-0.5 bg-accent-50 text-accent-700 rounded text-xs hover:bg-accent-100"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Social Share */}
            <SocialShare title={title} excerpt={excerpt} slug={slug} tags={tags} status={status} />
          </div>
        </div>
      )}
    </div>
  );
}

import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/Header';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import type { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, featured_image')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | K8ts Estates Blog`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.featured_image ? [post.featured_image] : undefined,
      type: 'article',
    },
  };
}

function getVideoEmbed(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const tiktokMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (tiktokMatch) return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;
  return null;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) notFound();

  const { data: tagsData } = await supabase
    .from('post_tags')
    .select('tag')
    .eq('post_id', post.id);

  const tags = tagsData?.map(t => t.tag) || [];

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 bg-base-warm min-h-screen">
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-700 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Featured Image */}
          {post.featured_image && (
            <img
              src={post.featured_image}
              alt=""
              className="w-full aspect-video object-cover rounded-2xl mb-8"
            />
          )}

          {/* Video Embed */}
          {post.type === 'vlog' && post.video_url && getVideoEmbed(post.video_url) && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-8">
              <iframe
                src={getVideoEmbed(post.video_url)!}
                className="w-full h-full"
                allowFullScreen
                title={post.title}
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-900 mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-brand-500 mb-6">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" />
              Katherine Minovski
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {post.published_at && new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-brand-900 prose-p:text-brand-700 prose-a:text-accent-600 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-brand-100">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/Header';
import Link from 'next/link';
import { FileText, Video, Play, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Blog | K8ts Estates',
  description: 'Real estate insights, market updates, and tips from Katherine Minovski.',
};

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, type, featured_image, published_at')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  const postIds = posts?.map(p => p.id) || [];
  const { data: tagsData } = postIds.length > 0
    ? await supabase.from('post_tags').select('post_id, tag').in('post_id', postIds)
    : { data: [] };

  const tagMap: Record<string, string[]> = {};
  tagsData?.forEach(t => {
    if (!tagMap[t.post_id]) tagMap[t.post_id] = [];
    tagMap[t.post_id].push(t.tag);
  });

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 bg-base-warm min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-50 rounded-full mb-4">
              <span className="text-accent-600 text-sm font-semibold">Blog & Vlogs</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-900 mb-5">
              Insights & Updates
            </h1>
            <p className="text-lg text-brand-600 leading-relaxed">
              Real estate market updates, buying &amp; selling tips, and neighborhood spotlights from Katherine Minovski.
            </p>
          </div>

          {!posts || posts.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="h-12 w-12 text-brand-200 mx-auto mb-4" />
              <p className="text-brand-500 font-medium">No posts yet</p>
              <p className="text-sm text-brand-400 mt-1">Check back soon for new content.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl border border-brand-100 overflow-hidden hover-lift"
                >
                  {/* Image */}
                  <div className="relative aspect-video bg-brand-50">
                    {post.featured_image ? (
                      <img src={post.featured_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="h-10 w-10 text-brand-200" />
                      </div>
                    )}
                    {post.type === 'vlog' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Play className="h-6 w-6 text-white ml-0.5" />
                        </div>
                      </div>
                    )}
                    {/* Type badge */}
                    <span className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                      post.type === 'vlog'
                        ? 'bg-rose-500/90 text-white'
                        : 'bg-white/90 text-brand-700'
                    }`}>
                      {post.type === 'vlog' ? <Video className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                      {post.type}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-brand-400 mb-3">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.published_at && new Date(post.published_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </div>
                    <h2 className="text-lg font-bold text-brand-900 mb-2 group-hover:text-accent-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-brand-600 line-clamp-2 mb-4">{post.excerpt}</p>
                    )}
                    {tagMap[post.id] && tagMap[post.id].length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {tagMap[post.id].slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-brand-50 text-brand-500 rounded text-xs">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Plus, FileText, Video, Calendar } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  type: string;
  status: string;
  published_at: string | null;
  created_at: string;
  tags: string[];
};

const tabs = ['all', 'published', 'draft'] as const;

export default function ContentPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('all');
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: postsData } = await supabase
        .from('posts')
        .select('id, title, type, status, published_at, created_at')
        .order('created_at', { ascending: false });

      if (!postsData) { setLoading(false); return; }

      const postIds = postsData.map(p => p.id);
      const { data: tagsData } = await supabase
        .from('post_tags')
        .select('post_id, tag')
        .in('post_id', postIds);

      const tagMap: Record<string, string[]> = {};
      tagsData?.forEach(t => {
        if (!tagMap[t.post_id]) tagMap[t.post_id] = [];
        tagMap[t.post_id].push(t.tag);
      });

      setPosts(postsData.map(p => ({ ...p, tags: tagMap[p.id] || [] })));
      setLoading(false);
    }
    load();
  }, []);

  const filtered = activeTab === 'all' ? posts : posts.filter(p => p.status === (activeTab === 'draft' ? 'draft' : 'published'));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Content</h1>
          <p className="text-sm text-brand-500 mt-1">Blog posts and vlogs</p>
        </div>
        <button
          onClick={() => router.push('/admin/content/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-900 text-white text-sm font-semibold rounded-lg hover:bg-brand-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Post
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-brand-50 rounded-lg p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
              activeTab === tab ? 'bg-white text-brand-900 shadow-sm' : 'text-brand-500 hover:text-brand-700'
            }`}
          >
            {tab} {tab !== 'all' && `(${posts.filter(p => tab === 'draft' ? p.status === 'draft' : p.status === 'published').length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-brand-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="h-12 w-12 text-brand-200 mx-auto mb-4" />
          <p className="text-brand-500 font-medium">No posts yet</p>
          <p className="text-sm text-brand-400 mt-1">Create your first post to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-brand-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-100">
                <th className="text-left text-xs font-semibold text-brand-500 uppercase tracking-wider px-6 py-3">Title</th>
                <th className="text-left text-xs font-semibold text-brand-500 uppercase tracking-wider px-6 py-3">Type</th>
                <th className="text-left text-xs font-semibold text-brand-500 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-brand-500 uppercase tracking-wider px-6 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-brand-500 uppercase tracking-wider px-6 py-3">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => (
                <tr
                  key={post.id}
                  onClick={() => router.push(`/admin/content/${post.id}`)}
                  className="border-b border-brand-50 hover:bg-brand-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-brand-900">{post.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-brand-600">
                      {post.type === 'vlog' ? <Video className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                      {post.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-brand-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.published_at || post.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-brand-50 text-brand-600 rounded text-xs">{tag}</span>
                      ))}
                      {post.tags.length > 3 && <span className="text-xs text-brand-400">+{post.tags.length - 3}</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

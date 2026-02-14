-- =============================================================
-- Migration: Blog/Vlog CMS
-- =============================================================

CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  excerpt text,
  type text NOT NULL DEFAULT 'blog',
  featured_image text,
  video_url text,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  author_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE post_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag text NOT NULL
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on posts" ON posts FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full access on post_tags" ON post_tags FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Public read published posts" ON posts FOR SELECT USING (status = 'published' AND published_at <= now());
CREATE POLICY "Public read post tags" ON post_tags FOR SELECT USING (
  EXISTS (SELECT 1 FROM posts WHERE posts.id = post_tags.post_id AND posts.status = 'published' AND posts.published_at <= now())
);

CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published ON posts(published_at DESC);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_post_tags_post ON post_tags(post_id);

-- Storage bucket for post images
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);

CREATE POLICY "Public read post images" ON storage.objects FOR SELECT USING (bucket_id = 'post-images');
CREATE POLICY "Admin upload post images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'post-images' AND is_admin());
CREATE POLICY "Admin update post images" ON storage.objects FOR UPDATE USING (bucket_id = 'post-images' AND is_admin());
CREATE POLICY "Admin delete post images" ON storage.objects FOR DELETE USING (bucket_id = 'post-images' AND is_admin());

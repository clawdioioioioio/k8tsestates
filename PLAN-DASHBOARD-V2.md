# K8ts Estates Dashboard V2 — Implementation Plan

> **Created:** 2026-02-13
> **Status:** Planning
> **Stack:** Next.js 14 (App Router) · Supabase (Postgres + Auth + Storage) · Tailwind CSS · Lucide Icons

---

## Table of Contents

1. [Phases & Priorities](#1-phases--priorities)
2. [Database Schema](#2-database-schema)
3. [RLS Policies](#3-rls-policies)
4. [Feature Set 1: Relationship Management](#4-feature-set-1-relationship-management)
5. [Feature Set 2: Blog/Vlog CMS](#5-feature-set-2-blogvlog-cms)
6. [Feature Set 3: Social Media Distribution](#6-feature-set-3-social-media-distribution)
7. [Migration Strategy](#7-migration-strategy)
8. [Estimated Complexity](#8-estimated-complexity)

---

## 1. Phases & Priorities

### Phase 1A — Relationship Management Core (Week 1–2)
- Client profile additions (birthday, closing_anniversary, referred_by, referral_source)
- Tags system (tags + client_tags tables, default tags, filtering)
- Interactions / touch log table + quick-log UI
- "Last contacted" column on client list
- "Going cold" alerts on dashboard

### Phase 1B — Relationship Management Polish (Week 3)
- "Upcoming this week" dashboard widget (birthdays + anniversaries)
- Visual date indicators on client list
- Referral tracking stats on dashboard
- Thank-you reminder logic
- Custom date support (new `client_dates` table)

### Phase 2 — Blog/Vlog CMS (Week 4–5)
- Posts + post_tags tables
- Supabase Storage bucket for featured images
- Admin content list page (`/admin/content`)
- Admin content editor (`/admin/content/new`, `/admin/content/[id]/edit`)
- Rich text editor (Tiptap)
- YouTube/TikTok embed support
- Preview mode
- Public blog pages (`/blog`, `/blog/[slug]`)

### Phase 3 — Social Media Distribution (Week 6)
- Share link generation (Option A — no API keys)
- Platform-optimized text generation per post
- Hashtag suggestions from post tags
- Social profile links in site footer/contact

---

## 2. Database Schema

### Migration: `20260214_dashboard_v2.sql`

```sql
-- =============================================================
-- Migration: Dashboard V2 — Relationship Management + CMS
-- =============================================================

-- -----------------------------------------------
-- 1. Client profile additions
-- -----------------------------------------------
ALTER TABLE clients ADD COLUMN birthday date;
ALTER TABLE clients ADD COLUMN closing_anniversary date;
ALTER TABLE clients ADD COLUMN referred_by uuid REFERENCES clients(id);
ALTER TABLE clients ADD COLUMN referral_source text;

-- Custom dates (flexible — support arbitrary named dates per client)
CREATE TABLE client_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  label text NOT NULL,           -- e.g. "Wedding Anniversary", "Move-in Date"
  date date NOT NULL,
  recurring boolean DEFAULT true, -- show annually?
  created_at timestamptz DEFAULT now()
);

-- -----------------------------------------------
-- 2. Interactions / Touch Log
-- -----------------------------------------------
CREATE TABLE interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  interaction_type text NOT NULL
    CHECK (interaction_type IN ('call', 'text', 'email', 'meeting', 'showing', 'note')),
  notes text,
  interaction_date timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- -----------------------------------------------
-- 3. Tags
-- -----------------------------------------------
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text DEFAULT '#6b7280', -- hex color for badge
  created_at timestamptz DEFAULT now()
);

CREATE TABLE client_tags (
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (client_id, tag_id)
);

-- Seed default tags
INSERT INTO tags (name, color) VALUES
  ('Past Client', '#10b981'),
  ('Active Client', '#f59e0b'),
  ('Referral Source', '#8b5cf6'),
  ('Sphere of Influence', '#3b82f6'),
  ('Vendor', '#6366f1'),
  ('Prospect', '#06b6d4');

-- -----------------------------------------------
-- 4. Blog/Vlog Posts
-- -----------------------------------------------
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,                  -- rich text / HTML from Tiptap
  excerpt text,                  -- short summary for listings
  type text NOT NULL DEFAULT 'blog'
    CHECK (type IN ('blog', 'vlog')),
  featured_image text,           -- Supabase Storage URL
  video_url text,                -- YouTube/TikTok embed URL
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at timestamptz,
  scheduled_for timestamptz,
  author_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE post_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag text NOT NULL
);

-- -----------------------------------------------
-- 5. Triggers
-- -----------------------------------------------
CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------
-- 6. Indexes
-- -----------------------------------------------
CREATE INDEX interactions_client_id_idx ON interactions(client_id);
CREATE INDEX interactions_date_idx ON interactions(interaction_date DESC);
CREATE INDEX client_tags_client_id_idx ON client_tags(client_id);
CREATE INDEX client_tags_tag_id_idx ON client_tags(tag_id);
CREATE INDEX client_dates_client_id_idx ON client_dates(client_id);
CREATE INDEX clients_birthday_idx ON clients(birthday);
CREATE INDEX clients_closing_anniversary_idx ON clients(closing_anniversary);
CREATE INDEX clients_referred_by_idx ON clients(referred_by);
CREATE INDEX posts_slug_idx ON posts(slug);
CREATE INDEX posts_status_idx ON posts(status);
CREATE INDEX posts_published_at_idx ON posts(published_at DESC);
CREATE INDEX posts_type_idx ON posts(type);
CREATE INDEX post_tags_post_id_idx ON post_tags(post_id);
```

---

## 3. RLS Policies

```sql
-- -----------------------------------------------
-- RLS: Enable on all new tables
-- -----------------------------------------------
ALTER TABLE client_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- Admin-only: full CRUD (uses existing is_admin() function)
CREATE POLICY "Admin full access" ON client_dates
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access" ON interactions
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access" ON tags
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access" ON client_tags
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access" ON posts
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access" ON post_tags
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Public read: published posts only
CREATE POLICY "Public read published posts" ON posts
  FOR SELECT USING (
    status = 'published' AND published_at <= now()
  );

CREATE POLICY "Public read post tags" ON post_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_tags.post_id
        AND posts.status = 'published'
        AND posts.published_at <= now()
    )
  );
```

---

## 4. Feature Set 1: Relationship Management

### 4.1 Client Profile Enhancements

**File: `app/admin/clients/[id]/page.tsx`** (existing — extend)

Add new sections to client detail page:

- **Key Dates card** — Birthday, closing anniversary, custom dates. Inline edit with date pickers.
- **Referral Info card** — `referred_by` (client search/autocomplete dropdown), `referral_source` (text input). Show who referred this client, and who this client has referred.
- **Tags card** — Show current tags as colored badges. Add/remove via dropdown. Create custom tags inline.

**New components:**
| Component | Path | Purpose |
|---|---|---|
| `DateCard` | `components/admin/clients/DateCard.tsx` | Birthday, anniversary, custom dates editor |
| `TagBadge` | `components/admin/TagBadge.tsx` | Colored tag badge (reusable) |
| `TagSelector` | `components/admin/clients/TagSelector.tsx` | Multi-select tag picker with create-new |
| `ReferralCard` | `components/admin/clients/ReferralCard.tsx` | Referred by + referral source + referral tree |
| `ClientSearch` | `components/admin/ClientSearch.tsx` | Autocomplete for selecting a client (used by referral picker) |

### 4.2 Interactions / Touch Log

**New components:**
| Component | Path | Purpose |
|---|---|---|
| `InteractionLog` | `components/admin/clients/InteractionLog.tsx` | Timeline of interactions on client detail page |
| `QuickLogForm` | `components/admin/clients/QuickLogForm.tsx` | Inline form: type dropdown + notes + date → save |
| `InteractionIcon` | `components/admin/InteractionIcon.tsx` | Icon per interaction type (phone, mail, etc.) |

**Client detail page additions:**
- Full interaction timeline (newest first) with type icons, notes, date
- "Log Interaction" button → opens QuickLogForm inline or as a slide-over
- Each entry shows relative time ("3 days ago") + absolute date on hover

**Client list page additions (`app/admin/clients/page.tsx`):**
- New column: **Last Contacted** — derived from `MAX(interactions.interaction_date)` per client
- Color-coded: green (<30 days), yellow (30–60 days), red (>60 days), gray (never)
- Supabase query: join interactions, group by client_id, select max date

### 4.3 "Going Cold" Alerts

**Dashboard widget** (`app/admin/page.tsx` — new section):

```
🔴 Going Cold (4 clients)
- Jane Smith — last contact 47 days ago
- Bob Johnson — last contact 62 days ago
...
```

**Implementation:**
- Query: clients LEFT JOIN interactions, WHERE max(interaction_date) < now() - interval '30 days' OR no interactions exist
- Configurable thresholds: store in a `settings` table or hardcode 30/60/90 with visual tiers
- Show on dashboard as a warning card with links to each client

### 4.4 "Upcoming This Week" Widget

**Dashboard widget** (`app/admin/page.tsx` — new section):

```
🎂 Upcoming This Week
- Katherine's Birthday (Feb 15) — Jane Smith
- Closing Anniversary (Feb 17) — Bob Johnson
```

**Implementation:**
- Query clients where `EXTRACT(month FROM birthday) = current_month AND EXTRACT(day FROM birthday) BETWEEN today AND today+7` (handle month boundaries)
- Same for closing_anniversary and client_dates
- Use a Postgres function or do date math in the query with `TO_CHAR` and day-of-year comparison

### 4.5 Tag Filtering on Client List

**Client list page (`app/admin/clients/page.tsx`):**
- Add tag filter row below status filter pills
- Fetch all tags, show as colored filter pills
- When selected, filter clients via client_tags join
- Multiple tag selection (AND or OR — default OR)

### 4.6 Referral Dashboard Stats

**Dashboard widget** (`app/admin/page.tsx` — new section):

```
🤝 Referrals
- Top Referrer: Jane Smith (5 referrals)
- Referral Conversion Rate: 67%
- Total Referred Clients: 12
```

**Queries:**
- Top referrers: `SELECT referred_by, COUNT(*) FROM clients WHERE referred_by IS NOT NULL GROUP BY referred_by ORDER BY count DESC LIMIT 5`
- Conversion rate: referred clients with at least one `closed_won` inquiry / total referred clients
- Thank-you reminder: when an inquiry for a referred client moves to `closed_won`, flag a reminder (could be a generated task)

### 4.7 AdminShell Navigation Update

Add to `navItems` in `components/admin/AdminShell.tsx`:
```ts
{ href: '/admin/content', label: 'Content', icon: FileText },
```

---

## 5. Feature Set 2: Blog/Vlog CMS

### 5.1 Supabase Storage

- Create bucket: `post-images` (public)
- Max file size: 5MB
- Allowed types: image/jpeg, image/png, image/webp, image/gif

### 5.2 Admin Pages

#### `/admin/content` — Content List

**File:** `app/admin/content/page.tsx`

| Feature | Detail |
|---|---|
| List all posts | Table: title, type (blog/vlog badge), status badge, published date, actions |
| Status filter tabs | All / Drafts / Published / Scheduled |
| Search | By title |
| Actions | Edit, Delete, Preview, Publish/Unpublish |
| New post button | Links to `/admin/content/new` |

#### `/admin/content/new` and `/admin/content/[id]/edit` — Post Editor

**File:** `app/admin/content/new/page.tsx` + `app/admin/content/[id]/edit/page.tsx` (shared form component)

**New components:**
| Component | Path | Purpose |
|---|---|---|
| `PostForm` | `components/admin/content/PostForm.tsx` | Main editor form (shared between new/edit) |
| `RichTextEditor` | `components/admin/content/RichTextEditor.tsx` | Tiptap editor wrapper |
| `ImageUpload` | `components/admin/content/ImageUpload.tsx` | Featured image upload to Supabase Storage |
| `PostPreview` | `components/admin/content/PostPreview.tsx` | Preview modal rendering the post as it would appear on `/blog/[slug]` |
| `PostTagInput` | `components/admin/content/PostTagInput.tsx` | Tag input (comma-separated or chip input) |
| `VideoEmbed` | `components/admin/content/VideoEmbed.tsx` | YouTube/TikTok URL input with live preview |

**Editor fields:**
- Title (text input) → auto-generates slug (editable)
- Type toggle: Blog / Vlog
- Content: Tiptap rich text editor with toolbar (bold, italic, headings, lists, links, images, blockquotes)
- Excerpt: textarea (auto-generated from content if blank, max 200 chars)
- Featured Image: drag-and-drop upload → Supabase Storage
- Video URL (shown for vlogs): YouTube or TikTok URL → parsed into embed
- Tags: chip input with suggestions (market update, buying tips, selling tips, neighborhood spotlight, lifestyle, etc.)
- Status: Draft / Published / Scheduled
- Scheduled date picker (shown when status = scheduled)
- Preview button → opens PostPreview modal
- Save Draft / Publish buttons

**Dependencies to install:**
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-placeholder @tiptap/pm
```

### 5.3 Public Blog Pages

#### `/blog` — Blog Listing

**File:** `app/blog/page.tsx`

- Fetches published posts via Supabase (anon key — RLS allows public read)
- Layout: grid of post cards (featured image, title, excerpt, date, type badge, tags)
- Filter by type (Blog / Vlog / All)
- Pagination (12 per page)
- Consistent with K8ts Estates site design (use existing layout, Header, fonts, colors)

#### `/blog/[slug]` — Post Detail

**File:** `app/blog/[slug]/page.tsx`

- Fetch post by slug (published only via RLS)
- SEO metadata via `generateMetadata()`:
  - `title`, `description` (from excerpt), `og:image` (featured_image), `og:type: article`
  - Structured data (JSON-LD Article schema)
- Content rendered as HTML (from Tiptap output) with `prose` Tailwind typography classes
- For vlogs: embedded video player above content
- Post tags shown as badges
- Share buttons (links to Feature Set 3)
- Back to blog link

**Dependencies:**
```bash
npm install @tailwindcss/typography
```

### 5.4 Scheduled Post Publishing

**Approach (simple):** On each page load of `/blog` or `/blog/[slug]`, the RLS policy already filters by `published_at <= now()`. For the admin side, when saving a scheduled post:
- Set `status = 'scheduled'`, `scheduled_for = <selected datetime>`
- A Supabase cron job (pg_cron or Edge Function on schedule) runs every 15 minutes:
  ```sql
  UPDATE posts SET status = 'published', published_at = scheduled_for
  WHERE status = 'scheduled' AND scheduled_for <= now();
  ```

Alternatively, handle this purely in the RLS read policy and skip the cron:
```sql
-- Public can read: published OR (scheduled AND scheduled_for <= now())
status = 'published' AND published_at <= now()
OR (status = 'scheduled' AND scheduled_for <= now())
```

**Recommendation:** Use the cron approach for cleaner status tracking.

---

## 6. Feature Set 3: Social Media Distribution

### 6.1 Approach: Option A — Share Links (Phase 1)

No API keys, no OAuth, no app approvals. Katherine clicks a button, platform opens with pre-filled content.

### 6.2 Share UI

**New component:** `components/admin/content/SocialShare.tsx`

Shown on:
- Post editor page (after saving/publishing)
- Post list page (action menu)

**Per-platform share buttons:**

| Platform | Method | URL Pattern |
|---|---|---|
| **X (Twitter)** | Web Intent | `https://twitter.com/intent/tweet?text={text}&url={url}` |
| **Facebook** | Share Dialog | `https://www.facebook.com/sharer/sharer.php?u={url}` |
| **LinkedIn** | Share URL | `https://www.linkedin.com/sharing/share-offsite/?url={url}` |
| **Instagram** | Copy to clipboard | No share URL — show "Copy caption" button, user pastes in IG |
| **TikTok** | Copy to clipboard | No share URL — show "Copy caption" button |

### 6.3 Platform-Optimized Text Generation

**New component:** `components/admin/content/SocialTextGenerator.tsx`

For each post, auto-generate:

| Platform | Format | Max Length |
|---|---|---|
| **X** | Title + excerpt (truncated) + URL + hashtags | 280 chars total |
| **Facebook** | Full excerpt + URL + hashtags | No strict limit |
| **Instagram** | Engaging caption + hashtags (no link — "link in bio") | 2,200 chars |
| **TikTok** | Short hook + hashtags | 2,200 chars |

**Hashtag generation:**
- Map post_tags to hashtags: "market update" → `#MarketUpdate`, "buying tips" → `#BuyingTips`
- Always include: `#K8tsEstates #RealEstate #Toronto` (configurable base tags)
- Editable before sharing — show generated text in a textarea Katherine can tweak

### 6.4 Social Profile Links on Public Site

**Files to modify:**
- `app/page.tsx` — add social links to footer
- `components/Footer.tsx` (new) — site footer with social icons
- Store social URLs in environment variables or a site-settings config

Social platforms: Instagram, Facebook, X, TikTok, YouTube, LinkedIn

---

## 7. Migration Strategy

### Step 1: Run Migration
```bash
supabase migration new dashboard_v2
# Paste the SQL from Section 2 + Section 3 into the migration file
supabase db push
```

### Step 2: Create Storage Bucket
```bash
# Via Supabase dashboard or SQL:
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);

-- Storage policy: admin upload, public read
CREATE POLICY "Admin upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'post-images' AND is_admin());
CREATE POLICY "Admin manage" ON storage.objects FOR ALL
  USING (bucket_id = 'post-images' AND is_admin());
CREATE POLICY "Public read" ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');
```

### Step 3: Install Dependencies
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-placeholder @tiptap/pm @tailwindcss/typography
```

### Step 4: Implement in Phase Order
Follow Phases 1A → 1B → 2 → 3 as outlined in Section 1.

### Rollback
Each migration is additive (new tables + columns). No destructive changes to existing tables. Rollback = drop new tables and columns.

---

## 8. Estimated Complexity

| Phase | Feature | New Files | Effort |
|---|---|---|---|
| **1A** | Client profile fields (birthday, anniversary, referral) | 3 components | 🟢 Low |
| **1A** | Tags system | 3 components, 1 API helper | 🟢 Low |
| **1A** | Interactions / touch log | 3 components | 🟡 Medium |
| **1A** | Last contacted + going cold | 2 dashboard widgets, query logic | 🟡 Medium |
| **1B** | Upcoming dates widget | 1 component, date query | 🟢 Low |
| **1B** | Referral stats dashboard | 1 component, aggregate queries | 🟡 Medium |
| **1B** | Custom dates | 1 component | 🟢 Low |
| **2** | Posts CRUD (admin) | 6 components, 2 pages | 🔴 High |
| **2** | Rich text editor (Tiptap) | 1 component + config | 🟡 Medium |
| **2** | Image upload (Supabase Storage) | 1 component + bucket setup | 🟡 Medium |
| **2** | Public blog pages | 2 pages, SEO metadata | 🟡 Medium |
| **2** | Scheduled publishing (cron) | 1 Edge Function or pg_cron | 🟢 Low |
| **3** | Social share links | 2 components | 🟢 Low |
| **3** | Text generation + hashtags | 1 component | 🟢 Low |
| **3** | Footer social links | 1 component | 🟢 Low |

**Total new files:** ~25 components + 6 pages
**Total estimated time:** 5–6 weeks (one developer)

### New File Tree (additions)

```
app/
├── admin/
│   ├── content/
│   │   ├── page.tsx                    # Content list
│   │   ├── new/
│   │   │   └── page.tsx                # New post editor
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx            # Edit post
│   └── clients/
│       └── [id]/
│           └── page.tsx                # (extend existing)
├── blog/
│   ├── page.tsx                        # Public blog listing
│   └── [slug]/
│       └── page.tsx                    # Public post detail
components/
├── admin/
│   ├── ClientSearch.tsx
│   ├── InteractionIcon.tsx
│   ├── TagBadge.tsx
│   ├── clients/
│   │   ├── DateCard.tsx
│   │   ├── InteractionLog.tsx
│   │   ├── QuickLogForm.tsx
│   │   ├── ReferralCard.tsx
│   │   └── TagSelector.tsx
│   ├── content/
│   │   ├── ImageUpload.tsx
│   │   ├── PostForm.tsx
│   │   ├── PostPreview.tsx
│   │   ├── PostTagInput.tsx
│   │   ├── RichTextEditor.tsx
│   │   ├── SocialShare.tsx
│   │   ├── SocialTextGenerator.tsx
│   │   └── VideoEmbed.tsx
│   └── dashboard/
│       ├── GoingColdWidget.tsx
│       ├── ReferralStatsWidget.tsx
│       └── UpcomingDatesWidget.tsx
├── Footer.tsx
supabase/
└── migrations/
    └── 20260214_dashboard_v2.sql
```

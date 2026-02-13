# K8ts Estates — CRM & Admin Dashboard Implementation Plan

## Overview

Add a working CRM backend and admin dashboard to the existing K8ts Estates Next.js site. The contact form will submit leads to Supabase via an Edge Function, email Katherine on each submission, and an `/admin` dashboard will let Katherine manage her pipeline.

---

## 1. Supabase Project Setup

1. Create a new Supabase project (e.g. `k8ts-estates`)
2. Note down: **Project URL**, **Anon Key**, **Service Role Key**
3. Add to Vercel env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-side only — used in Edge Functions)
4. Enable **Email Auth** in Supabase Auth settings
5. Under Auth → Users, pre-create accounts for:
   - `kminovski@gmail.com`
   - `nminovski@gmail.com`
6. Disable public signups (Auth → Settings → toggle off "Enable sign ups")
7. Install Supabase CLI locally: `npx supabase init` in repo root

---

## 2. Database Schema

### `leads` table

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `first_name` | `text NOT NULL` | |
| `last_name` | `text NOT NULL` | |
| `email` | `text NOT NULL` | |
| `phone` | `text` | nullable |
| `interest_type` | `text NOT NULL` | e.g. Buying, Selling, Renting, Investment, Other |
| `message` | `text` | |
| `status` | `text NOT NULL DEFAULT 'new'` | `new`, `contacted`, `active`, `closed` |
| `created_at` | `timestamptz` | `now()` |
| `updated_at` | `timestamptz` | `now()` |

### `notes` table

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `lead_id` | `uuid NOT NULL` | FK → `leads.id` ON DELETE CASCADE |
| `content` | `text NOT NULL` | |
| `author_email` | `text NOT NULL` | logged-in user's email |
| `created_at` | `timestamptz` | `now()` |

### `tasks` table

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `lead_id` | `uuid NOT NULL` | FK → `leads.id` ON DELETE CASCADE |
| `title` | `text NOT NULL` | |
| `completed` | `boolean DEFAULT false` | |
| `due_date` | `date` | nullable |
| `created_at` | `timestamptz` | `now()` |
| `updated_at` | `timestamptz` | `now()` |

### SQL

```sql
-- leads
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  interest_type text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'active', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- notes
CREATE TABLE notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  content text NOT NULL,
  author_email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- tasks
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  title text NOT NULL,
  completed boolean DEFAULT false,
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 3. RLS Policies

**Principle:** Anon key gets **zero** table access. Only authenticated admin users can read/write.

```sql
-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Helper: is the user an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT auth.jwt() ->> 'email') IN (
    'kminovski@gmail.com',
    'nminovski@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Leads: full CRUD for admins, nothing for anyone else
CREATE POLICY "Admin full access" ON leads
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Notes: same
CREATE POLICY "Admin full access" ON notes
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Tasks: same
CREATE POLICY "Admin full access" ON tasks
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());
```

No `INSERT` policy for anon — form submissions go through the Edge Function using the service role key.

---

## 4. Edge Function: `submit-lead`

**Path:** `supabase/functions/submit-lead/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { first_name, last_name, email, phone, interest_type, message } = await req.json();

    // Validate required fields
    if (!first_name || !last_name || !email || !interest_type) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert lead with service role (bypasses RLS)
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { error } = await supabase.from("leads").insert({
      first_name, last_name, email, phone, interest_type, message,
    });

    if (error) throw error;

    // Send email notification via Resend
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "K8ts Estates <leads@k8tsestates.com>",
        to: "kminovski@gmail.com",
        subject: `New Lead: ${first_name} ${last_name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${first_name} ${last_name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Interest:</strong> ${interest_type}</p>
          <p><strong>Message:</strong> ${message || "None"}</p>
        `,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

**Deployment:** `npx supabase functions deploy submit-lead`

**Edge Function env vars** (set in Supabase dashboard → Edge Functions → Secrets):
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`

---

## 5. Email Notification Approach

**Provider: [Resend](https://resend.com)**
- Free tier: 3,000 emails/month (more than enough)
- Simple API, no SMTP config needed
- Requires domain verification for custom `from` address (or use `onboarding@resend.dev` for testing)

**Setup:**
1. Create Resend account
2. Add & verify `k8tsestates.com` domain (DNS TXT/MX records)
3. Generate API key → store as Edge Function secret `RESEND_API_KEY`

**Alternative:** If domain verification is too much friction, use Supabase's built-in `pg_net` to call a webhook, or just use `onboarding@resend.dev` as sender during development.

---

## 6. Admin Dashboard — Pages & Components

### New dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Route structure

```
app/
├── (admin)/
│   ├── layout.tsx          # Auth gate + admin shell (sidebar, nav)
│   ├── admin/
│   │   ├── page.tsx        # Dashboard overview (counts by status, recent leads)
│   │   ├── clients/
│   │   │   ├── page.tsx    # Client list with search/filter/status tabs
│   │   │   └── [id]/
│   │   │       └── page.tsx # Client detail: info, notes, tasks, status
│   │   └── login/
│   │       └── page.tsx    # Login form
```

### Components

| Component | Description |
|---|---|
| `AdminShell` | Sidebar nav + top bar with logout. Clean, minimal. |
| `StatusBadge` | Colored pill: 🟢 new, 🔵 contacted, 🟡 active, ⚫ closed |
| `ClientTable` | Sortable table with name, email, interest, status, date. Click → detail. |
| `StatusPipeline` | Horizontal pipeline/kanban at top of client list showing counts per status. Clickable to filter. |
| `ClientDetail` | Header with client info + status dropdown. Two tabs below: Notes & Tasks. |
| `NotesList` | Chronological notes with "Add note" textarea at top. |
| `TaskList` | Checklist with title, due date, checkbox. "Add task" inline form. |
| `StatCard` | Dashboard overview card (number + label). |
| `SearchBar` | Text search filtering client list by name/email. |

### UX notes (Katherine-friendly)

- **No jargon.** Labels: "Clients" not "Leads." "Status" not "Pipeline stage."
- **Big click targets.** Table rows are full-width clickable.
- **Instant feedback.** Optimistic UI updates on status change, note add, task toggle.
- **Mobile responsive.** She might check on her phone.
- **Minimal navigation.** Sidebar has only: Dashboard, Clients, Logout.

---

## 7. Auth Flow

### Implementation

1. **Supabase Auth with email/password** (simplest for 2 users)
2. Pre-create accounts in Supabase dashboard for both emails
3. Public signups disabled — nobody else can register

### Flow

```
User visits /admin
  → (admin)/layout.tsx checks Supabase session
  → No session? Redirect to /admin/login
  → Login form: email + password → supabase.auth.signInWithPassword()
  → On success: redirect to /admin
  → On every admin page load: middleware validates session
```

### Middleware (`middleware.ts`)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  // Only protect /admin routes (except /admin/login)
  if (request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.startsWith('/admin/login')) {

    const supabase = createServerClient(/* ... */)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !['kminovski@gmail.com', 'nminovski@gmail.com'].includes(user.email)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
```

---

## 8. Phases

### Phase 1 — Foundation (build first)
- [ ] Supabase project + database tables + RLS
- [ ] Edge Function `submit-lead` (insert + email)
- [ ] Wire up existing contact form to call Edge Function
- [ ] Verify: form submits → row in DB + email sent

### Phase 2 — Admin Core
- [ ] Install Supabase client deps
- [ ] Auth: login page, middleware, session management
- [ ] Admin layout (shell, sidebar, nav)
- [ ] Client list page (table with status filter)
- [ ] Client detail page (info + status dropdown)

### Phase 3 — CRM Features
- [ ] Notes: add/view per client
- [ ] Tasks: add/toggle/view per client
- [ ] Dashboard overview page (stat cards, recent leads)
- [ ] Status pipeline visualization on client list

### Phase 4 — Polish
- [ ] Mobile responsive refinements
- [ ] Loading states & error handling
- [ ] Search/filter on client list
- [ ] Resend domain verification (custom from address)
- [ ] Test end-to-end with Katherine

---

## Environment Variables Summary

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | Client-side Supabase connection |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | Client-side auth (no table access) |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Function secrets | Insert leads bypassing RLS |
| `RESEND_API_KEY` | Edge Function secrets | Send email notifications |

---

## Security Summary

- ✅ Anon key has **zero** table access (RLS blocks everything for unauthenticated)
- ✅ Form submissions go through Edge Function with service role key
- ✅ Service role key never exposed to client
- ✅ RLS policies restrict all table ops to two specific emails
- ✅ Auth middleware double-checks email allowlist
- ✅ Public signups disabled

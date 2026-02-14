'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, Loader2, MapPin, Calendar } from 'lucide-react';

type OpenHouse = {
  id: string;
  property_address: string;
  city: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  status: string;
  slug: string;
};

const HOW_HEARD_OPTIONS = [
  { value: '', label: 'Select one...' },
  { value: 'sign', label: 'Saw the sign' },
  { value: 'online', label: 'Online listing' },
  { value: 'referral', label: 'Referral' },
  { value: 'drive-by', label: 'Drove by' },
  { value: 'other', label: 'Other' },
];

export default function OpenHouseSignIn() {
  const { slug } = useParams<{ slug: string }>();
  const [openHouse, setOpenHouse] = useState<OpenHouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    working_with_agent: false,
    agent_name: '',
    how_heard: '',
    notes: '',
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('open_houses')
        .select('id, property_address, city, date, start_time, end_time, status, slug')
        .eq('slug', slug)
        .single();
      if (error || !data) {
        setNotFound(true);
      } else {
        setOpenHouse(data);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/open-house-signin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ slug, ...form }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-warm">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    );
  }

  if (notFound || !openHouse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-warm px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-900 mb-2">Open House Not Found</h1>
          <p className="text-brand-500">This open house link is no longer active.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-warm px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-brand-900 mb-2">Thanks for visiting!</h1>
          <p className="text-brand-500">Katherine will follow up with you.</p>
        </div>
      </div>
    );
  }

  const dateStr = new Date(openHouse.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-base-warm">
      {/* Header */}
      <div className="bg-brand-900 text-white px-4 py-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
          <span className="font-bold text-lg">K8</span>
        </div>
        <p className="text-sm text-white/60 uppercase tracking-wider mb-1">Open House</p>
        <h1 className="text-xl font-bold">{openHouse.property_address}</h1>
        <div className="flex items-center justify-center gap-4 mt-2 text-sm text-white/70">
          {openHouse.city && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {openHouse.city}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {dateStr}
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold text-brand-900 mb-1">Welcome! Please sign in.</h2>
        <p className="text-sm text-brand-500 mb-6">We&apos;d love to stay in touch.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-brand-600 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-brand-900 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-600 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-brand-900 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-600 mb-1">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-brand-900 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-600 mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-brand-900 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-600 mb-1">
              Are you currently working with a real estate agent?
            </label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2 text-sm text-brand-700 cursor-pointer">
                <input
                  type="radio"
                  name="agent"
                  checked={form.working_with_agent}
                  onChange={() => setForm({ ...form, working_with_agent: true })}
                  className="accent-accent-500"
                />
                Yes
              </label>
              <label className="flex items-center gap-2 text-sm text-brand-700 cursor-pointer">
                <input
                  type="radio"
                  name="agent"
                  checked={!form.working_with_agent}
                  onChange={() => setForm({ ...form, working_with_agent: false, agent_name: '' })}
                  className="accent-accent-500"
                />
                No
              </label>
            </div>
          </div>

          {form.working_with_agent && (
            <div>
              <label className="block text-xs font-medium text-brand-600 mb-1">Agent Name</label>
              <input
                type="text"
                value={form.agent_name}
                onChange={(e) => setForm({ ...form, agent_name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-brand-900 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-brand-600 mb-1">
              How did you hear about this property?
            </label>
            <select
              value={form.how_heard}
              onChange={(e) => setForm({ ...form, how_heard: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-brand-900 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 bg-white"
            >
              {HOW_HEARD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-600 mb-1">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-brand-900 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-brand-900 text-white font-semibold rounded-xl hover:bg-brand-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-brand-400 mt-6">
          K8ts Estates · Katherine Minovski
        </p>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  Plus, MapPin, Calendar, Users, ExternalLink, Loader2, X,
  Copy, Check, ChevronDown, Trash2
} from 'lucide-react';

type OpenHouse = {
  id: string;
  property_address: string;
  city: string | null;
  date: string;
  mls_number: string | null;
  description: string | null;
  slug: string;
  status: string;
  created_at: string;
  visitor_count: number;
};

const STATUS_COLORS: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-700',
  active: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-gray-100 text-gray-600',
};

function generateSlug(address: string, date: string): string {
  const addr = address.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const d = date.replace(/-/g, '');
  return `${addr}-${d}`;
}

export default function OpenHousesPage() {
  const router = useRouter();
  const [openHouses, setOpenHouses] = useState<OpenHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState<{ url: string; address: string } | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ id: string; address: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    property_address: '',
    city: '',
    date: '',
    mls_number: '',
    description: '',
  });

  const fetchAll = useCallback(async () => {
    const supabase = createClient();
    const { data: ohs } = await supabase
      .from('open_houses')
      .select('*')
      .order('date', { ascending: false });

    if (!ohs) { setOpenHouses([]); setLoading(false); return; }

    // Get visitor counts
    const { data: visitors } = await supabase
      .from('open_house_visitors')
      .select('open_house_id');

    const countMap = new Map<string, number>();
    (visitors || []).forEach((v: any) => {
      countMap.set(v.open_house_id, (countMap.get(v.open_house_id) || 0) + 1);
    });

    setOpenHouses(ohs.map((oh: any) => ({
      ...oh,
      visitor_count: countMap.get(oh.id) || 0,
    })));
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.property_address || !form.date) return;
    setSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const slug = generateSlug(form.property_address, form.date);

    await supabase.from('open_houses').insert({
      property_address: form.property_address,
      city: form.city || null,
      date: form.date,
      mls_number: form.mls_number || null,
      description: form.description || null,
      slug,
      created_by: user?.id || null,
    });

    setForm({ property_address: '', city: '', date: '', mls_number: '', description: '' });
    setShowForm(false);
    setSaving(false);
    fetchAll();
  }

  function getPublicUrl(slug: string) {
    return `${window.location.origin}/openhouse/${slug}`;
  }

  async function copyLink(slug: string) {
    await navigator.clipboard.writeText(getPublicUrl(slug));
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  }

  async function showQR(slug: string, address: string) {
    const url = getPublicUrl(slug);
    const dataUrl = await QRCode.toDataURL(url, { width: 400, margin: 2 });
    setQrDataUrl(dataUrl);
    setQrModal({ url, address });
  }

  function downloadQR() {
    if (!qrDataUrl || !qrModal) return;
    const link = document.createElement('a');
    link.download = `openhouse-qr-${qrModal.address.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = qrDataUrl;
    link.click();
  }

  async function handleDelete() {
    if (!deleteModal) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from('open_houses').delete().eq('id', deleteModal.id);
    setDeleteModal(null);
    setDeleting(false);
    fetchAll();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-900">Open Houses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 text-white text-sm font-medium rounded-lg hover:bg-brand-800 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Open House
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-brand-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-brand-900">Create Open House</h2>
            <button onClick={() => setShowForm(false)} className="text-brand-400 hover:text-brand-700">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-brand-500 mb-1">Property Address *</label>
                <input
                  type="text"
                  required
                  value={form.property_address}
                  onChange={(e) => setForm({ ...form, property_address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-500 mb-1">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-brand-500 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-500 mb-1">MLS #</label>
                <input
                  type="text"
                  value={form.mls_number}
                  onChange={(e) => setForm({ ...form, mls_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-500 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400 resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 text-white text-sm font-medium rounded-lg hover:bg-brand-800 disabled:opacity-40"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-8 text-brand-400">Loading...</div>
      ) : openHouses.length === 0 ? (
        <div className="text-center py-12 text-brand-400">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-brand-300" />
          <p>No open houses yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {openHouses.map((oh) => (
            <div key={oh.id} className="bg-white rounded-xl border border-brand-100 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => router.push(`/admin/open-houses/${oh.id}`)}
                >
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-brand-900">{oh.property_address}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[oh.status] || ''}`}>
                      {oh.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-brand-500">
                    {oh.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {oh.city}</span>}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(oh.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {oh.visitor_count} visitor{oh.visitor_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => copyLink(oh.slug)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors"
                    title="Copy public link"
                  >
                    {copied === oh.slug ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    {copied === oh.slug ? 'Copied' : 'Link'}
                  </button>
                  <button
                    onClick={() => showQR(oh.slug, oh.property_address)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors"
                    title="Show QR code"
                  >
                    QR
                  </button>
                  <Link
                    href={`/openhouse/${oh.slug}`}
                    target="_blank"
                    className="p-1.5 text-brand-400 hover:text-accent-600"
                    title="Open public page"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal({ id: oh.id, address: oh.property_address });
                    }}
                    className="p-1.5 text-brand-400 hover:text-rose-500 transition-colors"
                    title="Delete open house"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setQrModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-brand-900">QR Code</h3>
              <button onClick={() => setQrModal(null)} className="text-brand-400 hover:text-brand-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-brand-500 mb-4">{qrModal.address}</p>
            <div className="flex justify-center mb-4">
              {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-64 h-64" />}
            </div>
            <p className="text-xs text-brand-400 text-center mb-4 break-all">{qrModal.url}</p>
            <div className="flex gap-2">
              <button
                onClick={downloadQR}
                className="flex-1 py-2 bg-brand-900 text-white text-sm font-medium rounded-lg hover:bg-brand-800"
              >
                Download QR
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(qrModal.url); }}
                className="flex-1 py-2 border border-brand-200 text-brand-700 text-sm font-medium rounded-lg hover:bg-brand-50"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => !deleting && setDeleteModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-brand-900">Delete Open House</h3>
              <button onClick={() => setDeleteModal(null)} disabled={deleting} className="text-brand-400 hover:text-brand-700 disabled:opacity-40">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-brand-600 mb-2">{deleteModal.address}</p>
            <p className="text-sm text-brand-500 mb-6">
              Delete this open house? This will remove all visitor records. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteModal(null)}
                disabled={deleting}
                className="flex-1 py-2 border border-brand-200 text-brand-700 text-sm font-medium rounded-lg hover:bg-brand-50 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 disabled:opacity-40"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

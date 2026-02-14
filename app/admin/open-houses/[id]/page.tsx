'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  ArrowLeft, MapPin, Calendar, Clock, Users, DollarSign, Copy,
  Check, ExternalLink, X, Loader2
} from 'lucide-react';

type OpenHouseDetail = {
  id: string;
  property_address: string;
  city: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  mls_number: string | null;
  listing_price: number | null;
  description: string | null;
  slug: string;
  status: string;
};

type Visitor = {
  id: string;
  client_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  working_with_agent: boolean;
  agent_name: string | null;
  how_heard: string | null;
  notes: string | null;
  signed_in_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-700',
  active: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-gray-100 text-gray-600',
};

export default function OpenHouseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [oh, setOh] = useState<OpenHouseDetail | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showQR, setShowQR] = useState(false);

  const fetchAll = useCallback(async () => {
    const supabase = createClient();
    const [ohRes, visitorsRes] = await Promise.all([
      supabase.from('open_houses').select('*').eq('id', id).single(),
      supabase.from('open_house_visitors').select('*').eq('open_house_id', id).order('signed_in_at', { ascending: false }),
    ]);
    setOh(ohRes.data);
    setVisitors(visitorsRes.data || []);
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function updateStatus(status: string) {
    if (!oh) return;
    const supabase = createClient();
    await supabase.from('open_houses').update({ status }).eq('id', id);
    setOh({ ...oh, status });
  }

  function getPublicUrl() {
    return oh ? `${window.location.origin}/openhouse/${oh.slug}` : '';
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(getPublicUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShowQR() {
    const dataUrl = await QRCode.toDataURL(getPublicUrl(), { width: 400, margin: 2 });
    setQrDataUrl(dataUrl);
    setShowQR(true);
  }

  function downloadQR() {
    if (!qrDataUrl || !oh) return;
    const link = document.createElement('a');
    link.download = `openhouse-qr-${oh.slug}.png`;
    link.href = qrDataUrl;
    link.click();
  }

  if (loading) return <div className="p-8 text-center text-brand-400">Loading...</div>;
  if (!oh) return <div className="p-8 text-center text-brand-400">Open house not found</div>;

  const dateStr = new Date(oh.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div>
      <Link href="/admin/open-houses" className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-900 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Open Houses
      </Link>

      {/* Property info */}
      <div className="bg-white rounded-xl border border-brand-100 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-brand-900">{oh.property_address}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[oh.status]}`}>{oh.status}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-brand-500">
              {oh.city && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {oh.city}</span>}
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {dateStr}</span>
              {(oh.start_time || oh.end_time) && (
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {oh.start_time || '?'} – {oh.end_time || '?'}</span>
              )}
              {oh.listing_price && (
                <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> ${oh.listing_price.toLocaleString()}</span>
              )}
              {oh.mls_number && <span>MLS# {oh.mls_number}</span>}
            </div>
            {oh.description && <p className="text-sm text-brand-600 mt-3">{oh.description}</p>}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={oh.status}
              onChange={(e) => updateStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-brand-200 text-sm text-brand-700 outline-none focus:border-accent-400"
            >
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-brand-100">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={handleShowQR}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50"
          >
            QR Code
          </button>
          <Link
            href={`/openhouse/${oh.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Open Public Page
          </Link>
        </div>
      </div>

      {/* Visitors */}
      <div className="bg-white rounded-xl border border-brand-100 overflow-hidden">
        <div className="p-5 border-b border-brand-100 flex items-center justify-between">
          <h2 className="font-semibold text-brand-900 flex items-center gap-2">
            <Users className="h-4 w-4" /> Visitors
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-600 font-medium">{visitors.length}</span>
          </h2>
        </div>

        {visitors.length === 0 ? (
          <div className="p-8 text-center text-brand-400 text-sm">
            No visitors have signed in yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-100 bg-brand-50/50">
                  <th className="text-left px-4 py-3 font-medium text-brand-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600 hidden md:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600 hidden lg:table-cell">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600">Agent?</th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600 hidden md:table-cell">How Heard</th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600">Signed In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {visitors.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-brand-50/50 cursor-pointer transition-colors"
                    onClick={() => v.client_id && router.push(`/admin/clients/${v.client_id}`)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-900">{v.first_name} {v.last_name}</p>
                      <p className="text-xs text-brand-400 md:hidden">{v.email}</p>
                    </td>
                    <td className="px-4 py-3 text-brand-600 hidden md:table-cell">{v.email}</td>
                    <td className="px-4 py-3 text-brand-600 hidden lg:table-cell">{v.phone || '—'}</td>
                    <td className="px-4 py-3">
                      {v.working_with_agent ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                          Yes{v.agent_name ? ` — ${v.agent_name}` : ''}
                        </span>
                      ) : (
                        <span className="text-xs text-brand-400">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brand-600 hidden md:table-cell capitalize">{v.how_heard || '—'}</td>
                    <td className="px-4 py-3 text-brand-500 text-xs">
                      {new Date(v.signed_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowQR(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-brand-900">QR Code</h3>
              <button onClick={() => setShowQR(false)} className="text-brand-400 hover:text-brand-700"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex justify-center mb-4">
              {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-64 h-64" />}
            </div>
            <div className="flex gap-2">
              <button onClick={downloadQR} className="flex-1 py-2 bg-brand-900 text-white text-sm font-medium rounded-lg hover:bg-brand-800">Download</button>
              <button onClick={() => setShowQR(false)} className="flex-1 py-2 border border-brand-200 text-brand-700 text-sm font-medium rounded-lg hover:bg-brand-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

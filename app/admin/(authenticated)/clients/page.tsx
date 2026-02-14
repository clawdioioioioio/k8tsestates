'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Search, ArrowUpDown, Filter } from 'lucide-react';

const STATUSES = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New', color: 'bg-emerald-100 text-emerald-700' },
  { key: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-700' },
  { key: 'active', label: 'Active', color: 'bg-amber-100 text-amber-700' },
  { key: 'closed_won', label: 'Won', color: 'bg-green-100 text-green-700' },
  { key: 'closed_lost', label: 'Lost', color: 'bg-gray-100 text-gray-600' },
];

type Tag = { id: string; name: string; color: string };

type ClientRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  inquiry_count: number;
  latest_status: string;
  latest_interest: string;
  last_contact: string | null;
  tags: Tag[];
  deal_count: number;
  deal_types: string[];
};

type SortField = 'name' | 'created_at' | 'inquiry_count' | 'last_contact';

function getContactIndicator(lastContact: string | null): { color: string; label: string } {
  if (!lastContact) return { color: 'bg-gray-300', label: 'Never contacted' };
  const days = Math.floor((Date.now() - new Date(lastContact).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 30) return { color: 'bg-emerald-400', label: `${days}d ago` };
  if (days <= 60) return { color: 'bg-amber-400', label: `${days}d ago` };
  return { color: 'bg-rose-400', label: `${days}d ago` };
}

export default function ClientsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortAsc, setSortAsc] = useState(false);

  const fetchClients = useCallback(async () => {
    const supabase = createClient();

    const [clientsRes, tagsRes, clientTagsRes, interactionsRes, txRes] = await Promise.all([
      supabase.from('clients').select('*, inquiries(id, status, interest_type, created_at)').order('created_at', { ascending: false }),
      supabase.from('tags').select('*').order('name'),
      supabase.from('client_tags').select('client_id, tag_id'),
      supabase.from('interactions').select('client_id, interaction_date').order('interaction_date', { ascending: false }),
      supabase.from('transactions').select('client_id, type'),
    ]);

    const tags = tagsRes.data || [];
    setAllTags(tags);

    const tagMap = new Map<string, string[]>();
    (clientTagsRes.data || []).forEach((ct: any) => {
      if (!tagMap.has(ct.client_id)) tagMap.set(ct.client_id, []);
      tagMap.get(ct.client_id)!.push(ct.tag_id);
    });

    // Get latest interaction per client
    const lastContactMap = new Map<string, string>();
    (interactionsRes.data || []).forEach((i: any) => {
      if (!lastContactMap.has(i.client_id)) {
        lastContactMap.set(i.client_id, i.interaction_date);
      }
    });

    // Transaction counts per client
    const txCountMap = new Map<string, number>();
    const txTypeMap = new Map<string, Set<string>>();
    (txRes.data || []).forEach((tx: any) => {
      txCountMap.set(tx.client_id, (txCountMap.get(tx.client_id) || 0) + 1);
      if (!txTypeMap.has(tx.client_id)) txTypeMap.set(tx.client_id, new Set());
      txTypeMap.get(tx.client_id)!.add(tx.type);
    });

    if (!clientsRes.data) { setClients([]); setLoading(false); return; }

    const rows: ClientRow[] = clientsRes.data.map((c: any) => {
      const inqs = c.inquiries || [];
      const sorted = [...inqs].sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const clientTags = (tagMap.get(c.id) || []).map((tid) => tags.find((t) => t.id === tid)).filter(Boolean) as Tag[];
      return {
        id: c.id,
        first_name: c.first_name,
        last_name: c.last_name,
        email: c.email,
        phone: c.phone,
        created_at: c.created_at,
        inquiry_count: inqs.length,
        latest_status: sorted[0]?.status || '',
        latest_interest: sorted[0]?.interest_type || '',
        last_contact: lastContactMap.get(c.id) || null,
        tags: clientTags,
        deal_count: txCountMap.get(c.id) || 0,
        deal_types: Array.from(txTypeMap.get(c.id) || []),
      };
    });

    if (statusFilter !== 'all') {
      setClients(rows.filter((c) => c.latest_status === statusFilter));
    } else {
      setClients(rows);
    }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const filtered = clients
    .filter((c) => {
      if (tagFilter && !c.tags.some((t) => t.id === tagFilter)) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        c.first_name.toLowerCase().includes(s) ||
        c.last_name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        (c.phone && c.phone.includes(s))
      );
    })
    .sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
          break;
        case 'created_at':
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'inquiry_count':
          cmp = a.inquiry_count - b.inquiry_count;
          break;
        case 'last_contact':
          const aTime = a.last_contact ? new Date(a.last_contact).getTime() : 0;
          const bTime = b.last_contact ? new Date(b.last_contact).getTime() : 0;
          cmp = aTime - bTime;
          break;
      }
      return sortAsc ? cmp : -cmp;
    });

  function toggleSort(field: SortField) {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(field === 'name'); }
  }

  const statusColor = (status: string) =>
    STATUSES.find((s) => s.key === status)?.color || 'bg-gray-100 text-gray-600';
  const statusLabel = (status: string) =>
    STATUSES.find((s) => s.key === status)?.label || status;

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900 mb-6">Clients</h1>

      {/* Status filter pills */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {STATUSES.map((s) => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(s.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              statusFilter === s.key
                ? 'bg-brand-900 text-white'
                : 'bg-white text-brand-600 border border-brand-200 hover:bg-brand-50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setShowTagFilter(!showTagFilter)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            tagFilter ? 'bg-accent-100 text-accent-700 border border-accent-200' : 'bg-white text-brand-500 border border-brand-200 hover:bg-brand-50'
          }`}
        >
          <Filter className="h-3 w-3" />
          {tagFilter ? allTags.find((t) => t.id === tagFilter)?.name : 'Filter by tag'}
        </button>
        {showTagFilter && (
          <div className="flex flex-wrap gap-1.5">
            {tagFilter && (
              <button
                onClick={() => { setTagFilter(null); setShowTagFilter(false); }}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-600 hover:bg-brand-200"
              >
                Clear
              </button>
            )}
            {allTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => { setTagFilter(tag.id === tagFilter ? null : tag.id); setShowTagFilter(false); }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium text-white transition-opacity ${
                  tagFilter === tag.id ? 'opacity-100 ring-2 ring-offset-1 ring-brand-400' : 'opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition text-brand-900 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-brand-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-brand-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-brand-400">No clients found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-100 bg-brand-50/50">
                  <th className="text-left px-4 py-3 font-medium text-brand-600">
                    <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-brand-900">
                      Name <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600 hidden lg:table-cell">Tags</th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600 hidden md:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600">
                    <button onClick={() => toggleSort('last_contact')} className="flex items-center gap-1 hover:text-brand-900">
                      Last Contact <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600">
                    <button onClick={() => toggleSort('inquiry_count')} className="flex items-center gap-1 hover:text-brand-900">
                      Inquiries <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600 hidden lg:table-cell">Deals</th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600">Latest Status</th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600 hidden sm:table-cell">
                    <button onClick={() => toggleSort('created_at')} className="flex items-center gap-1 hover:text-brand-900">
                      Since <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {filtered.map((client) => {
                  const indicator = getContactIndicator(client.last_contact);
                  return (
                    <tr
                      key={client.id}
                      onClick={() => router.push(`/admin/clients/${client.id}`)}
                      className="hover:bg-brand-50/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-brand-900">{client.first_name} {client.last_name}</p>
                        <p className="text-xs text-brand-400 md:hidden">{client.email}</p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {client.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                              style={{ backgroundColor: tag.color }}
                            >
                              {tag.name}
                            </span>
                          ))}
                          {client.tags.length > 3 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-100 text-brand-500">
                              +{client.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-brand-600 hidden md:table-cell">{client.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${indicator.color}`} title={indicator.label} />
                          <span className="text-xs text-brand-500">{indicator.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-brand-600 font-medium">{client.inquiry_count}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {client.deal_count > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-brand-600 font-medium">{client.deal_count}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                              client.deal_types.includes('buy') && client.deal_types.includes('sell')
                                ? 'bg-purple-100 text-purple-700'
                                : client.deal_types.includes('buy')
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {client.deal_types.includes('buy') && client.deal_types.includes('sell')
                                ? 'Buyer & Seller'
                                : client.deal_types.includes('buy')
                                ? 'Buyer'
                                : 'Seller'}
                            </span>
                            {client.deal_count >= 2 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">Repeat</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-brand-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {client.latest_status && (
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(client.latest_status)}`}>
                            {statusLabel(client.latest_status)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-brand-500 hidden sm:table-cell">
                        {new Date(client.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

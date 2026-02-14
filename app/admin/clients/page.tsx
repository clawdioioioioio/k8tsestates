'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Search, ArrowUpDown } from 'lucide-react';

const STATUSES = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New', color: 'bg-emerald-100 text-emerald-700' },
  { key: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-700' },
  { key: 'active', label: 'Active', color: 'bg-amber-100 text-amber-700' },
  { key: 'closed_won', label: 'Won', color: 'bg-green-100 text-green-700' },
  { key: 'closed_lost', label: 'Lost', color: 'bg-gray-100 text-gray-600' },
];

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
};

type SortField = 'name' | 'created_at' | 'inquiry_count';

export default function ClientsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortAsc, setSortAsc] = useState(false);

  const fetchClients = useCallback(async () => {
    const supabase = createClient();

    // Fetch clients with their inquiries
    const { data: clientsData } = await supabase
      .from('clients')
      .select('*, inquiries(id, status, interest_type, created_at)')
      .order('created_at', { ascending: false });

    if (!clientsData) { setClients([]); setLoading(false); return; }

    const rows: ClientRow[] = clientsData.map((c: any) => {
      const inqs = c.inquiries || [];
      const sorted = [...inqs].sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
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
      };
    });

    // Filter by status if needed
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
      }
      return sortAsc ? cmp : -cmp;
    });

  function toggleSort(field: SortField) {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  }

  const statusColor = (status: string) =>
    STATUSES.find((s) => s.key === status)?.color || 'bg-gray-100 text-gray-600';
  const statusLabel = (status: string) =>
    STATUSES.find((s) => s.key === status)?.label || status;

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900 mb-6">Clients</h1>

      {/* Status filter pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
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
                  <th className="text-left px-4 py-3 font-medium text-brand-600 hidden md:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600">
                    <button onClick={() => toggleSort('inquiry_count')} className="flex items-center gap-1 hover:text-brand-900">
                      Inquiries <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600 hidden lg:table-cell">Latest Interest</th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600">Latest Status</th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600 hidden sm:table-cell">
                    <button onClick={() => toggleSort('created_at')} className="flex items-center gap-1 hover:text-brand-900">
                      Since <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {filtered.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => router.push(`/admin/clients/${client.id}`)}
                    className="hover:bg-brand-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-900">{client.first_name} {client.last_name}</p>
                      <p className="text-xs text-brand-400 md:hidden">{client.email}</p>
                    </td>
                    <td className="px-4 py-3 text-brand-600 hidden md:table-cell">{client.email}</td>
                    <td className="px-4 py-3 text-brand-600 font-medium">{client.inquiry_count}</td>
                    <td className="px-4 py-3 text-brand-600 hidden lg:table-cell">{client.latest_interest}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

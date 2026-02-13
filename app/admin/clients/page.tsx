'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Search, ChevronDown, ArrowUpDown } from 'lucide-react';

const STATUSES = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New', color: 'bg-emerald-100 text-emerald-700' },
  { key: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-700' },
  { key: 'active', label: 'Active', color: 'bg-amber-100 text-amber-700' },
  { key: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-600' },
];

type Lead = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  interest_type: string;
  status: string;
  created_at: string;
};

type SortField = 'name' | 'created_at' | 'status' | 'interest_type';

export default function ClientsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortAsc, setSortAsc] = useState(false);

  const fetchLeads = useCallback(async () => {
    const supabase = createClient();
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data } = await query;
    setLeads(data || []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filtered = leads
    .filter((l) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        l.first_name.toLowerCase().includes(s) ||
        l.last_name.toLowerCase().includes(s) ||
        l.email.toLowerCase().includes(s) ||
        (l.phone && l.phone.includes(s))
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
        case 'status':
          cmp = a.status.localeCompare(b.status);
          break;
        case 'interest_type':
          cmp = a.interest_type.localeCompare(b.interest_type);
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900 mb-6">Clients</h1>

      {/* Pipeline counts */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {STATUSES.map((s) => {
          const count = s.key === 'all' ? leads.length : leads.filter((l) => l.status === s.key).length;
          // When filtering, use total from DB not filtered
          return (
            <button
              key={s.key}
              onClick={() => { setStatusFilter(s.key); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === s.key
                  ? 'bg-brand-900 text-white'
                  : 'bg-white text-brand-600 border border-brand-200 hover:bg-brand-50'
              }`}
            >
              {s.label}
            </button>
          );
        })}
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
                  <th className="text-left px-4 py-3 font-medium text-brand-600 hidden lg:table-cell">
                    <button onClick={() => toggleSort('interest_type')} className="flex items-center gap-1 hover:text-brand-900">
                      Interest <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600">
                    <button onClick={() => toggleSort('status')} className="flex items-center gap-1 hover:text-brand-900">
                      Status <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-brand-600 hidden sm:table-cell">
                    <button onClick={() => toggleSort('created_at')} className="flex items-center gap-1 hover:text-brand-900">
                      Date <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => router.push(`/admin/clients/${lead.id}`)}
                    className="hover:bg-brand-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-900">{lead.first_name} {lead.last_name}</p>
                      <p className="text-xs text-brand-400 md:hidden">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3 text-brand-600 hidden md:table-cell">{lead.email}</td>
                    <td className="px-4 py-3 text-brand-600 hidden lg:table-cell">{lead.interest_type}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(lead.status)}`}>
                        {STATUSES.find((s) => s.key === lead.status)?.label || lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brand-500 hidden sm:table-cell">
                      {new Date(lead.created_at).toLocaleDateString()}
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

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Users, UserPlus, PhoneCall, CheckCircle2, ArrowRight, FileText, TrendingUp, Gift, AlertTriangle, Award } from 'lucide-react';
import { GoingColdWidget } from '@/components/admin/GoingColdWidget';

const STATUS_CONFIG = {
  new: { label: 'New', color: 'bg-emerald-100 text-emerald-700', icon: UserPlus },
  contacted: { label: 'Contacted', color: 'bg-blue-100 text-blue-700', icon: PhoneCall },
  active: { label: 'Active', color: 'bg-amber-100 text-amber-700', icon: TrendingUp },
  closed_won: { label: 'Closed (Won)', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  closed_lost: { label: 'Closed (Lost)', color: 'bg-gray-100 text-gray-600', icon: CheckCircle2 },
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: clients } = await supabase.from('clients').select('id, first_name, last_name, birthday, closing_anniversary, referred_by');
  const { data: inquiries } = await supabase.from('inquiries').select('id, status, client_id');
  const { data: interactions } = await supabase.from('interactions').select('client_id, interaction_date').order('interaction_date', { ascending: false });

  const inquiryCounts: Record<string, number> = { new: 0, contacted: 0, active: 0, closed_won: 0, closed_lost: 0 };
  inquiries?.forEach((i) => {
    if (i.status in inquiryCounts) inquiryCounts[i.status]++;
  });

  // Recent inquiries with client info
  const { data: recentInquiries } = await supabase
    .from('inquiries')
    .select('*, clients(first_name, last_name)')
    .order('created_at', { ascending: false })
    .limit(5);

  // Upcoming tasks with client info
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, clients(first_name, last_name)')
    .eq('completed', false)
    .order('due_date', { ascending: true })
    .limit(5);

  // --- Upcoming birthdays & anniversaries this week ---
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcoming: { type: 'birthday' | 'anniversary'; client: { id: string; first_name: string; last_name: string }; date: string }[] = [];

  clients?.forEach((c) => {
    if (c.birthday) {
      const bd = new Date(c.birthday + 'T00:00:00');
      const thisYear = new Date(now.getFullYear(), bd.getMonth(), bd.getDate());
      if (thisYear >= now && thisYear <= weekFromNow) {
        upcoming.push({ type: 'birthday', client: c, date: thisYear.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) });
      }
    }
    if (c.closing_anniversary) {
      const ca = new Date(c.closing_anniversary + 'T00:00:00');
      const thisYear = new Date(now.getFullYear(), ca.getMonth(), ca.getDate());
      if (thisYear >= now && thisYear <= weekFromNow) {
        upcoming.push({ type: 'anniversary', client: c, date: thisYear.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) });
      }
    }
  });

  // --- Going cold: no interaction in 60+ days ---
  const lastContactMap = new Map<string, string>();
  interactions?.forEach((i) => {
    if (!lastContactMap.has(i.client_id)) lastContactMap.set(i.client_id, i.interaction_date);
  });

  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const goingCold = (clients || [])
    .filter((c) => {
      const last = lastContactMap.get(c.id);
      return !last || new Date(last) < sixtyDaysAgo;
    })
    .slice(0, 5)
    .map((c) => ({
      ...c,
      last_contact: lastContactMap.get(c.id) || null,
      days_since: lastContactMap.get(c.id)
        ? Math.floor((now.getTime() - new Date(lastContactMap.get(c.id)!).getTime()) / (1000 * 60 * 60 * 24))
        : null,
    }));

  // --- Top referrers ---
  const referralCounts = new Map<string, number>();
  clients?.forEach((c) => {
    if (c.referred_by) {
      referralCounts.set(c.referred_by, (referralCounts.get(c.referred_by) || 0) + 1);
    }
  });
  const topReferrers = Array.from(referralCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([clientId, count]) => {
      const c = clients?.find((cl) => cl.id === clientId);
      return c ? { ...c, referral_count: count } : null;
    })
    .filter(Boolean) as { id: string; first_name: string; last_name: string; referral_count: number }[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900 mb-6">Dashboard</h1>

      {/* Top-level stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-brand-100">
          <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center mb-3">
            <Users className="h-5 w-5 text-brand-700" />
          </div>
          <p className="text-2xl font-bold text-brand-900">{clients?.length || 0}</p>
          <p className="text-sm text-brand-500">Total Clients</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-brand-100">
          <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center mb-3">
            <FileText className="h-5 w-5 text-accent-700" />
          </div>
          <p className="text-2xl font-bold text-brand-900">{inquiries?.length || 0}</p>
          <p className="text-sm text-brand-500">Total Inquiries</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-brand-100 col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
            <UserPlus className="h-5 w-5 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-brand-900">{inquiryCounts.new}</p>
          <p className="text-sm text-brand-500">New Inquiries</p>
        </div>
      </div>

      {/* Inquiry status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        {(Object.entries(STATUS_CONFIG) as [keyof typeof STATUS_CONFIG, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([key, config]) => (
          <Link
            key={key}
            href={`/admin/clients?status=${key}`}
            className="bg-white rounded-xl p-4 border border-brand-100 hover:shadow-md transition-shadow"
          >
            <div className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center mb-2`}>
              <config.icon className="h-4 w-4" />
            </div>
            <p className="text-xl font-bold text-brand-900">{inquiryCounts[key]}</p>
            <p className="text-xs text-brand-500">{config.label}</p>
          </Link>
        ))}
      </div>

      {/* New widgets row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Upcoming This Week */}
        <div className="bg-white rounded-xl border border-brand-100">
          <div className="p-5 border-b border-brand-100 flex items-center gap-2">
            <Gift className="h-4 w-4 text-accent-500" />
            <h2 className="font-semibold text-brand-900 text-sm">Upcoming This Week</h2>
          </div>
          <div className="divide-y divide-brand-50">
            {upcoming.length > 0 ? upcoming.map((item, i) => (
              <Link
                key={i}
                href={`/admin/clients/${item.client.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-brand-50/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {item.type === 'birthday' ? (
                    <Gift className="h-3.5 w-3.5 text-pink-500" />
                  ) : (
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-brand-900">{item.client.first_name} {item.client.last_name}</p>
                    <p className="text-xs text-brand-400">{item.type === 'birthday' ? 'Birthday' : 'Closing Anniversary'}</p>
                  </div>
                </div>
                <span className="text-xs text-brand-500">{item.date}</span>
              </Link>
            )) : (
              <p className="px-5 py-6 text-center text-brand-400 text-sm">Nothing upcoming this week</p>
            )}
          </div>
        </div>

        {/* Going Cold */}
        <div className="bg-white rounded-xl border border-brand-100">
          <div className="p-5 border-b border-brand-100 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-500" />
            <h2 className="font-semibold text-brand-900 text-sm">Going Cold (60+ days)</h2>
          </div>
          <div className="divide-y divide-brand-50">
            {goingCold.length > 0 ? goingCold.map((client) => (
              <GoingColdWidget key={client.id} client={client} />
            )) : (
              <p className="px-5 py-6 text-center text-brand-400 text-sm">All clients recently contacted!</p>
            )}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-white rounded-xl border border-brand-100">
          <div className="p-5 border-b border-brand-100 flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-500" />
            <h2 className="font-semibold text-brand-900 text-sm">Top Referrers</h2>
          </div>
          <div className="divide-y divide-brand-50">
            {topReferrers.length > 0 ? topReferrers.map((client) => (
              <Link
                key={client.id}
                href={`/admin/clients/${client.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-brand-50/50 transition-colors"
              >
                <p className="text-sm font-medium text-brand-900">{client.first_name} {client.last_name}</p>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                  {client.referral_count} referral{client.referral_count !== 1 ? 's' : ''}
                </span>
              </Link>
            )) : (
              <p className="px-5 py-6 text-center text-brand-400 text-sm">No referrals tracked yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent inquiries */}
        <div className="bg-white rounded-xl border border-brand-100">
          <div className="p-5 border-b border-brand-100 flex items-center justify-between">
            <h2 className="font-semibold text-brand-900">Recent Inquiries</h2>
            <Link href="/admin/clients" className="text-sm text-accent-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-brand-50">
            {recentInquiries?.length ? recentInquiries.map((inq: any) => (
              <Link
                key={inq.id}
                href={`/admin/clients/${inq.client_id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-brand-50/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-brand-900 text-sm">
                    {inq.clients?.first_name} {inq.clients?.last_name}
                  </p>
                  <p className="text-xs text-brand-400">{inq.interest_type}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_CONFIG[inq.status as keyof typeof STATUS_CONFIG]?.color || 'bg-gray-100'}`}>
                  {STATUS_CONFIG[inq.status as keyof typeof STATUS_CONFIG]?.label || inq.status}
                </span>
              </Link>
            )) : (
              <p className="px-5 py-8 text-center text-brand-400 text-sm">No inquiries yet</p>
            )}
          </div>
        </div>

        {/* Upcoming tasks */}
        <div className="bg-white rounded-xl border border-brand-100">
          <div className="p-5 border-b border-brand-100">
            <h2 className="font-semibold text-brand-900">Upcoming Tasks</h2>
          </div>
          <div className="divide-y divide-brand-50">
            {tasks?.length ? tasks.map((task: any) => (
              <Link
                key={task.id}
                href={`/admin/clients/${task.client_id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-brand-50/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-brand-900 text-sm">{task.title}</p>
                  <p className="text-xs text-brand-400">
                    {task.clients?.first_name} {task.clients?.last_name}
                  </p>
                </div>
                {task.due_date && (
                  <span className="text-xs text-brand-500">
                    {new Date(task.due_date).toLocaleDateString()}
                  </span>
                )}
              </Link>
            )) : (
              <p className="px-5 py-8 text-center text-brand-400 text-sm">No upcoming tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

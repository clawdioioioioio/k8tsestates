import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Users, UserPlus, PhoneCall, CheckCircle2, ArrowRight } from 'lucide-react';

const STATUS_CONFIG = {
  new: { label: 'New', color: 'bg-emerald-100 text-emerald-700', icon: UserPlus },
  contacted: { label: 'Contacted', color: 'bg-blue-100 text-blue-700', icon: PhoneCall },
  active: { label: 'Active', color: 'bg-amber-100 text-amber-700', icon: Users },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-600', icon: CheckCircle2 },
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Get counts by status
  const { data: leads } = await supabase.from('leads').select('id, status');
  const counts = { new: 0, contacted: 0, active: 0, closed: 0 };
  leads?.forEach((l) => {
    if (l.status in counts) counts[l.status as keyof typeof counts]++;
  });

  // Get recent leads
  const { data: recent } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // Get upcoming tasks
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, leads(first_name, last_name)')
    .eq('completed', false)
    .order('due_date', { ascending: true })
    .limit(5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900 mb-6">Dashboard</h1>

      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {(Object.entries(STATUS_CONFIG) as [keyof typeof STATUS_CONFIG, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([key, config]) => (
          <Link
            key={key}
            href={`/admin/clients?status=${key}`}
            className="bg-white rounded-xl p-5 border border-brand-100 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center mb-3`}>
              <config.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-brand-900">{counts[key]}</p>
            <p className="text-sm text-brand-500">{config.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        <div className="bg-white rounded-xl border border-brand-100">
          <div className="p-5 border-b border-brand-100 flex items-center justify-between">
            <h2 className="font-semibold text-brand-900">Recent Clients</h2>
            <Link href="/admin/clients" className="text-sm text-accent-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-brand-50">
            {recent?.length ? recent.map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/clients/${lead.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-brand-50/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-brand-900 text-sm">{lead.first_name} {lead.last_name}</p>
                  <p className="text-xs text-brand-400">{lead.interest_type}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_CONFIG[lead.status as keyof typeof STATUS_CONFIG]?.color || 'bg-gray-100'}`}>
                  {STATUS_CONFIG[lead.status as keyof typeof STATUS_CONFIG]?.label || lead.status}
                </span>
              </Link>
            )) : (
              <p className="px-5 py-8 text-center text-brand-400 text-sm">No clients yet</p>
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
                href={`/admin/clients/${task.lead_id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-brand-50/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-brand-900 text-sm">{task.title}</p>
                  <p className="text-xs text-brand-400">
                    {task.leads?.first_name} {task.leads?.last_name}
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

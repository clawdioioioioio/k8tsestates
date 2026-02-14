'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PhoneCall, Loader2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type GoingColdClient = {
  id: string;
  first_name: string;
  last_name: string;
  last_contact: string | null;
  days_since: number | null;
};

export function GoingColdWidget({ client }: { client: GoingColdClient }) {
  const [logging, setLogging] = useState(false);
  const [logged, setLogged] = useState(false);

  async function quickLogCall(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLogging(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('interactions').insert({
      client_id: client.id,
      interaction_type: 'call',
      notes: 'Quick check-in call',
      interaction_date: new Date().toISOString(),
      created_by: user?.id || null,
    });
    setLogging(false);
    setLogged(true);
  }

  return (
    <Link
      href={`/admin/clients/${client.id}`}
      className="flex items-center justify-between px-5 py-3 hover:bg-brand-50/50 transition-colors"
    >
      <div>
        <p className="text-sm font-medium text-brand-900">{client.first_name} {client.last_name}</p>
        <p className="text-xs text-brand-400">
          {client.days_since ? `${client.days_since} days ago` : 'Never contacted'}
        </p>
      </div>
      {logged ? (
        <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
          <Check className="h-3 w-3" /> Logged
        </span>
      ) : (
        <button
          onClick={quickLogCall}
          disabled={logging}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40 transition-colors"
        >
          {logging ? <Loader2 className="h-3 w-3 animate-spin" /> : <PhoneCall className="h-3 w-3" />}
          Log Call
        </button>
      )}
    </Link>
  );
}

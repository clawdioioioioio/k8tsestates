'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Mail, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-base-warm flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-900 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">K8</span>
          </div>
          <h1 className="text-2xl font-bold text-brand-900">Admin Login</h1>
          <p className="text-brand-500 text-sm mt-1">K8ts Estates Dashboard</p>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-100 text-center space-y-3">
            <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
            <h2 className="text-lg font-semibold text-brand-900">Check your email</h2>
            <p className="text-brand-500 text-sm">
              We sent a login link to <strong className="text-brand-700">{email}</strong>. Click the link in the email to sign in.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(''); }}
              className="text-sm text-accent-600 hover:text-accent-700 mt-2"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-brand-100 space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-base-warm rounded-xl border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition text-brand-900 text-sm"
                />
              </div>
            </div>

            {error && <p className="text-rose-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-900 text-white font-semibold rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

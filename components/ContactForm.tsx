'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      interest_type: formData.get('interest_type'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/submit-lead`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-accent-500 mb-4" />
        <h3 className="text-xl font-bold text-brand-900 mb-2">Message Sent!</h3>
        <p className="text-brand-500 mb-6">Katherine will get back to you shortly.</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-accent-600 font-medium hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          name="first_name"
          type="text"
          placeholder="First Name"
          required
          className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition text-brand-900 placeholder:text-brand-400 text-sm"
        />
        <input
          name="last_name"
          type="text"
          placeholder="Last Name"
          required
          className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition text-brand-900 placeholder:text-brand-400 text-sm"
        />
      </div>
      <input
        name="email"
        type="email"
        placeholder="Email Address"
        required
        className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition text-brand-900 placeholder:text-brand-400 text-sm"
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone Number"
        className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition text-brand-900 placeholder:text-brand-400 text-sm"
      />
      <select
        name="interest_type"
        required
        className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition text-brand-500 text-sm"
        defaultValue=""
      >
        <option value="" disabled>I&apos;m interested in...</option>
        <option value="Buying a Home">Buying a Home</option>
        <option value="Selling a Home">Selling a Home</option>
        <option value="Investment Property">Investment Property</option>
        <option value="Commercial Real Estate">Commercial Real Estate</option>
        <option value="Buying a Business">Buying a Business</option>
        <option value="Selling a Business">Selling a Business</option>
      </select>
      <textarea
        name="message"
        placeholder="Tell me about your goals..."
        rows={4}
        className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition resize-none text-brand-900 placeholder:text-brand-400 text-sm"
      />

      {status === 'error' && (
        <p className="text-rose-500 text-sm">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-brand-900 text-white font-semibold rounded-xl hover:bg-brand-800 transition-colors text-base disabled:opacity-60"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

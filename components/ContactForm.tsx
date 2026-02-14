'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

interface FieldErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  interest_type?: string;
}

function validateFields(body: Record<string, string>): FieldErrors {
  const errors: FieldErrors = {};

  if (!body.first_name || body.first_name.trim().length < 2)
    errors.first_name = 'First name must be at least 2 characters';

  if (!body.last_name || body.last_name.trim().length < 2)
    errors.last_name = 'Last name must be at least 2 characters';

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    errors.email = 'Please enter a valid email address';

  if (body.phone && !/^[\d\s()+\-\.]{7,20}$/.test(body.phone))
    errors.phone = 'Please enter a valid phone number';

  if (!body.interest_type)
    errors.interest_type = 'Please select what you\'re interested in';

  return errors;
}

function friendlyError(status: number): string {
  if (status === 400) return 'Please check your information and try again.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (status >= 500) return 'We\'re having trouble right now. Please try again in a few minutes or call us directly at (416) 816-7850.';
  return 'Something went wrong. Please try again or call us at (416) 816-7850.';
}

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body: Record<string, string> = {
      first_name: (formData.get('first_name') as string) || '',
      last_name: (formData.get('last_name') as string) || '',
      email: (formData.get('email') as string) || '',
      phone: (formData.get('phone') as string) || '',
      interest_type: (formData.get('interest_type') as string) || '',
      message: (formData.get('message') as string) || '',
    };

    // Client-side validation
    const errors = validateFields(body);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus('loading');

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
        // Try to parse error JSON, but don't crash if it fails
        let serverMsg = '';
        try {
          const data = await res.json();
          serverMsg = data.error || '';
        } catch {
          // Response wasn't JSON — ignore
        }

        // Use server message for 400s if available, otherwise use friendly default
        if (res.status === 400 && serverMsg) {
          throw new Error(serverMsg);
        }
        throw new Error(friendlyError(res.status));
      }

      // Parse success response safely too
      try {
        await res.json();
      } catch {
        // Success response wasn't JSON — that's fine, the insert worked
      }

      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setErrorMsg('Unable to connect. Please check your internet and try again.');
      } else {
        setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again or call us at (416) 816-7850.');
      }
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-accent-500 mb-4" />
        <h3 className="text-xl font-bold text-brand-900 mb-2">Thanks!</h3>
        <p className="text-brand-500 mb-6">Katherine will be in touch shortly.</p>
        <button
          onClick={() => { setStatus('idle'); setFieldErrors({}); }}
          className="text-accent-600 font-medium hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputClass = (field: keyof FieldErrors) =>
    `w-full px-4 py-3.5 bg-white rounded-xl border outline-none transition text-brand-900 placeholder:text-brand-400 text-sm ${
      fieldErrors[field]
        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
        : 'border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100'
    }`;

  const fieldError = (field: keyof FieldErrors) =>
    fieldErrors[field] ? (
      <p className="text-rose-500 text-xs mt-1">{fieldErrors[field]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <input
            name="first_name"
            type="text"
            placeholder="First Name"
            className={inputClass('first_name')}
            onChange={() => fieldErrors.first_name && setFieldErrors(prev => ({ ...prev, first_name: undefined }))}
          />
          {fieldError('first_name')}
        </div>
        <div>
          <input
            name="last_name"
            type="text"
            placeholder="Last Name"
            className={inputClass('last_name')}
            onChange={() => fieldErrors.last_name && setFieldErrors(prev => ({ ...prev, last_name: undefined }))}
          />
          {fieldError('last_name')}
        </div>
      </div>
      <div>
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          className={inputClass('email')}
          onChange={() => fieldErrors.email && setFieldErrors(prev => ({ ...prev, email: undefined }))}
        />
        {fieldError('email')}
      </div>
      <div>
        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          className={inputClass('phone')}
          onChange={() => fieldErrors.phone && setFieldErrors(prev => ({ ...prev, phone: undefined }))}
        />
        {fieldError('phone')}
      </div>
      <div>
        <select
          name="interest_type"
          className={`${inputClass('interest_type')} ${fieldErrors.interest_type ? '' : 'text-brand-500'}`}
          defaultValue=""
          onChange={() => fieldErrors.interest_type && setFieldErrors(prev => ({ ...prev, interest_type: undefined }))}
        >
          <option value="" disabled>I&apos;m interested in...</option>
          <option value="Buying a Home">Buying a Home</option>
          <option value="Selling a Home">Selling a Home</option>
          <option value="Investment Property">Investment Property</option>
          <option value="Commercial Real Estate">Commercial Real Estate</option>
          <option value="Buying a Business">Buying a Business</option>
          <option value="Selling a Business">Selling a Business</option>
        </select>
        {fieldError('interest_type')}
      </div>
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
        className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-brand-900 text-white font-semibold rounded-xl hover:bg-brand-800 transition-colors text-base disabled:opacity-60 disabled:cursor-not-allowed"
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

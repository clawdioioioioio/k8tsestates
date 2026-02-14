/**
 * AddressAutocomplete — LocationIQ-powered address autocomplete
 *
 * LocationIQ free tier: 5,000 requests/day, no credit card required.
 * Sign up at https://locationiq.com/register
 * Set NEXT_PUBLIC_LOCATIONIQ_KEY in .env.local
 */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

interface LocationIQResult {
  place_id: string;
  display_name: string;
  address?: {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    province?: string;
    postcode?: string;
    country?: string;
  };
}

export interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (place: {
    address: string;
    city?: string;
    province?: string;
    postalCode?: string;
  }) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Start typing an address...',
  required,
  className,
}: AddressAutocompleteProps) {
  const [results, setResults] = useState<LocationIQResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipFetchRef = useRef(false);

  const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY;

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!apiKey || query.length < 3) {
        setResults([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.locationiq.com/v1/autocomplete?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(query)}&countrycodes=ca&limit=5&dedupe=1&addressdetails=1`
        );
        if (!res.ok) {
          if (res.status === 429) setError('Rate limited — try again shortly');
          else setError('Failed to fetch suggestions');
          setResults([]);
          setOpen(false);
          return;
        }
        const data: LocationIQResult[] = await res.json();
        setResults(data);
        setOpen(data.length > 0);
        setActiveIndex(-1);
      } catch (_e) {
        setError('Network error');
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  );

  useEffect(() => {
    if (skipFetchRef.current) {
      skipFetchRef.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, fetchSuggestions]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(result: LocationIQResult) {
    const addr = result.address;
    const city = addr?.city || addr?.town || addr?.village;
    const province = addr?.state || addr?.province;
    const postalCode = addr?.postcode;

    skipFetchRef.current = true;
    onChange(result.display_name);
    onSelect({
      address: result.display_name,
      city: city || undefined,
      province: province || undefined,
      postalCode: postalCode || undefined,
    });
    setOpen(false);
    setResults([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  const inputClasses =
    className ||
    'w-full px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400';

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={!apiKey ? 'Set NEXT_PUBLIC_LOCATIONIQ_KEY to enable' : placeholder}
          required={required}
          disabled={!apiKey}
          className={inputClasses}
        />
        {loading && (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-brand-400" />
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white rounded-lg border border-brand-200 shadow-lg max-h-60 overflow-y-auto">
          {results.map((r, i) => (
            <li
              key={r.place_id}
              onMouseDown={() => handleSelect(r)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`px-3 py-2 text-sm cursor-pointer ${
                i === activeIndex
                  ? 'bg-accent-50 text-accent-700'
                  : 'text-brand-700 hover:bg-brand-50'
              }`}
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}

      {open && results.length === 0 && !loading && value.length >= 3 && !error && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg border border-brand-200 shadow-lg px-3 py-2 text-sm text-brand-400">
          No results found
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-rose-500">{error}</p>
      )}
    </div>
  );
}

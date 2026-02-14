'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LayoutDashboard, Users, LogOut, Menu, X, Home, FileText } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/open-houses', label: 'Open Houses', icon: Home },
  { href: '/admin/content', label: 'Content', icon: FileText },
];

export function AdminShell({ children, userEmail }: { children: React.ReactNode; userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-brand-100">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-brand-900 flex items-center justify-center">
            <span className="text-white font-bold text-sm">K8</span>
          </div>
          <span className="font-bold text-brand-900">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.href)
                ? 'bg-brand-900 text-white'
                : 'text-brand-600 hover:bg-brand-50'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-brand-100">
        <p className="text-xs text-brand-400 mb-3 truncate">{userEmail}</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-brand-500 hover:text-brand-900 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-warm">
      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-60 md:flex-col bg-white border-r border-brand-100">
        {sidebar}
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-brand-100 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-900 flex items-center justify-center">
            <span className="text-white font-bold text-xs">K8</span>
          </div>
          <span className="font-bold text-brand-900 text-sm">Admin</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-60 bg-white pt-14">
            {sidebar}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="md:ml-60 pt-14 md:pt-0 min-h-screen">
        <div className="p-4 md:p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}

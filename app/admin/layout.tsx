import { createClient } from '@/lib/supabase/server';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata = {
  title: 'K8ts Estates — Admin',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If no user (login page), render children without shell
  if (!user) {
    return <>{children}</>;
  }

  return <AdminShell userEmail={user.email || ''}>{children}</AdminShell>;
}

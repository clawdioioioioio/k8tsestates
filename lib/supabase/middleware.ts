import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Check if user is an admin
  // Try admin_users table first; fall back to hardcoded list if table doesn't exist yet
  const FALLBACK_ADMIN_EMAILS = ['kminovski@gmail.com', 'nminovski@gmail.com'];
  let isAdmin = false;
  if (user?.email) {
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', user.email)
      .single();
    if (adminError && adminError.code === '42P01') {
      // Table doesn't exist yet — use fallback
      isAdmin = FALLBACK_ADMIN_EMAILS.includes(user.email);
    } else {
      isAdmin = !!adminUser;
    }
  }

  // Protect admin routes (except login)
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')
  ) {
    if (!user || !isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in admins away from login page
  if (request.nextUrl.pathname === '/admin/login') {
    if (user && isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

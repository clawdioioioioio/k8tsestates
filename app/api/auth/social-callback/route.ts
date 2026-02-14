import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // platform name
  const platform = searchParams.get('platform') || state;
  const error = searchParams.get('error');

  const settingsUrl = new URL('/admin/settings', request.url);

  if (error) {
    settingsUrl.searchParams.set('error', `OAuth error: ${error}`);
    return NextResponse.redirect(settingsUrl);
  }

  if (!code || !platform) {
    settingsUrl.searchParams.set('error', 'Missing code or platform');
    return NextResponse.redirect(settingsUrl);
  }

  try {
    // Get code_verifier from cookie (for X/PKCE)
    const codeVerifier = request.cookies.get('pkce_code_verifier')?.value || '';

    const supabase = await createClient();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // Get auth token for the edge function call
    const { data: { session } } = await supabase.auth.getSession();

    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin}/api/auth/social-callback`;

    const resp = await fetch(`${supabaseUrl}/functions/v1/social-callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token || supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify({
        platform,
        code,
        state,
        code_verifier: codeVerifier,
        redirect_uri: callbackUrl,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      settingsUrl.searchParams.set('error', data.error || 'Failed to connect account');
      return NextResponse.redirect(settingsUrl);
    }

    settingsUrl.searchParams.set('success', `${platform} connected successfully`);
    const response = NextResponse.redirect(settingsUrl);
    // Clear PKCE cookie
    response.cookies.delete('pkce_code_verifier');
    return response;
  } catch (err) {
    settingsUrl.searchParams.set('error', 'An unexpected error occurred');
    return NextResponse.redirect(settingsUrl);
  }
}

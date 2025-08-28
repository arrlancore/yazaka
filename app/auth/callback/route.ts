import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, error_description);
    // Redirect to auth page with error
    const redirectUrl = new URL('/auth', request.url);
    redirectUrl.searchParams.set('error', error);
    if (error_description) {
      redirectUrl.searchParams.set('error_description', error_description);
    }
    return NextResponse.redirect(redirectUrl);
  }

  if (code) {
    try {
      const supabase = createRouteHandlerClient({ cookies });
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error('Session exchange error:', exchangeError);
        const redirectUrl = new URL('/auth', request.url);
        redirectUrl.searchParams.set('error', 'session_exchange_failed');
        return NextResponse.redirect(redirectUrl);
      }
    } catch (err) {
      console.error('Unexpected error during session exchange:', err);
      const redirectUrl = new URL('/auth', request.url);
      redirectUrl.searchParams.set('error', 'unexpected_error');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If no code parameter, this might be an implicit flow with tokens in URL fragment
  // Redirect to a client-side page that can handle the fragment
  if (!code) {
    const callbackPageUrl = new URL('/auth/callback-client', request.url);
    return NextResponse.redirect(callbackPageUrl);
  }

  // Redirect to search page (our main dashboard)
  const searchUrl = new URL('/search', request.url);
  return NextResponse.redirect(searchUrl);
}

// Handle hash-based tokens that GitHub OAuth might return
export async function POST(request: NextRequest) {
  const searchUrl = new URL('/search', request.url);
  return NextResponse.redirect(searchUrl);
}

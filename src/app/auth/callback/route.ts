import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Auth callback handler for email verification and password reset
 * Handles the code from Supabase auth emails
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/contractor/dashboard';

  if (code) {
    const supabase = createServerSupabaseClient();

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[AUTH CALLBACK] Error exchanging code:', error);
      // Redirect to login with error
      return NextResponse.redirect(
        new URL('/contractor/login?error=verification_failed', requestUrl.origin)
      );
    }

    // Success - redirect to the next page
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  // No code provided - redirect to login
  return NextResponse.redirect(
    new URL('/contractor/login', requestUrl.origin)
  );
}

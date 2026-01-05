import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from '@/lib/database.types';

/**
 * Auth callback handler for email verification and password reset
 * Handles the code from Supabase auth emails
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/contractor/dashboard';

  if (code) {
    // Create response first so we can set cookies on it
    const response = NextResponse.redirect(new URL(next, requestUrl.origin));

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // Set cookie on both request and response
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            // Remove cookie from both request and response
            request.cookies.set({ name, value: '', ...options });
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Exchange the code for a session (this will set auth cookies)
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[AUTH CALLBACK] Error exchanging code:', error);
      // Redirect to login with error
      return NextResponse.redirect(
        new URL(
          '/contractor/login?error=verification_failed',
          requestUrl.origin
        )
      );
    }

    // Log successful session creation
    console.log('[AUTH CALLBACK] Session created for user:', data.user?.email);
    console.log('[AUTH CALLBACK] Email confirmed:', data.user?.email_confirmed_at);

    // Return response with auth cookies set
    return response;
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL('/contractor/login', requestUrl.origin));
}

import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Update Supabase session
  const response = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Public auth routes - accessible without login
  const publicAuthRoutes = [
    '/contractor/signup',
    '/contractor/login',
    '/contractor/reset-password',
    '/contractor/update-password',
    '/contractor/verify-email',
  ];

  // Check if accessing contractor routes
  if (pathname.startsWith('/contractor')) {
    // Allow public auth routes
    if (publicAuthRoutes.some(route => pathname.startsWith(route))) {
      return response;
    }

    // Protected routes - require authentication
    // Create client to check auth status
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // No user → redirect to login
    if (!user) {
      const loginUrl = new URL('/contractor/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check email verification
    if (!user.email_confirmed_at) {
      const verifyUrl = new URL('/contractor/verify-email', request.url);
      return NextResponse.redirect(verifyUrl);
    }

    // User authenticated and verified - allow through
    // RLS policies will handle contractor-specific access
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't need auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

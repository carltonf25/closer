import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Update Supabase session
  const response = await updateSession(request);

  // Check if accessing contractor dashboard
  if (request.nextUrl.pathname.startsWith('/contractor')) {
    // Skip auth check for signup and login pages
    if (
      request.nextUrl.pathname === '/contractor/signup' ||
      request.nextUrl.pathname === '/contractor/login'
    ) {
      return response;
    }

    // For other contractor pages, auth is handled by Supabase RLS
    // The page components will check for authenticated user
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

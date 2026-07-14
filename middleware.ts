import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Define public routes (assets, public pages)
  const isPublicRoute =
    pathname === '/login' ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/api/auth');

  if (!token && !isPublicRoute) {
    const url = new URL('/login', request.url);
    if (pathname !== '/') {
      url.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(url);
  }

  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadBase64 = parts[1];
        // atob is standard in all environments including Next.js Edge runtime
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);
        const { role } = payload;

        // If user is logged in, prevent them from seeing the login page
        if (pathname === '/login') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // Role-based Access Control (RBAC)
        // Super Admin has bypass access to everything
        if (role !== 'super_admin') {
          if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
          }
          if (pathname.startsWith('/teacher') && role !== 'teacher') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
          }
          if (pathname.startsWith('/student') && role !== 'student') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
          }
          if (pathname.startsWith('/parent') && role !== 'parent') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
          }
          if (pathname.startsWith('/accountant') && role !== 'accountant') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
          }
        }
      }
    } catch {
      // If token is invalid or parsing fails, clear it and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (handled within route handlers)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};

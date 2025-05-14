import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';

const publicRoutes = ['/', '/terms', '/privacy-policy', '/plan'];
const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password' , '/verify-email'];

function hasValidAuthToken(request: NextRequest): boolean {
  const cookies = parse(request.headers.get('cookie') ?? '');
  const token = cookies['accessToken'];
  return !!token;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasValidAuthToken(request);

  const isPublic = publicRoutes.some((route) => pathname === route);
  const isAuth = authRoutes.some((route) => pathname.startsWith(route));

  if (isPublic) {
    return NextResponse.next(); // Always allow public routes
  }

  if (isAuth) {
    if (isAuthenticated) {
      // Redirect authenticated users away from login/signup/etc to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next(); // Allow access to auth pages if not logged in
  }

  // For all other routes (protected)
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next(); // Authenticated and allowed
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

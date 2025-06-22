import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is a protected route
  const isProtectedRoute = [
    '/dashboard',
    '/settings',
  ].some(route => pathname.startsWith(route));

  // Check if the path is an auth route
  const isAuthRoute = [
    '/signin',
    '/signup',
    '/verify',
  ].some(route => pathname.startsWith(route));

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to signin if accessing a protected route without a token
  if (isProtectedRoute && !token) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if accessing an auth route with a token
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/signin',
    '/signup',
    '/verify',
  ],
};
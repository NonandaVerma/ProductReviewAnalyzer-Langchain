import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'prm_session';
const PROTECTED_PATHS = ['/', '/upload', '/reviews', '/assistant', '/settings'];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  const isProtected = PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isProtected && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && hasSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/upload/:path*', '/reviews/:path*', '/assistant/:path*', '/settings/:path*', '/login'],
};

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND_API_URL, SESSION_COOKIE } from '@/lib/backendProxy';

export async function POST(request) {
  const body = await request.json();

  const backendRes = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json().catch(() => ({}));

  if (!backendRes.ok) {
    return NextResponse.json(
      { status: 'error', message: data.detail || 'Invalid email or password' },
      { status: backendRes.status }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ status: 'success', user: data.user });
}

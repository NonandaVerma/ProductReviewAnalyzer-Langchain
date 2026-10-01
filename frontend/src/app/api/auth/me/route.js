import { NextResponse } from 'next/server';
import { BACKEND_API_URL, getSessionToken } from '@/lib/backendProxy';

export async function GET() {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ status: 'error', user: null }, { status: 401 });
  }

  const backendRes = await fetch(`${BACKEND_API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!backendRes.ok) {
    return NextResponse.json({ status: 'error', user: null }, { status: backendRes.status });
  }

  const data = await backendRes.json();
  return NextResponse.json({ status: 'success', user: data.user });
}

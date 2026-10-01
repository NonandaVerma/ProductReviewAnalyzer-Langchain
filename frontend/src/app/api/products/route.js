import { NextResponse } from 'next/server';
import { BACKEND_API_URL, getSessionToken } from '@/lib/backendProxy';

export async function GET() {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ status: 'error', message: 'Not authenticated' }, { status: 401 });
  }

  const backendRes = await fetch(`${BACKEND_API_URL}/api/products`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  const data = await backendRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: backendRes.status });
}

import { NextResponse } from 'next/server';
import { BACKEND_API_URL, getSessionToken } from '@/lib/backendProxy';

export async function POST(request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ status: 'error', message: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();

  const backendRes = await fetch(`${BACKEND_API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: backendRes.status });
}

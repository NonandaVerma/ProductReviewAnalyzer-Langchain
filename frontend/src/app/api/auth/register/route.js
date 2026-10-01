import { NextResponse } from 'next/server';
import { BACKEND_API_URL } from '@/lib/backendProxy';

export async function POST(request) {
  const body = await request.json();

  const backendRes = await fetch(`${BACKEND_API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json().catch(() => ({}));

  if (!backendRes.ok) {
    return NextResponse.json(
      { status: 'error', message: data.detail || 'Registration failed' },
      { status: backendRes.status }
    );
  }

  return NextResponse.json({ status: 'success', user: data.user });
}

import { NextResponse } from 'next/server';
import { BACKEND_API_URL, getSessionToken } from '@/lib/backendProxy';

export async function POST(request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ status: 'error', message: 'Not authenticated' }, { status: 401 });
  }

  // Re-read the incoming multipart body as FormData, then re-POST a fresh
  // FormData. fetch/undici serializes this with its own correct
  // Content-Type: multipart/form-data; boundary=... — do NOT set
  // Content-Type manually or the boundary will be missing/wrong.
  const incomingFormData = await request.formData();

  const outgoingFormData = new FormData();
  outgoingFormData.append('file', incomingFormData.get('file'));
  outgoingFormData.append('product_name', incomingFormData.get('product_name'));
  outgoingFormData.append('category', incomingFormData.get('category'));

  const backendRes = await fetch(`${BACKEND_API_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: outgoingFormData,
  });

  const data = await backendRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: backendRes.status });
}

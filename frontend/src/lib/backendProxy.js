import { cookies } from 'next/headers';

export const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';
export const SESSION_COOKIE = 'prm_session';

/** Reads the httpOnly session cookie server-side. Returns null if absent. */
export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value || null;
}

// Simple session util using HTTP-only cookies (no NextAuth needed for MVP)
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export const SESSION_COOKIE = 'unita_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'unita-learn-secret-2024';

// Simple base64 encode/decode for session token (NOT production-grade crypto)
function encode(obj: any): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
}
function decode<T = any>(str: string): T | null {
  try {
    return JSON.parse(Buffer.from(str, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}

export async function createSessionCookie(user: { id: string; email: string; role: string }) {
  const token = encode({
    ...user,
    issuedAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  };
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const decoded = decode<{ id: string; email: string; role: string; expiresAt: number }>(token);
  if (!decoded) return null;
  if (decoded.expiresAt < Date.now()) return null;
  const user = await db.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, name: true, role: true, avatar: true, headline: true },
  });
  return user;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

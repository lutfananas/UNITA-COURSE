import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db as getDb } from '@/lib/db';
import { createSessionCookie } from '@/lib/session';


export const runtime = 'edge';
export async function POST(req: NextRequest) {
  try {
    const prisma = await getDb();
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    const cookie = await createSessionCookie({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        headline: user.headline,
      },
    });
    res.cookies.set(cookie);
    return res;
  } catch (e: any) {
    console.error('Login error:', e);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

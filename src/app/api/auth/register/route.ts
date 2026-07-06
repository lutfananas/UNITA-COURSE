import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db as getDb } from '@/lib/db';
import { createSessionCookie } from '@/lib/session';


export const runtime = 'edge';
export async function POST(req: NextRequest) {
  try {
    const prisma = await getDb();
    const { name, email, password, headline } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nama, email, dan password wajib diisi' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        headline: headline || null,
        role: 'STUDENT',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      },
    });

    const cookie = await createSessionCookie({ id: user.id, email: user.email, role: user.role });
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
    console.error('Register error:', e);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

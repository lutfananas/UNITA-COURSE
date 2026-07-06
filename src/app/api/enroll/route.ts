import { NextRequest, NextResponse } from 'next/server';
import { db as getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/session';


export const runtime = 'edge';
export async function POST(req: NextRequest) {
  try {
    const prisma = await getDb();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: 'courseId wajib diisi' }, { status: 400 });
    }

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
    });
    if (existing) {
      return NextResponse.json({ enrollment: existing, already: true });
    }

    const enrollment = await prisma.enrollment.create({
      data: { userId: user.id, courseId },
    });

    await prisma.course.update({
      where: { id: courseId },
      data: { enrollCount: { increment: 1 } },
    });

    return NextResponse.json({ enrollment });
  } catch (e: any) {
    console.error('Enroll error:', e);
    return NextResponse.json({ error: 'Gagal enroll' }, { status: 500 });
  }
}

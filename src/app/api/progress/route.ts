import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/session';

// POST /api/progress - mark lesson complete/incomplete
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId, completed, courseId } = await req.json();
    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId wajib diisi' }, { status: 400 });
    }

    // Verify enrollment
    if (courseId) {
      const enrolled = await db.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId } },
      });
      if (!enrolled) {
        return NextResponse.json({ error: 'Belum terdaftar di course ini' }, { status: 403 });
      }
    }

    const progress = await db.progress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId } },
      update: { completed: !!completed, lastPosSec: 0 },
      create: { userId: user.id, lessonId, completed: !!completed },
    });

    // Update enrollment progressPct
    if (courseId) {
      const allLessons = await db.lesson.findMany({
        where: { module: { courseId } },
        select: { id: true },
      });
      const completedCount = await db.progress.count({
        where: {
          userId: user.id,
          completed: true,
          lessonId: { in: allLessons.map((l) => l.id) },
        },
      });
      const pct = allLessons.length ? (completedCount / allLessons.length) * 100 : 0;
      await db.enrollment.update({
        where: { userId_courseId: { userId: user.id, courseId } },
        data: { progressPct: pct, lastAccessed: new Date() },
      });

      // Auto-issue certificate if 100%
      if (pct >= 100) {
        const existing = await db.certificate.findUnique({
          where: { userId_courseId: { userId: user.id, courseId } },
        });
        if (!existing) {
          const certNo = `UNTAG-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase().slice(-8)}`;
          await db.certificate.create({
            data: { userId: user.id, courseId, certificateNo: certNo },
          });
          await db.enrollment.update({
            where: { userId_courseId: { userId: user.id, courseId } },
            data: { completedAt: new Date() },
          });
        }
      }
    }

    return NextResponse.json({ progress });
  } catch (e: any) {
    console.error('Progress error:', e);
    return NextResponse.json({ error: 'Gagal update progress' }, { status: 500 });
  }
}

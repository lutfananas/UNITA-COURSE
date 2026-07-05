import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/session';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ enrollments: [] });
  }

  const enrollments = await db.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          instructor: { select: { id: true, name: true, avatar: true } },
          modules: {
            orderBy: { order: 'asc' },
            include: {
              lessons: {
                orderBy: { order: 'asc' },
                select: { id: true, title: true, durationMin: true, preview: true, order: true },
              },
            },
          },
          category: true,
        },
      },
    },
    orderBy: { lastAccessed: 'desc' },
  });

  // For each enrollment, get progress
  const enriched = await Promise.all(
    enrollments.map(async (e) => {
      const progList = await db.progress.findMany({
        where: { userId: user.id, lesson: { module: { courseId: e.courseId } } },
      });
      const progressMap = Object.fromEntries(progList.map((p) => [p.lessonId, p.completed]));
      const totalLessons = e.course.modules.reduce((a, m) => a + m.lessons.length, 0);
      const completed = Object.values(progressMap).filter(Boolean).length;
      const progressPct = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;

      const hasCertificate = await db.certificate.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: e.courseId } },
      }).then(Boolean);

      return {
        ...e,
        progressMap,
        totalLessons,
        completedLessons: completed,
        progressPct,
        hasCertificate,
      };
    })
  );

  return NextResponse.json({ enrollments: enriched });
}

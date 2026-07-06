import { NextRequest, NextResponse } from 'next/server';
import { db as getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/session';


export const runtime = 'edge';
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const prisma = await getDb();
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      category: true,
      instructor: {
        select: { id: true, name: true, avatar: true, headline: true, bio: true },
      },
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              description: true,
              durationMin: true,
              preview: true,
              order: true,
            },
          },
        },
      },
      reviews: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true, headline: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      certificates: { select: { userId: true } },
    },
  });

  if (!course) {
    return NextResponse.json({ error: 'Course tidak ditemukan' }, { status: 404 });
  }

  const user = await getSessionUser();
  let enrollment = null;
  let progress: Record<string, boolean> = {};
  let hasCertificate = false;

  if (user) {
    enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
    });
    if (enrollment) {
      const progList = await prisma.progress.findMany({
        where: { userId: user.id, lesson: { module: { courseId: course.id } } },
      });
      progress = Object.fromEntries(progList.map((p) => [p.lessonId, p.completed]));
    }
    hasCertificate = await prisma.certificate.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
    }).then(Boolean);
  }

  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressPct = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  return NextResponse.json({
    course,
    user,
    enrollment,
    progress,
    hasCertificate,
    totalLessons,
    completedCount,
    progressPct,
  });
}

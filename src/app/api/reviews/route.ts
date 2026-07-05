import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });
    }

    const { courseId, rating, comment } = await req.json();
    if (!courseId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating 1-5 wajib diisi' }, { status: 400 });
    }

    const existing = await db.review.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
    });
    if (existing) {
      return NextResponse.json({ error: 'Anda sudah memberi review' }, { status: 400 });
    }

    const review = await db.review.create({
      data: { userId: user.id, courseId, rating, comment },
      include: { user: { select: { id: true, name: true, avatar: true, headline: true } } },
    });

    // Update course rating & reviewCount
    const allReviews = await db.review.findMany({ where: { courseId }, select: { rating: true } });
    const avg = allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length;
    await db.course.update({
      where: { id: courseId },
      data: { rating: Math.round(avg * 10) / 10, reviewCount: allReviews.length },
    });

    return NextResponse.json({ review });
  } catch (e: any) {
    console.error('Review error:', e);
    return NextResponse.json({ error: 'Gagal menambah review' }, { status: 500 });
  }
}

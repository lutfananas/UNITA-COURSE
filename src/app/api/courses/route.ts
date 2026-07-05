import { NextRequest, NextResponse } from 'next/server';
import { db as getDb } from '@/lib/db';


export const runtime = 'edge';
export async function GET(req: NextRequest) {
  const prisma = await getDb();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const level = searchParams.get('level');
  const search = searchParams.get('q');
  const sort = searchParams.get('sort') || 'popular';

  const where: any = { published: true };
  if (category && category !== 'all') {
    where.category = { slug: category };
  }
  if (level && level !== 'all') {
    where.level = level;
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { tags: { contains: search } },
    ];
  }

  let orderBy: any = { enrollCount: 'desc' };
  if (sort === 'newest') orderBy = { createdAt: 'desc' };
  if (sort === 'rating') orderBy = { rating: 'desc' };
  if (sort === 'popular') orderBy = { enrollCount: 'desc' };

  const courses = await prisma.course.findMany({
    where,
    orderBy,
    include: {
      category: true,
      instructor: {
        select: { id: true, name: true, avatar: true, headline: true },
      },
      modules: {
        include: { lessons: { select: { id: true, durationMin: true } } },
      },
      reviews: { select: { rating: true } },
    },
  });

  const formatted = courses.map((c) => {
    const totalLessons = c.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const totalDuration = c.modules.reduce(
      (acc, m) => acc + m.lessons.reduce((a, l) => a + l.durationMin, 0),
      0
    );
    return {
      id: c.id,
      title: c.title,
      slug: c.slug,
      shortDesc: c.shortDesc,
      thumbnail: c.thumbnail,
      level: c.level,
      rating: c.rating,
      reviewCount: c.reviewCount,
      enrollCount: c.enrollCount,
      premium: c.premium,
      price: c.price,
      category: c.category,
      instructor: c.instructor,
      totalLessons,
      totalDuration,
    };
  });

  const categories = await prisma.category.findMany({
    include: { _count: { select: { courses: { where: { published: true } } } } },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({ courses: formatted, categories });
}

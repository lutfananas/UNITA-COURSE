import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/session';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ certificates: [] });
  }
  const certificates = await db.certificate.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: { instructor: { select: { name: true, headline: true } } },
      },
    },
    orderBy: { issuedAt: 'desc' },
  });
  return NextResponse.json({ certificates });
}

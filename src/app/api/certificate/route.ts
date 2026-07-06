import { NextResponse } from 'next/server';
import { db as getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/session';


export const runtime = 'edge';
export async function GET() {
  const prisma = await getDb();
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ certificates: [] });
  }
  const certificates = await prisma.certificate.findMany({
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

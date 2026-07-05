import { NextRequest, NextResponse } from 'next/server';
import { db as getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/session';


export const runtime = 'edge';
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Apa kepanjangan dari metode STAR dalam wawancara?',
    options: ['Situation-Target-Action-Result', 'Situation-Task-Action-Result', 'Strategy-Task-Action-Result', 'Situation-Test-Analyze-Report'],
    correctIndex: 1,
  },
  {
    id: 2,
    question: 'Berapa persen keputusan rekrutmen ditentukan dalam 90 detik pertama wawancara (menurut Forbes 2023)?',
    options: ['10%', '20%', '33%', '50%'],
    correctIndex: 2,
  },
  {
    id: 3,
    question: 'Manakah yang BUKAN jenis wawancara modern?',
    options: ['HR Round', 'Technical Interview', 'Case Interview', 'Marathon Interview'],
    correctIndex: 3,
  },
  {
    id: 4,
    question: 'Berapa lama waktu ideal mengirim thank-you email setelah wawancara?',
    options: ['1 minggu', 'Dalam 24 jam', '3 hari', 'Tidak perlu'],
    correctIndex: 1,
  },
  {
    id: 5,
    question: 'Apa struktur jawaban untuk pertanyaan "Tell me about yourself"?',
    options: ['Past-Present-Future', 'Present-Past-Future', 'Future-Past-Present', 'Random'],
    correctIndex: 1,
  },
  {
    id: 6,
    question: 'Teknik breathing 4-7-8 digunakan untuk?',
    options: ['Menghafal jawaban', 'Mengelola gugup', 'Meningkatkan volume suara', 'Mempersiapkan outfit'],
    correctIndex: 1,
  },
  {
    id: 7,
    question: 'Berapa persen ideal eye contact selama wawancara?',
    options: ['30-40%', '60-70%', '90-100%', '50-50%'],
    correctIndex: 1,
  },
  {
    id: 8,
    question: 'Manakah jawaban yang TEPAT untuk pertanyaan kelemahan?',
    options: ['"Saya terlalu perfeksionis"', '"Saya tidak punya kelemahan"', '"Saya kadang kesulitan delegasi, untuk memperbaikinya saya mulai pakai Trello"', '"Saya pemalas"'],
    correctIndex: 2,
  },
  {
    id: 9,
    question: 'Power Pose (Wonder Woman) sebaiknya dilakukan berapa lama sebelum wawancara?',
    options: ['30 detik', '1 menit', '2 menit', '10 menit'],
    correctIndex: 2,
  },
  {
    id: 10,
    question: 'Berapa tempo bicara ideal dalam wawancara?',
    options: ['100-120 kata/menit', '130-160 kata/menit', '180-200 kata/menit', '60-80 kata/menit'],
    correctIndex: 1,
  },
];

export async function GET() {
  return NextResponse.json({ questions: QUIZ_QUESTIONS.map((q) => ({ ...q, correctIndex: undefined })) });
}

export async function POST(req: NextRequest) {
  try {
    const prisma = await getDb();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { answers, courseId } = await req.json();
    if (!Array.isArray(answers) || !courseId) {
      return NextResponse.json({ error: 'Format jawaban tidak valid' }, { status: 400 });
    }

    let correct = 0;
    const detail = QUIZ_QUESTIONS.map((q) => {
      const userAns = answers.find((a: any) => a.id === q.id);
      const isCorrect = userAns && userAns.selectedIndex === q.correctIndex;
      if (isCorrect) correct++;
      return {
        id: q.id,
        question: q.question,
        correctIndex: q.correctIndex,
        userIndex: userAns?.selectedIndex ?? -1,
        isCorrect,
      };
    });

    const score = Math.round((correct / QUIZ_QUESTIONS.length) * 100);
    const passed = score >= 70;

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        courseId,
        score,
        passed,
        answers: JSON.stringify(detail),
      },
    });

    // If passed & enrolled, auto-issue certificate
    if (passed) {
      const enrolled = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId } },
      });
      if (enrolled) {
        // Mark all lessons complete
        const lessons = await prisma.lesson.findMany({
          where: { module: { courseId } },
          select: { id: true },
        });
        for (const l of lessons) {
          await prisma.progress.upsert({
            where: { userId_lessonId: { userId: user.id, lessonId: l.id } },
            update: { completed: true },
            create: { userId: user.id, lessonId: l.id, completed: true },
          });
        }
        await prisma.enrollment.update({
          where: { userId_courseId: { userId: user.id, courseId } },
          data: { progressPct: 100, completedAt: new Date(), lastAccessed: new Date() },
        });

        const existing = await prisma.certificate.findUnique({
          where: { userId_courseId: { userId: user.id, courseId } },
        });
        if (!existing) {
          const certNo = `UNITA-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase().slice(-8)}`;
          await prisma.certificate.create({
            data: { userId: user.id, courseId, certificateNo: certNo },
          });
        }
      }
    }

    return NextResponse.json({
      attemptId: attempt.id,
      score,
      passed,
      correct,
      total: QUIZ_QUESTIONS.length,
      detail,
    });
  } catch (e: any) {
    console.error('Quiz submit error:', e);
    return NextResponse.json({ error: 'Gagal submit quiz' }, { status: 500 });
  }
}

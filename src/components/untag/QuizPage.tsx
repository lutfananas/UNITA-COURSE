'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Award,
  Trophy,
  RotateCcw,
  ArrowRight,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import type { User, View } from '@/lib/types';

interface QuizPageProps {
  courseId: string;
  user: User | null;
  onNavigate: (view: View) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex?: number;
}

interface QuizResult {
  attemptId: string;
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  detail: Array<{
    id: number;
    question: string;
    correctIndex: number;
    userIndex: number;
    isCorrect: boolean;
  }>;
}

export function QuizPage({ courseId, user, onNavigate }: QuizPageProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [courseTitle, setCourseTitle] = useState('');

  useEffect(() => {
    if (!user) {
      onNavigate({ type: 'home' });
      return;
    }
    (async () => {
      try {
        const [qRes, enrRes] = await Promise.all([
          fetch('/api/quiz/submit'),
          fetch('/api/enrollments'),
        ]);
        const qData = await qRes.json();
        const enrData = await enrRes.json();
        setQuestions(qData.questions || []);
        const enr = enrData.enrollments?.find((e: any) => e.courseId === courseId);
        if (enr) setCourseTitle(enr.course.title);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, user, onNavigate]);

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.warning('Mohon jawab semua pertanyaan terlebih dahulu');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          answers: Object.entries(answers).map(([id, idx]) => ({ id: Number(id), selectedIndex: idx })),
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error(d.error || 'Gagal submit quiz');
        return;
      }
      setResult(d);
      if (d.passed) {
        toast.success('🎉 Selamat! Anda lulus quiz dan berhak mendapat sertifikat!');
      } else {
        toast.error(`Belum lulus. Skor Anda: ${d.score}. Minimal 70 untuk lulus.`);
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIdx(0);
    setResult(null);
    setStarted(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-blue-900" />
      </div>
    );
  }

  if (!user) return null;

  // ── RESULT SCREEN ──
  if (result) {
    return (
      <div className="bg-background min-h-[calc(100vh-4rem)] py-10">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <Card className={result.passed ? 'border-amber-300' : 'border-red-200'}>
            <CardContent className="p-8 text-center">
              <div
                className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  result.passed ? 'bg-amber-100' : 'bg-red-100'
                }`}
              >
                {result.passed ? (
                  <Trophy className="w-10 h-10 text-amber-600" />
                ) : (
                  <AlertCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              <h1 className="text-2xl font-bold mb-2">
                {result.passed ? 'Selamat! Anda Lulus! 🎉' : 'Belum Lulus'}
              </h1>
              <p className="text-muted-foreground mb-6">
                {result.passed
                  ? 'Anda telah berhasil menyelesaikan quiz akhir. Sertifikat telah diterbitkan.'
                  : 'Jangan menyerah! Anda bisa mencoba lagi. Pelajari kembali materinya.'}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-3xl font-bold text-blue-900">{result.score}</div>
                    <div className="text-xs text-muted-foreground">Skor Akhir</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-3xl font-bold text-blue-900">
                      {result.correct}/{result.total}
                    </div>
                    <div className="text-xs text-muted-foreground">Jawaban Benar</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-3xl font-bold text-blue-900">
                      {result.passed ? '✓' : '✗'}
                    </div>
                    <div className="text-xs text-muted-foreground">Status</div>
                  </CardContent>
                </Card>
              </div>

              {/* Answer review */}
              <Card className="text-left mb-6">
                <CardHeader>
                  <CardTitle className="text-base">Pembahasan Jawaban</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-72 overflow-y-auto scroll-area">
                  {result.detail.map((d, i) => (
                    <div
                      key={d.id}
                      className={`p-3 rounded-lg border ${
                        d.isCorrect ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {d.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-blue-900 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 text-sm">
                          <div className="font-medium mb-1">
                            {i + 1}. {d.question}
                          </div>
                          {!d.isCorrect && (
                            <div className="text-xs text-blue-800 mt-1">
                              ✓ Jawaban benar: {questions.find((q) => q.id === d.id)?.options[d.correctIndex]}
                            </div>
                          )}
                          {d.userIndex >= 0 && !d.isCorrect && (
                            <div className="text-xs text-red-700 mt-0.5">
                              ✗ Jawaban Anda: {questions.find((q) => q.id === d.id)?.options[d.userIndex]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {!result.passed && (
                  <Button
                    variant="outline"
                    onClick={handleRetry}
                    className="border-blue-300 text-blue-800 hover:bg-blue-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Coba Lagi
                  </Button>
                )}
                {result.passed && (
                  <Button
                    className="bg-amber-600 hover:bg-amber-700"
                    onClick={() => onNavigate({ type: 'dashboard' })}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Lihat Sertifikat
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => onNavigate({ type: 'learn', courseId })}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Materi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── START SCREEN ──
  if (!started) {
    return (
      <div className="bg-background min-h-[calc(100vh-4rem)] py-10">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <button
            onClick={() => onNavigate({ type: 'learn', courseId })}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Materi
          </button>

          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Kuis Final</h1>
              <p className="text-white/85 mb-1">{courseTitle || 'Matematika Dasar'}</p>
            </div>
            <CardContent className="p-8">
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">{questions.length}</div>
                  <div className="text-xs text-muted-foreground">Soal</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-900 flex items-center justify-center">
                    <Clock className="w-5 h-5 mr-1" />
                    15
                  </div>
                  <div className="text-xs text-muted-foreground">Menit</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">70</div>
                  <div className="text-xs text-muted-foreground">Min. Lulus</div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-amber-900 mb-2 text-sm">Aturan Kuis:</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Kuis terdiri dari {questions.length} soal pilihan ganda</li>
                  <li>• Durasi pengerjaan 15 menit</li>
                  <li>• Skor minimal lulus: 70 (dari 100)</li>
                  <li>• Bisa diulang jika belum lulus</li>
                  <li>• Sertifikat diterbitkan otomatis jika lulus</li>
                </ul>
              </div>

              <Button
                size="lg"
                className="w-full bg-amber-600 hover:bg-amber-700 text-base h-12"
                onClick={() => setStarted(true)}
              >
                <Award className="w-4 h-4 mr-2" />
                Mulai Kuis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── QUIZ IN PROGRESS ──
  const current = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const progressPct = (answeredCount / questions.length) * 100;
  const isLast = currentIdx === questions.length - 1;

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)] py-10">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold">
              Soal {currentIdx + 1} dari {questions.length}
            </span>
            <span className="text-muted-foreground">
              {answeredCount}/{questions.length} terjawab
            </span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 leading-snug">
              {current.question}
            </h2>
            <div className="space-y-2">
              {current.options.map((opt, i) => {
                const selected = answers[current.id] === i;
                return (
                  <button
                    key={i}
                    onClick={() => setAnswers({ ...answers, [current.id]: i })}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                      selected
                        ? 'border-blue-900 bg-blue-50'
                        : 'border-border hover:border-blue-300 hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          selected
                            ? 'border-blue-900 bg-blue-900 text-white'
                            : 'border-muted-foreground text-muted-foreground'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className={`text-sm ${selected ? 'font-medium text-blue-950' : ''}`}>
                        {opt}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Sebelumnya
          </Button>

          {isLast ? (
            <Button
              className="bg-amber-600 hover:bg-amber-700"
              onClick={handleSubmit}
              disabled={submitting || answeredCount < questions.length}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Award className="w-4 h-4 mr-2" />
              )}
              Kirim Jawaban
            </Button>
          ) : (
            <Button
              className="bg-blue-900 hover:bg-blue-800"
              onClick={() => setCurrentIdx(currentIdx + 1)}
              disabled={answers[current.id] === undefined}
            >
              Berikutnya
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        {/* Question nav */}
        <div className="mt-6 p-4 bg-white border rounded-lg">
          <div className="text-xs text-muted-foreground mb-2">Navigasi Soal:</div>
          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, i) => {
              const answered = answers[q.id] !== undefined;
              const isCurrent = i === currentIdx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(i)}
                  className={`w-8 h-8 rounded text-xs font-semibold transition-colors ${
                    isCurrent
                      ? 'bg-blue-900 text-white'
                      : answered
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      : 'bg-muted text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

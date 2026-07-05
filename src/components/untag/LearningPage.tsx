'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Award,
  Lock,
  BookOpen,
  Clock,
  Menu,
  X,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import type { CourseDetail, User, View } from '@/lib/types';

interface LearningPageProps {
  courseId: string;
  lessonId?: string;
  user: User | null;
  onNavigate: (view: View) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

interface LearnData {
  course: CourseDetail;
  progress: Record<string, boolean>;
  completedCount: number;
  totalLessons: number;
  progressPct: number;
  hasCertificate: boolean;
}

export function LearningPage({
  courseId,
  lessonId,
  user,
  onNavigate,
  onOpenAuth,
}: LearningPageProps) {
  const [data, setData] = useState<LearnData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) {
      onOpenAuth('login');
      return;
    }
    try {
      // We don't have a direct API for "get course by id with progress for learning"
      // so we fetch via slug. Let's get course list first, then slug.
      // Actually simpler: we already have courseId, fetch the course detail.
      // Reuse the courses/[slug] endpoint - but we have id, not slug.
      // Let's create a simpler approach: fetch enrollments (includes course + progress).
      const res = await fetch('/api/enrollments');
      const d = await res.json();
      const enr = d.enrollments.find((e: any) => e.courseId === courseId);
      if (!enr) {
        toast.error('Anda belum terdaftar di course ini');
        onNavigate({ type: 'dashboard' });
        return;
      }
      const learnData: LearnData = {
        course: enr.course,
        progress: enr.progressMap,
        completedCount: enr.completedLessons,
        totalLessons: enr.totalLessons,
        progressPct: enr.progressPct,
        hasCertificate: enr.hasCertificate,
      };
      setData(learnData);
      // Determine starting lesson
      const allLessons = learnData.course.modules.flatMap((m) => m.lessons);
      if (lessonId && allLessons.find((l) => l.id === lessonId)) {
        setActiveLessonId(lessonId);
      } else {
        // First incomplete lesson, or first lesson
        const firstIncomplete = allLessons.find((l) => !learnData.progress[l.id]);
        setActiveLessonId(firstIncomplete?.id || allLessons[0]?.id || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [courseId, lessonId, user, onNavigate, onOpenAuth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const allLessons = data?.course.modules.flatMap((m) => m.lessons) || [];
  const activeLesson = allLessons.find((l) => l.id === activeLessonId);
  const activeIndex = allLessons.findIndex((l) => l.id === activeLessonId);
  const activeModule = data?.course.modules.find((m) =>
    m.lessons.some((l) => l.id === activeLessonId)
  );

  const markComplete = async (lessonId: string, completed: boolean) => {
    setUpdatingProgress(true);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, completed, courseId }),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error(d.error || 'Gagal update progress');
        return;
      }
      // Update local state
      if (data) {
        const newProgress = { ...data.progress, [lessonId]: completed };
        const completedCount = Object.values(newProgress).filter(Boolean).length;
        const pct = data.totalLessons ? Math.round((completedCount / data.totalLessons) * 100) : 0;
        setData({ ...data, progress: newProgress, completedCount, progressPct: pct });
        if (completed) {
          toast.success('Pelajaran ditandai selesai!');
          if (pct === 100) {
            toast.success('🎉 Selamat! Anda telah menyelesaikan course ini!');
          }
        }
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setUpdatingProgress(false);
    }
  };

  const goToLesson = (lid: string) => {
    setActiveLessonId(lid);
    setSidebarOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goNext = () => {
    if (activeIndex < allLessons.length - 1) {
      goToLesson(allLessons[activeIndex + 1].id);
    }
  };
  const goPrev = () => {
    if (activeIndex > 0) {
      goToLesson(allLessons[activeIndex - 1].id);
    }
  };

  if (loading || !data || !activeLesson) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
        <span className="ml-2 text-muted-foreground">Memuat pelajaran...</span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Top bar */}
      <div className="border-b bg-white sticky top-16 z-30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => onNavigate({ type: 'course', slug: data.course.slug })}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali ke Course</span>
            </button>
            <div className="flex-1 mx-4 hidden md:block">
              <div className="flex items-center gap-3">
                <Progress value={data.progressPct} className="h-2 flex-1" />
                <span className="text-sm font-semibold text-teal-700 whitespace-nowrap">
                  {data.progressPct}%
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span className="ml-1">Materi</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lesson content */}
          <div className="lg:col-span-2">
            {/* Video */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-5">
              {activeLesson.videoUrl ? (
                <iframe
                  src={activeLesson.videoUrl}
                  title={activeLesson.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-700 to-cyan-800 text-white">
                  <div className="text-center">
                    <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <div className="text-sm opacity-80">Video tidak tersedia</div>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson header */}
            <div className="mb-5">
              {activeModule && (
                <div className="text-xs text-teal-600 font-medium mb-1">
                  {activeModule.title}
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold mb-3">{activeLesson.title}</h1>
              {activeLesson.description && (
                <p className="text-muted-foreground text-sm mb-3">{activeLesson.description}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activeLesson.durationMin} menit
                </span>
                {data.progress[activeLesson.id] && (
                  <Badge variant="secondary" className="bg-teal-50 text-teal-700">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Selesai
                  </Badge>
                )}
              </div>
            </div>

            {/* Content */}
            {activeLesson.contentMd && (
              <Card className="mb-5">
                <CardContent className="p-6">
                  <div className="markdown-body">
                    <ReactMarkdown>{activeLesson.contentMd}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action bar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center p-4 bg-white border rounded-xl">
              <Button
                variant="outline"
                onClick={goPrev}
                disabled={activeIndex === 0}
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Sebelumnya
              </Button>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant={data.progress[activeLesson.id] ? 'outline' : 'default'}
                  onClick={() => markComplete(activeLesson.id, !data.progress[activeLesson.id])}
                  disabled={updatingProgress}
                  className={
                    data.progress[activeLesson.id]
                      ? 'w-full sm:w-auto'
                      : 'w-full sm:w-auto bg-teal-600 hover:bg-teal-700'
                  }
                >
                  {updatingProgress ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : data.progress[activeLesson.id] ? (
                    <CheckCircle2 className="w-4 h-4 mr-2 text-teal-600" />
                  ) : null}
                  {data.progress[activeLesson.id] ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
                </Button>
                {activeIndex < allLessons.length - 1 ? (
                  <Button
                    onClick={goNext}
                    className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700"
                  >
                    Berikutnya
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => onNavigate({ type: 'quiz', courseId })}
                    className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Ambil Kuis Final
                  </Button>
                )}
              </div>
            </div>

            {/* Certificate prompt */}
            {data.hasCertificate && (
              <Card className="mt-5 border-amber-300 bg-amber-50">
                <CardContent className="p-5 flex items-center gap-4">
                  <Award className="w-10 h-10 text-amber-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-amber-900">Selamat! Anda telah lulus</div>
                    <div className="text-sm text-amber-700">
                      Sertifikat telah diterbitkan untuk course ini
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-amber-400 text-amber-700 hover:bg-amber-100"
                    onClick={() => onNavigate({ type: 'dashboard' })}
                  >
                    Lihat Sertifikat
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - curriculum */}
          <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <Card className="lg:sticky lg:top-32 max-h-[calc(100vh-9rem)] overflow-hidden">
              <div className="p-4 border-b bg-muted/50">
                <div className="font-semibold text-sm mb-1">{data.course.title}</div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {data.completedCount}/{data.totalLessons} pelajaran
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-teal-700">{data.progressPct}%</span>
                </div>
                <Progress value={data.progressPct} className="h-1.5 mt-2" />
              </div>
              <div className="overflow-y-auto max-h-[calc(100vh-16rem)] scroll-area">
                {data.course.modules.map((m, mi) => (
                  <div key={m.id} className="border-b border-border last:border-0">
                    <div className="px-4 py-2.5 bg-muted/30 sticky top-0">
                      <div className="text-xs font-semibold text-foreground">
                        {m.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {m.lessons.length} pelajaran
                      </div>
                    </div>
                    {m.lessons.map((l) => {
                      const isActive = l.id === activeLessonId;
                      const isDone = data.progress[l.id];
                      return (
                        <button
                          key={l.id}
                          onClick={() => goToLesson(l.id)}
                          className={`w-full px-4 py-2.5 flex items-start gap-2 text-left transition-colors border-l-2 ${
                            isActive
                              ? 'bg-teal-50 border-teal-600'
                              : 'border-transparent hover:bg-muted/30'
                          }`}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-teal-600" />
                            ) : (
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${
                                  isActive
                                    ? 'border-teal-600'
                                    : 'border-muted-foreground/40'
                                }`}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`text-xs leading-snug ${
                                isActive
                                  ? 'font-semibold text-teal-900'
                                  : isDone
                                  ? 'text-teal-700'
                                  : 'text-foreground'
                              }`}
                            >
                              {l.title}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              {l.durationMin} mnt
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

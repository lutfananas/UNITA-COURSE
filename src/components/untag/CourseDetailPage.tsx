'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Star,
  Users,
  Clock,
  BookOpen,
  Play,
  CheckCircle2,
  ArrowLeft,
  Award,
  Globe,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Lock,
  Loader2,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import type { CourseDetail, User, View, Review } from '@/lib/types';
import { toast } from 'sonner';

interface CourseDetailPageProps {
  slug: string;
  user: User | null;
  onNavigate: (view: View) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  requireAuth: (action: () => void) => void;
}

const LEVEL_LABEL: Record<string, string> = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Lanjut',
};

export function CourseDetailPage({
  slug,
  user,
  onNavigate,
  onOpenAuth,
  requireAuth,
}: CourseDetailPageProps) {
  const [data, setData] = useState<{
    course: CourseDetail;
    enrollment: any | null;
    progress: Record<string, boolean>;
    hasCertificate: boolean;
    totalLessons: number;
    completedCount: number;
    progressPct: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('overview');
  const [enrolling, setEnrolling] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${slug}`);
      if (!res.ok) {
        toast.error('Course tidak ditemukan');
        onNavigate({ type: 'home' });
        return;
      }
      const d = await res.json();
      setData(d);
      // Auto-expand first module
      if (d.course.modules.length > 0) {
        setExpandedModules(new Set([d.course.modules[0].id]));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [slug, onNavigate]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleEnroll = async () => {
    if (!user) {
      onOpenAuth('register');
      return;
    }
    if (data?.enrollment) {
      // Already enrolled, go to learn
      onNavigate({ type: 'learn', courseId: data.course.id });
      return;
    }
    setEnrolling(true);
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: data?.course.id }),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error(d.error || 'Gagal enroll');
        return;
      }
      toast.success('Berhasil mendaftar! Mari mulai belajar.');
      onNavigate({ type: 'learn', courseId: data!.course.id });
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    if (!user) {
      onOpenAuth('register');
      return;
    }
    onNavigate({ type: 'learn', courseId: data!.course.id });
  };

  const handleTakeQuiz = () => {
    requireAuth(() => {
      onNavigate({ type: 'quiz', courseId: data!.course.id });
    });
  };

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: data.course.id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error(d.error || 'Gagal menambah review');
        return;
      }
      toast.success('Review terkirim! Terima kasih atas umpan balik Anda.');
      setReviewComment('');
      setReviewRating(5);
      fetchDetail();
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
        <span className="ml-2 text-muted-foreground">Memuat course...</span>
      </div>
    );
  }

  const { course, enrollment, progress, hasCertificate, progressPct } = data;
  const isEnrolled = !!enrollment;

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 via-cyan-700 to-teal-800 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12">
          <button
            onClick={() => onNavigate({ type: 'home' })}
            className="flex items-center gap-1 text-white/80 hover:text-white text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Katalog
          </button>

          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Left: Course info */}
            <div className="lg:col-span-2">
              {course.category && (
                <Badge className="mb-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-0">
                  {course.category.name}
                </Badge>
              )}
              <h1 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
                {course.title}
              </h1>
              <p className="text-white/85 text-base md:text-lg mb-4 max-w-3xl">
                {course.shortDesc}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span className="font-bold">{course.rating.toFixed(1)}</span>
                  <span className="text-white/70">({course.reviewCount} ulasan)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{course.enrollCount} terdaftar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4" />
                  <span>{LEVEL_LABEL[course.level]}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  <span>Bahasa Indonesia</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-white/30">
                  <AvatarImage src={course.instructor.avatar || undefined} />
                  <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xs text-white/70">Pengajar</div>
                  <div className="font-medium text-sm">{course.instructor.name}</div>
                  {course.instructor.headline && (
                    <div className="text-xs text-white/70">{course.instructor.headline}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Preview placeholder (visible only on lg+) */}
            <div className="hidden lg:block">
              <div className="aspect-video rounded-xl overflow-hidden border border-white/20 shadow-2xl">
                {course.previewVideo ? (
                  <iframe
                    src={course.previewVideo}
                    title="Preview"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="overview">Ikhtisar</TabsTrigger>
                  <TabsTrigger value="curriculum">Kurikulum</TabsTrigger>
                  <TabsTrigger value="reviews">Ulasan</TabsTrigger>
                </TabsList>

                {/* OVERVIEW */}
                <TabsContent value="overview" className="space-y-6">
                  {/* What you'll learn */}
                  {course.whatYouLearn && (
                    <Card className="border-teal-100 bg-teal-50/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Sparkles className="w-5 h-5 text-teal-600" />
                          Yang Akan Anda Pelajari
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="grid sm:grid-cols-2 gap-3">
                          {course.whatYouLearn.split('\n').filter(Boolean).map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tentang Course Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
                        {course.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Requirements */}
                  {course.requirements && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Persyaratan</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {course.requirements.split('\n').filter(Boolean).map((req, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Instructor */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pengajar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={course.instructor.avatar || undefined} />
                          <AvatarFallback className="bg-teal-100 text-teal-700 text-xl">
                            {course.instructor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold">{course.instructor.name}</div>
                          {course.instructor.headline && (
                            <div className="text-sm text-muted-foreground mb-2">{course.instructor.headline}</div>
                          )}
                          {course.instructor.bio && (
                            <p className="text-sm text-foreground/85 leading-relaxed mt-2">
                              {course.instructor.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* CURRICULUM */}
                <TabsContent value="curriculum" className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Kurikulum Course</h3>
                    <div className="text-sm text-muted-foreground">
                      {course.modules.length} modul • {data.totalLessons} pelajaran • {course.durationMin} menit
                    </div>
                  </div>

                  {course.modules.map((m, idx) => {
                    const expanded = expandedModules.has(m.id);
                    return (
                      <Card key={m.id} className="overflow-hidden">
                        <button
                          onClick={() => toggleModule(m.id)}
                          className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold text-sm flex items-center justify-center">
                              {idx + 1}
                            </div>
                            <div>
                              <div className="font-semibold text-sm">{m.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {m.lessons.length} pelajaran •{' '}
                                {m.lessons.reduce((a, l) => a + l.durationMin, 0)} menit
                              </div>
                            </div>
                          </div>
                          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {expanded && (
                          <div className="border-t border-border">
                            {m.lessons.map((l) => {
                              const isDone = progress[l.id];
                              return (
                                <div
                                  key={l.id}
                                  className="px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors border-b border-border last:border-0"
                                >
                                  <div className="flex-shrink-0">
                                    {isDone ? (
                                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                                    ) : l.preview ? (
                                      <Play className="w-4 h-4 text-amber-500" />
                                    ) : !isEnrolled ? (
                                      <Lock className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                      <Play className="w-4 h-4 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className={`text-sm ${isDone ? 'text-teal-700' : ''}`}>
                                      {l.title}
                                    </div>
                                    {l.description && (
                                      <div className="text-xs text-muted-foreground truncate">
                                        {l.description}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {l.preview && !isEnrolled && (
                                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                        Preview
                                      </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      {l.durationMin}m
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </TabsContent>

                {/* REVIEWS */}
                <TabsContent value="reviews" className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-teal-600">
                            {course.rating.toFixed(1)}
                          </div>
                          <div className="flex justify-center gap-0.5 my-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${
                                  s <= Math.round(course.rating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {course.reviewCount} ulasan
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                          {[5, 4, 3, 2, 1].map((s) => {
                            const cnt = course.reviews.filter((r) => r.rating === s).length;
                            const pct = course.reviews.length ? (cnt / course.reviews.length) * 100 : 0;
                            return (
                              <div key={s} className="flex items-center gap-2 text-sm">
                                <span className="w-3">{s}</span>
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-amber-400"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="w-8 text-right text-muted-foreground">{cnt}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit review */}
                  {isEnrolled && !hasCertificate && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MessageSquare className="w-5 h-5" />
                          Tulis Ulasan Anda
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmitReview} className="space-y-3">
                          <div>
                            <Label className="text-sm mb-2 block">Rating</Label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setReviewRating(s)}
                                  className="p-1"
                                >
                                  <Star
                                    className={`w-6 h-6 transition-colors ${
                                      s <= reviewRating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-muted-foreground hover:text-amber-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="review-comment" className="text-sm mb-1 block">
                              Komentar (opsional)
                            </Label>
                            <Textarea
                              id="review-comment"
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="Bagikan pengalaman Anda dengan course ini..."
                              rows={3}
                            />
                          </div>
                          <Button
                            type="submit"
                            disabled={submittingReview}
                            className="bg-teal-600 hover:bg-teal-700"
                          >
                            {submittingReview ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <MessageSquare className="w-4 h-4 mr-2" />
                            )}
                            Kirim Ulasan
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  )}

                  {/* Reviews list */}
                  <div className="space-y-3">
                    {course.reviews.length === 0 ? (
                      <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          Belum ada ulasan. Jadilah yang pertama!
                        </CardContent>
                      </Card>
                    ) : (
                      course.reviews.map((r) => (
                        <Card key={r.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-9 h-9">
                                <AvatarImage src={r.user.avatar || undefined} />
                                <AvatarFallback className="bg-teal-100 text-teal-700">
                                  {r.user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium text-sm">{r.user.name}</div>
                                    {r.user.headline && (
                                      <div className="text-xs text-muted-foreground">{r.user.headline}</div>
                                    )}
                                  </div>
                                  <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star
                                        key={s}
                                        className={`w-3 h-3 ${
                                          s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                {r.comment && (
                                  <p className="text-sm text-foreground/85 mt-2 leading-relaxed">
                                    {r.comment}
                                  </p>
                                )}
                                <div className="text-xs text-muted-foreground mt-2">
                                  {new Date(r.createdAt).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - enroll card */}
            <div className="order-1 lg:order-2">
              <Card className="lg:sticky lg:top-20 border-0 shadow-xl">
                <CardContent className="p-0">
                  {/* Preview thumbnail (mobile) */}
                  <div className="aspect-video overflow-hidden rounded-t-xl lg:hidden">
                    {course.thumbnail && (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div className="p-5">
                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-bold text-teal-700">
                        {course.premium ? `Rp ${course.price.toLocaleString('id-ID')}` : 'Gratis'}
                      </span>
                      {course.premium && (
                        <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                          Premium
                        </Badge>
                      )}
                    </div>

                    {/* Progress (if enrolled) */}
                    {isEnrolled && (
                      <div className="mb-4 p-3 bg-teal-50 rounded-lg">
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="font-medium text-teal-900">Progres Anda</span>
                          <span className="font-bold text-teal-700">{progressPct}%</span>
                        </div>
                        <Progress value={progressPct} className="h-2 bg-teal-100" />
                        <div className="text-xs text-teal-700 mt-1.5">
                          {data.completedCount} dari {data.totalLessons} pelajaran selesai
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    {hasCertificate ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <Award className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <div className="text-sm">
                            <div className="font-semibold text-amber-900">Selamat! Anda telah lulus</div>
                            <div className="text-xs text-amber-700">Sertifikat telah diterbitkan</div>
                          </div>
                        </div>
                        <Button
                          className="w-full bg-amber-600 hover:bg-amber-700"
                          onClick={() => onNavigate({ type: 'dashboard' })}
                        >
                          <Award className="w-4 h-4 mr-2" />
                          Lihat Sertifikat
                        </Button>
                      </div>
                    ) : isEnrolled ? (
                      <div className="space-y-2">
                        <Button
                          className="w-full bg-teal-600 hover:bg-teal-700"
                          onClick={handleStartLearning}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {progressPct > 0 ? 'Lanjutkan Belajar' : 'Mulai Belajar'}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                          onClick={handleTakeQuiz}
                        >
                          <Award className="w-4 h-4 mr-2" />
                          Ambil Kuis Final
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-teal-600 hover:bg-teal-700"
                        onClick={handleEnroll}
                        disabled={enrolling}
                        size="lg"
                      >
                        {enrolling ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        Daftar Gratis Sekarang
                      </Button>
                    )}

                    {/* Includes */}
                    <div className="mt-5 pt-5 border-t border-border">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Course ini mencakup
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Play className="w-4 h-4 text-teal-600 flex-shrink-0" />
                          <span>{data.totalLessons} pelajaran on-demand</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-teal-600 flex-shrink-0" />
                          <span>{course.durationMin} menit total</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-teal-600 flex-shrink-0" />
                          <span>Akses seumur hidup</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-teal-600 flex-shrink-0" />
                          <span>Materi downloadable</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-teal-600 flex-shrink-0" />
                          <span>Sertifikat resmi UNTAG</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Star,
  Users,
  Clock,
  BookOpen,
  Play,
  Sparkles,
  TrendingUp,
  Award,
  ArrowRight,
  Search,
  Loader2,
  CheckCircle2,
  Briefcase,
  Calculator,
  Wallet,
  Rocket,
  GraduationCap,
  Zap,
  Shield,
  Crown,
  Trophy,
} from 'lucide-react';
import type { CourseListItem, Category, User, View } from '@/lib/types';
import { CourseCard } from './CourseCard';

interface HomePageProps {
  user: User | null;
  onNavigate: (view: View) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  requireAuth: (action: () => void) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  manajemen: Briefcase,
  akuntansi: Calculator,
  'ekonomi-pembangunan': TrendingUp,
  'soft-skills': Users,
  keuangan: Wallet,
  kewirausahaan: Rocket,
};

export function HomePage({ user, onNavigate, onOpenAuth, requireAuth }: HomePageProps) {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [sort, setSort] = useState('popular');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (category !== 'all') params.set('category', category);
      if (level !== 'all') params.set('level', level);
      params.set('sort', sort);
      const res = await fetch(`/api/courses?${params}`);
      const data = await res.json();
      setCourses(data.courses || []);
      setCategories(data.categories || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, category, level, sort]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Listen for search events from header
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      setSearch(detail);
    };
    window.addEventListener('unita:search', handler);
    return () => window.removeEventListener('unita:search', handler);
  }, []);

  const featuredCourse = courses.find((c) => c.slug === 'interview-skills-for-beginners');
  const otherCourses = courses.filter((c) => c.slug !== 'interview-skills-for-beginners');

  return (
    <div>
      {/* ════════ HERO PREMIUM ════════ */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="text-center lg:text-left slide-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-medium tracking-wide">Platform Resmi Fakultas Ekonomi UNITA</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-5 tracking-tight">
                Belajar Skill Ekonomi <br />
                <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  Kapan & Di Mana Saja
                </span>
              </h1>
              <p className="text-base md:text-lg text-white/80 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Akses kursus berkualitas dari dosen Fakultas Ekonomi Universitas Tulungagung.
                Gratis untuk semua. Sertifikat resmi setelah lulus.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
                <Button
                  size="lg"
                  className="bg-amber-400 hover:bg-amber-300 text-blue-950 hover:text-blue-900 text-base font-semibold h-12 px-7 shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:scale-105"
                  onClick={() => onOpenAuth('register')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Mulai Gratis Sekarang
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 text-base h-12 px-7 backdrop-blur-sm"
                  onClick={() => {
                    const el = document.getElementById('catalog');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Jelajahi Kursus
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 pt-6 border-t border-white/10">
                <div className="text-center lg:text-left">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-white to-blue-200 bg-clip-text text-transparent">
                    7+
                  </div>
                  <div className="text-xs text-white/60 mt-1">Kursus</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-white to-blue-200 bg-clip-text text-transparent">
                    2.1K+
                  </div>
                  <div className="text-xs text-white/60 mt-1">Mahasiswa</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                    100%
                  </div>
                  <div className="text-xs text-white/60 mt-1">Gratis</div>
                </div>
              </div>
            </div>

            {/* Hero Card (premium floating) */}
            <div className="relative hidden lg:block float-animate">
              <div className="absolute -top-8 -right-8 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl" />
              <Card className="relative bg-white/95 backdrop-blur-xl shadow-2xl border-0 shadow-blue-950/40">
                <CardContent className="p-0">
                  {featuredCourse && (
                    <div>
                      <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                        <img
                          src={featuredCourse.thumbnail || ''}
                          alt={featuredCourse.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-950/20 to-transparent" />
                        <Badge className="absolute top-3 left-3 bg-amber-400 hover:bg-amber-500 text-blue-950 border-0 font-semibold">
                          <Crown className="w-3 h-3 mr-1" />
                          Kursus Unggulan
                        </Badge>
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer">
                            <Play className="w-6 h-6 text-blue-900 fill-blue-900 ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <div className="text-xs opacity-80 mb-1 font-medium">⭐ Pilot Course</div>
                          <div className="font-bold text-lg leading-tight drop-shadow-lg">{featuredCourse.title}</div>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {featuredCourse.shortDesc}
                        </p>
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="w-9 h-9 ring-2 ring-blue-100">
                            <AvatarImage src={featuredCourse.instructor.avatar || undefined} />
                            <AvatarFallback className="bg-blue-900 text-white text-xs">{featuredCourse.instructor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <div className="font-semibold">{featuredCourse.instructor.name}</div>
                            <div className="text-xs text-muted-foreground">{featuredCourse.instructor.headline}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-bold text-foreground">{featuredCourse.rating}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {featuredCourse.enrollCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {featuredCourse.totalDuration} mnt
                            </span>
                          </div>
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-medium">
                            {featuredCourse.level === 'BEGINNER' ? 'Pemula' : featuredCourse.level === 'INTERMEDIATE' ? 'Menengah' : 'Lanjut'}
                          </Badge>
                        </div>
                        <Button
                          className="w-full bg-blue-900 hover:bg-blue-800 btn-glow font-semibold"
                          onClick={() => onNavigate({ type: 'course', slug: featuredCourse.slug })}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Lihat Kursus
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ TRUST BADGES ════════ */}
      <section className="border-b bg-white py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Zap, color: 'blue', title: 'Belajar Fleksibel', desc: 'Sesuai tempo Anda', bg: 'bg-blue-50', text: 'text-blue-700' },
              { icon: Award, color: 'amber', title: 'Sertifikat Resmi', desc: 'Setelah lulus kuis', bg: 'bg-amber-50', text: 'text-amber-700' },
              { icon: Shield, color: 'cyan', title: 'Dosen Profesional', desc: 'Pengajar FE UNITA', bg: 'bg-cyan-50', text: 'text-cyan-700' },
              { icon: GraduationCap, color: 'purple', title: '100% Gratis', desc: 'Untuk semua peserta', bg: 'bg-purple-50', text: 'text-purple-700' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${item.text}`} />
                  </div>
                  <div className="text-sm font-semibold">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ CATALOG ════════ */}
      <section id="catalog" className="py-12 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
                Jelajahi Semua Kursus
              </h2>
              <p className="text-muted-foreground">
                Temukan kursus yang sesuai dengan tujuan karir Anda
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Total:</span>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-semibold px-3 py-1">
                {courses.length} kursus
              </Badge>
            </div>
          </div>

          {/* Filters bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-4 bg-white border rounded-xl shadow-premium">
            <div className="relative col-span-2 md:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kursus..."
                className="pl-10"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Level</SelectItem>
                <SelectItem value="BEGINNER">Pemula</SelectItem>
                <SelectItem value="INTERMEDIATE">Menengah</SelectItem>
                <SelectItem value="ADVANCED">Lanjut</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Terpopuler</SelectItem>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="rating">Rating Tertinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scroll-area">
            <button
              onClick={() => setCategory('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === 'all'
                  ? 'bg-blue-900 text-white shadow-navy'
                  : 'bg-white border text-foreground hover:bg-blue-50 hover:border-blue-200'
              }`}
            >
              Semua
            </button>
            {categories.map((c) => {
              const Icon = CATEGORY_ICONS[c.slug] || BookOpen;
              const active = category === c.slug;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.slug)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? 'bg-blue-900 text-white shadow-navy'
                      : 'bg-white border text-foreground hover:bg-blue-50 hover:border-blue-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* Featured Course (only when no filter) */}
          {featuredCourse && !search && category === 'all' && level === 'all' && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold">Kursus Unggulan</h3>
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                  Pilot
                </Badge>
              </div>
              <FeaturedCourseCard
                course={featuredCourse}
                onClick={() => onNavigate({ type: 'course', slug: featuredCourse.slug })}
              />
            </div>
          )}

          {/* Course Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-blue-900" />
              <span className="ml-2 text-muted-foreground">Memuat kursus...</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">Tidak ada kursus ditemukan</h3>
              <p className="text-sm text-muted-foreground">Coba ubah filter atau kata kunci pencarian</p>
              <Button
                variant="outline"
                className="mt-4 border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                  setLevel('all');
                }}
              >
                Reset Filter
              </Button>
            </div>
          ) : (
            <div>
              {(search || category !== 'all' || level !== 'all') && (
                <h3 className="text-lg font-bold mb-4">Hasil Pencarian ({courses.length})</h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {(search || category !== 'all' || level !== 'all' ? courses : otherCourses).map((c) => (
                  <CourseCard
                    key={c.id}
                    course={c}
                    onClick={() => onNavigate({ type: 'course', slug: c.slug })}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/40 to-blue-950/80" />
        <div className="container relative mx-auto max-w-4xl px-4 sm:px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-400/30 mb-5">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs font-medium tracking-wide text-amber-200">Sertifikat Resmi UNITA</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Tingkatkan Karir Anda Hari Ini
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Bergabung dengan ribuan mahasiswa dan profesional yang telah mengembangkan skill ekonomi
            melalui UNITA Learn. Semua kursus gratis, dapat diakses seumur hidup.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!user ? (
              <Button
                size="lg"
                className="bg-amber-400 hover:bg-amber-300 text-blue-950 hover:text-blue-900 text-base h-12 px-8 font-semibold shadow-2xl shadow-amber-500/30 hover:scale-105 transition-all"
                onClick={() => onOpenAuth('register')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Daftar Gratis Sekarang
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-amber-400 hover:bg-amber-300 text-blue-950 hover:text-blue-900 text-base h-12 px-8 font-semibold shadow-2xl shadow-amber-500/30"
                onClick={() => onNavigate({ type: 'dashboard' })}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Buka Dashboard Saya
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="text-base h-12 px-8 border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm"
              onClick={() => onNavigate({ type: 'course', slug: 'interview-skills-for-beginners' })}
            >
              Coba Kursus Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Featured Course Card (premium) ───
function FeaturedCourseCard({
  course,
  onClick,
}: {
  course: CourseListItem;
  onClick: () => void;
}) {
  return (
    <Card
      className="course-card overflow-hidden cursor-pointer border-0 shadow-premium ring-1 ring-blue-900/10"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-video md:aspect-auto overflow-hidden">
            <img
              src={course.thumbnail || ''}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-blue-950/10 to-transparent md:bg-gradient-to-r" />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-amber-400 hover:bg-amber-500 text-blue-950 border-0 font-semibold">
                <Crown className="w-3 h-3 mr-1" /> Pilot Course
              </Badge>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="text-xl font-bold leading-tight drop-shadow-lg">{course.title}</div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {course.shortDesc}
            </p>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-10 h-10 ring-2 ring-blue-100">
                <AvatarImage src={course.instructor.avatar || undefined} />
                <AvatarFallback className="bg-blue-900 text-white">{course.instructor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold">{course.instructor.name}</div>
                <div className="text-xs text-muted-foreground">{course.instructor.headline}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
              <div className="flex flex-col p-2 rounded-lg bg-amber-50">
                <span className="text-xs text-muted-foreground">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{course.rating}</span>
                </div>
              </div>
              <div className="flex flex-col p-2 rounded-lg bg-blue-50">
                <span className="text-xs text-muted-foreground">Pelajar</span>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-700" />
                  <span className="font-bold">{course.enrollCount}</span>
                </div>
              </div>
              <div className="flex flex-col p-2 rounded-lg bg-cyan-50">
                <span className="text-xs text-muted-foreground">Durasi</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-700" />
                  <span className="font-bold">{course.totalDuration}m</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                {course.level === 'BEGINNER' ? 'Pemula' : course.level === 'INTERMEDIATE' ? 'Menengah' : 'Lanjut'}
              </Badge>
              <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Gratis
              </Badge>
              <Badge variant="secondary" className="bg-cyan-50 text-cyan-700">
                {course.totalLessons} Pelajaran
              </Badge>
            </div>
            <Button className="w-full bg-blue-900 hover:bg-blue-800 btn-glow">
              <Play className="w-4 h-4 mr-2" />
              Mulai Belajar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

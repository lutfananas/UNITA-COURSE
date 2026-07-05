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
  const [highlightSlug, setHighlightSlug] = useState<string | null>(null);

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
    window.addEventListener('untag:search', handler);
    return () => window.removeEventListener('untag:search', handler);
  }, []);

  // Highlight pilot course
  useEffect(() => {
    if (!loading && courses.length > 0 && !search && category === 'all') {
      const pilot = courses.find((c) => c.slug === 'interview-skills-for-beginners');
      if (pilot) setHighlightSlug(pilot.slug);
    }
  }, [loading, courses, search, category]);

  const featuredCourse = courses.find((c) => c.slug === 'interview-skills-for-beginners');
  const otherCourses = courses.filter((c) => c.slug !== 'interview-skills-for-beginners');

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 hero-mesh opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/30" />
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur">
                <Sparkles className="w-3 h-3 mr-1" />
                Platform MOOC Fakultas Ekonomi UNTAG
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                Belajar Skill Ekonomi <br />
                <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  Kapan & Di Mana Saja
                </span>
              </h1>
              <p className="text-base md:text-lg text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                Akses kursus berkualitas dari dosen Fakultas Ekonomi Universitas Tulungagung.
                Gratis untuk semua. Sertifikat resmi setelah lulus.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-white text-teal-700 hover:bg-amber-50 hover:text-teal-800 text-base font-semibold h-12 px-6"
                  onClick={() => onOpenAuth('register')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Mulai Gratis Sekarang
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 hover:text-white text-base h-12 px-6"
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
              <div className="grid grid-cols-3 gap-4 mt-10 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold">7+</div>
                  <div className="text-xs text-white/70">Kursus</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold">2.1K+</div>
                  <div className="text-xs text-white/70">Mahasiswa</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold">100%</div>
                  <div className="text-xs text-white/70">Gratis</div>
                </div>
              </div>
            </div>

            {/* Hero Card */}
            <div className="relative hidden lg:block">
              <div className="absolute -top-6 -right-6 w-72 h-72 bg-amber-400/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-cyan-300/30 rounded-full blur-3xl" />
              <Card className="relative bg-white/95 backdrop-blur shadow-2xl border-0">
                <CardContent className="p-0">
                  {featuredCourse && (
                    <div>
                      <div className="relative aspect-video overflow-hidden rounded-t-xl">
                        <img
                          src={featuredCourse.thumbnail || ''}
                          alt={featuredCourse.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <Badge className="absolute top-3 left-3 bg-amber-500 hover:bg-amber-600 text-white border-0">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Kursus Unggulan
                        </Badge>
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <div className="text-sm opacity-90 mb-1">Pilot Course</div>
                          <div className="font-bold text-lg leading-tight">{featuredCourse.title}</div>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {featuredCourse.shortDesc}
                        </p>
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={featuredCourse.instructor.avatar || undefined} />
                            <AvatarFallback>{featuredCourse.instructor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <div className="font-medium">{featuredCourse.instructor.name}</div>
                            <div className="text-xs text-muted-foreground">{featuredCourse.instructor.headline}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-semibold text-foreground">{featuredCourse.rating}</span>
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
                          <Badge variant="secondary" className="bg-teal-50 text-teal-700">
                            {featuredCourse.level === 'BEGINNER' ? 'Pemula' : featuredCourse.level === 'INTERMEDIATE' ? 'Menengah' : 'Lanjut'}
                          </Badge>
                        </div>
                        <Button
                          className="w-full bg-teal-600 hover:bg-teal-700"
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

      {/* TRUST BADGES */}
      <section className="border-b bg-white py-6">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                <Zap className="w-5 h-5 text-teal-600" />
              </div>
              <div className="text-sm font-medium">Belajar Fleksibel</div>
              <div className="text-xs text-muted-foreground">Sesuai tempo Anda</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-sm font-medium">Sertifikat Resmi</div>
              <div className="text-xs text-muted-foreground">Setelah lulus kuis</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="text-sm font-medium">Dosen Profesional</div>
              <div className="text-xs text-muted-foreground">Pengajar FE UNTAG</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-sm font-medium">100% Gratis</div>
              <div className="text-xs text-muted-foreground">Untuk semua peserta</div>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-12 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Jelajahi Semua Kursus
              </h2>
              <p className="text-muted-foreground">
                Temukan kursus yang sesuai dengan tujuan karir Anda
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Total:</span>
              <Badge variant="secondary" className="bg-teal-50 text-teal-700 font-semibold">
                {courses.length} kursus
              </Badge>
            </div>
          </div>

          {/* Filters bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-4 bg-white border rounded-xl">
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
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scroll-area">
            <button
              onClick={() => setCategory('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === 'all'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white border text-foreground hover:bg-teal-50'
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
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    active
                      ? 'bg-teal-600 text-white'
                      : 'bg-white border text-foreground hover:bg-teal-50'
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
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold">Kursus Unggulan</h3>
              </div>
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="lg:col-span-2">
                  <FeaturedCourseCard
                    course={featuredCourse}
                    onClick={() => onNavigate({ type: 'course', slug: featuredCourse.slug })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Course Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
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
                className="mt-4"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {(search || category !== 'all' || level !== 'all' ? courses : otherCourses).map((c) => (
                <CourseCard
                  key={c.id}
                  course={c}
                  onClick={() => onNavigate({ type: 'course', slug: c.slug })}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-teal-50 via-cyan-50 to-amber-50">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <Badge className="mb-4 bg-teal-100 hover:bg-teal-200 text-teal-700 border-0">
            <Award className="w-3 h-3 mr-1" />
            Sertifikat Resmi UNTAG
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tingkatkan Karir Anda Hari Ini
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Bergabung dengan ribuan mahasiswa dan profesional yang telah mengembangkan skill ekonomi
            melalui UNTAG Learn. Semua kursus gratis, dapat diakses seumur hidup.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!user ? (
              <Button
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-base h-12 px-8"
                onClick={() => onOpenAuth('register')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Daftar Gratis Sekarang
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-base h-12 px-8"
                onClick={() => onNavigate({ type: 'dashboard' })}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Buka Dashboard Saya
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="text-base h-12 px-8"
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

// ─── Featured Course Card (larger, more prominent) ───
function FeaturedCourseCard({
  course,
  onClick,
}: {
  course: CourseListItem;
  onClick: () => void;
}) {
  return (
    <Card
      className="course-card overflow-hidden cursor-pointer border-0 shadow-lg ring-1 ring-teal-100"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0 mb-2">
                <Sparkles className="w-3 h-3 mr-1" /> Pilot Course
              </Badge>
              <div className="text-xl font-bold leading-tight">{course.title}</div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {course.shortDesc}
            </p>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={course.instructor.avatar || undefined} />
                <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{course.instructor.name}</div>
                <div className="text-xs text-muted-foreground">{course.instructor.headline}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{course.rating}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Pelajar</span>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                  <span className="font-semibold">{course.enrollCount}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Durasi</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="font-semibold">{course.totalDuration}m</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-teal-50 text-teal-700">
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
            <Button className="w-full bg-teal-600 hover:bg-teal-700">
              <Play className="w-4 h-4 mr-2" />
              Mulai Belajar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

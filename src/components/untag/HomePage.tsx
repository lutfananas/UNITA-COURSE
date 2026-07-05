'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  Star, Users, Clock, BookOpen, Play, Sparkles, TrendingUp,
  Award, ArrowRight, Search, Loader2, CheckCircle2, Briefcase,
  Calculator, Wallet, Rocket, GraduationCap, Zap, Shield, Crown,
  Trophy, ChevronDown, Infinity as InfinityIcon,
} from 'lucide-react';
import type { CourseListItem, Category, User, View } from '@/lib/types';
import { CourseCard } from './CourseCard';
import {
  Reveal, Stagger, StaggerItem, MagneticButton, TiltCard,
  AnimatedCounter, Parallax, CursorGlow, HoverLift,
} from './animations';

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

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

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
      <CursorGlow />

      {/* ═══════════════════════════════════════════════════
          HERO — Apple Cinematic Style
          Massive typography, parallax orbs, animated stats
          ═══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex items-center justify-center overflow-hidden hero-cinematic"
      >
        {/* Animated aurora orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="aurora-1 absolute top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full opacity-40 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(91, 129, 252, 0.6) 0%, transparent 70%)',
            }}
          />
          <div
            className="aurora-2 absolute top-1/3 right-1/4 w-[35rem] h-[35rem] rounded-full opacity-30 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, transparent 70%)',
            }}
          />
          <div
            className="aurora-3 absolute bottom-1/4 left-1/3 w-[45rem] h-[45rem] rounded-full opacity-25 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)',
            }}
          />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 py-20 text-center text-white"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-medium tracking-wide">Platform Resmi Fakultas Ekonomi UNITA</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-glow" />
          </motion.div>

          {/* Massive Headline (Apple-style) */}
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
          >
            Belajar tanpa batas.
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              Karir tanpa hambatan.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Akses kursus berkualitas dari dosen Fakultas Ekonomi Universitas Tulungagung.
            Gratis untuk semua. Sertifikat resmi.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <MagneticButton
              onClick={() => onOpenAuth('register')}
              className="bg-white text-navy-900 hover:bg-amber-50 hover:text-navy-900 text-base font-semibold h-14 px-8 rounded-full shadow-[0_24px_64px_-16px_rgba(255,255,255,0.4)] hover:shadow-[0_32px_80px_-16px_rgba(255,255,255,0.6)] transition-all inline-flex items-center gap-2"
              strength={0.4}
            >
              <Sparkles className="w-4 h-4" />
              Mulai Gratis Sekarang
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
            <MagneticButton
              onClick={() => {
                const el = document.getElementById('catalog');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/15 hover:text-white text-base font-medium h-14 px-7 rounded-full inline-flex items-center gap-2 transition-all"
              strength={0.3}
            >
              <BookOpen className="w-4 h-4" />
              Jelajahi Kursus
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5"
          >
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS BAR — Animated counters, Apple-style minimal
          ═══════════════════════════════════════════════════ */}
      <section className="relative -mt-20 z-20 bg-white rounded-t-[2.5rem] shadow-[0_-24px_64px_-24px_rgba(10,22,40,0.1)]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8" staggerDelay={0.1}>
            {[
              { icon: BookOpen, value: 7, suffix: '+', label: 'Kursus Tersedia', color: 'text-navy-700', bg: 'bg-navy-50' },
              { icon: Users, value: 2100, suffix: '+', label: 'Mahasiswa Aktif', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: Award, value: 100, suffix: '%', label: 'Gratis', color: 'text-amber-600', bg: 'bg-amber-50' },
              { icon: InfinityIcon, value: 24, suffix: '/7', label: 'Akses Materi', color: 'text-cyan-600', bg: 'bg-cyan-50' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <StaggerItem key={i}>
                  <HoverLift className="text-center group">
                    <div className={`w-12 h-12 mx-auto rounded-2xl ${stat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} className="gradient-text-navy" />
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </HoverLift>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED COURSE — Apple-style product showcase
          ═══════════════════════════════════════════════════ */}
      {featuredCourse && !search && category === 'all' && level === 'all' && (
        <section className="py-20 md:py-28 mesh-navy overflow-hidden">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 mb-4">
                <Crown className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold tracking-wide uppercase">Pilot Course</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                Kursus Unggulan
                <br />
                <span className="gradient-text-navy">pertama kami.</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Pengalaman belajar yang dirancang khusus untuk membekali Anda dengan skill wawancara kerja profesional.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <FeaturedCourseCard
                course={featuredCourse}
                onClick={() => onNavigate({ type: 'course', slug: featuredCourse.slug })}
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          CATALOG — Apple Store style grid
          ═══════════════════════════════════════════════════ */}
      <section id="catalog" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Jelajahi <span className="gradient-text-navy">kursus kami.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Temukan kursus yang sesuai dengan tujuan karir Anda. Filter berdasarkan kategori, level, atau popularitas.
            </p>
          </Reveal>

          {/* Filters bar — Apple-style pill bar */}
          <Reveal delay={0.1} className="mb-10">
            <div className="bg-white rounded-3xl border border-navy-100 shadow-premium p-2 flex flex-col md:flex-row gap-2 max-w-4xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari kursus..."
                  className="pl-11 h-11 bg-navy-50/50 border-0 rounded-2xl focus-visible:ring-2 focus-visible:ring-navy-700/20"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11 bg-navy-50/50 border-0 rounded-2xl px-4 flex-1">
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
                <SelectTrigger className="h-11 bg-navy-50/50 border-0 rounded-2xl px-4 flex-1">
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
                <SelectTrigger className="h-11 bg-navy-50/50 border-0 rounded-2xl px-4 flex-1">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Terpopuler</SelectItem>
                  <SelectItem value="newest">Terbaru</SelectItem>
                  <SelectItem value="rating">Rating Tertinggi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Reveal>

          {/* Category Pills */}
          <Reveal delay={0.15} className="mb-12">
            <div className="flex gap-2 overflow-x-auto pb-2 scroll-area justify-start md:justify-center">
              <button
                onClick={() => setCategory('all')}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  category === 'all'
                    ? 'bg-navy-900 text-white shadow-[0_8px_24px_-6px_rgba(30,58,138,0.4)]'
                    : 'bg-white border border-navy-100 text-foreground hover:bg-navy-50 hover:border-navy-200'
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
                    className={`flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      active
                        ? 'bg-navy-900 text-white shadow-[0_8px_24px_-6px_rgba(30,58,138,0.4)]'
                        : 'bg-white border border-navy-100 text-foreground hover:bg-navy-50 hover:border-navy-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {c.name}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Course Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-navy-200 border-t-navy-900 rounded-full"
              />
              <span className="ml-3 text-muted-foreground">Memuat kursus...</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-20 h-20 mx-auto rounded-full bg-navy-50 flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-navy-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tidak ada kursus ditemukan</h3>
              <p className="text-muted-foreground mb-6">Coba ubah filter atau kata kunci pencarian</p>
              <Button
                variant="outline"
                className="border-navy-200 text-navy-700 hover:bg-navy-50 rounded-full"
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
            <Stagger
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              staggerDelay={0.06}
            >
              {(search || category !== 'all' || level !== 'all' ? courses : otherCourses).map((c) => (
                <StaggerItem key={c.id}>
                  <CourseCard
                    course={c}
                    onClick={() => onNavigate({ type: 'course', slug: c.slug })}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRUST BADGES — Minimal, premium
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 bg-navy-50/50 border-y border-navy-100">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-8" staggerDelay={0.08}>
            {[
              { icon: Zap, title: 'Belajar Fleksibel', desc: 'Sesuai tempo Anda', color: 'text-navy-700', bg: 'bg-navy-100' },
              { icon: Award, title: 'Sertifikat Resmi', desc: 'Setelah lulus kuis', color: 'text-amber-600', bg: 'bg-amber-100' },
              { icon: Shield, title: 'Dosen Profesional', desc: 'Pengajar FE UNITA', color: 'text-cyan-600', bg: 'bg-cyan-100' },
              { icon: GraduationCap, title: '100% Gratis', desc: 'Untuk semua peserta', color: 'text-purple-600', bg: 'bg-purple-100' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={i}>
                  <HoverLift className="text-center">
                    <div className={`w-14 h-14 mx-auto rounded-2xl ${item.bg} flex items-center justify-center mb-4`}>
                      <Icon className={`w-7 h-7 ${item.color}`} />
                    </div>
                    <div className="font-semibold mb-1">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </HoverLift>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA — Apple-style cinematic closing
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden hero-cinematic">
        <div className="absolute inset-0">
          <div
            className="aurora-1 absolute top-1/3 left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] rounded-full opacity-30 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, transparent 70%)',
            }}
          />
        </div>

        <Parallax offset={30} className="relative z-10 container mx-auto max-w-4xl px-4 sm:px-6 text-center text-white">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-400/30 mb-6">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs font-medium tracking-wide text-amber-200">Sertifikat Resmi UNITA</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Tingkatkan karir Anda.
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                Mulai hari ini.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Bergabung dengan ribuan mahasiswa dan profesional yang telah mengembangkan skill ekonomi melalui UNITA Learn. Semua kursus gratis, dapat diakses seumur hidup.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!user ? (
                <MagneticButton
                  onClick={() => onOpenAuth('register')}
                  className="bg-amber-400 hover:bg-amber-300 text-navy-900 hover:text-navy-900 text-base font-semibold h-14 px-8 rounded-full shadow-[0_24px_64px_-16px_rgba(251,191,36,0.6)] hover:shadow-[0_32px_80px_-16px_rgba(251,191,36,0.8)] transition-all inline-flex items-center gap-2"
                  strength={0.4}
                >
                  <Sparkles className="w-4 h-4" />
                  Daftar Gratis Sekarang
                </MagneticButton>
              ) : (
                <MagneticButton
                  onClick={() => onNavigate({ type: 'dashboard' })}
                  className="bg-amber-400 hover:bg-amber-300 text-navy-900 hover:text-navy-900 text-base font-semibold h-14 px-8 rounded-full shadow-[0_24px_64px_-16px_rgba(251,191,36,0.6)] hover:shadow-[0_32px_80px_-16px_rgba(251,191,36,0.8)] transition-all inline-flex items-center gap-2"
                  strength={0.4}
                >
                  <GraduationCap className="w-4 h-4" />
                  Buka Dashboard Saya
                </MagneticButton>
              )}
              <MagneticButton
                onClick={() => onNavigate({ type: 'course', slug: 'interview-skills-for-beginners' })}
                className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/15 hover:text-white text-base font-medium h-14 px-7 rounded-full inline-flex items-center gap-2 transition-all"
                strength={0.3}
              >
                Coba Kursus Demo
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </Reveal>
        </Parallax>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Featured Course Card — Apple-style product showcase
// ═══════════════════════════════════════════════════
function FeaturedCourseCard({
  course,
  onClick,
}: {
  course: CourseListItem;
  onClick: () => void;
}) {
  return (
    <TiltCard maxTilt={5} scale={1.01} className="cursor-pointer">
      <Card
        className="overflow-hidden border-0 shadow-[0_48px_96px_-24px_rgba(10,22,40,0.25)] ring-1 ring-navy-900/5 rounded-3xl"
        onClick={onClick}
      >
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2">
            {/* Visual side */}
            <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden bg-navy-900">
              <img
                src={course.thumbnail || ''}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent lg:bg-gradient-to-r" />
              <div className="absolute top-5 left-5 flex gap-2">
                <Badge className="bg-amber-400 hover:bg-amber-500 text-navy-950 border-0 font-semibold rounded-full px-3 py-1.5 shadow-lg">
                  <Crown className="w-3 h-3 mr-1" /> Pilot Course
                </Badge>
              </div>
              {/* Play button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                  <Play className="w-8 h-8 text-navy-900 fill-navy-900 ml-1" />
                </div>
              </motion.div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-2xl font-bold leading-tight drop-shadow-2xl">{course.title}</div>
              </div>
            </div>

            {/* Content side */}
            <div className="p-8 lg:p-10 flex flex-col justify-center bg-white">
              <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                {course.shortDesc}
              </p>

              {/* Instructor */}
              <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-navy-50/50">
                <Avatar className="w-12 h-12 ring-2 ring-white shadow-md">
                  <AvatarImage src={course.instructor.avatar || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-navy-900 to-navy-700 text-white">
                    {course.instructor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm">{course.instructor.name}</div>
                  <div className="text-xs text-muted-foreground">{course.instructor.headline}</div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mx-auto mb-1" />
                  <div className="font-bold text-lg">{course.rating.toFixed(1)}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Rating</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-navy-50 border border-navy-100">
                  <Users className="w-4 h-4 text-navy-700 mx-auto mb-1" />
                  <div className="font-bold text-lg">{course.enrollCount}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Pelajar</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-cyan-50 border border-cyan-100">
                  <Clock className="w-4 h-4 text-cyan-700 mx-auto mb-1" />
                  <div className="font-bold text-lg">{course.totalDuration}m</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Durasi</div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Badge variant="secondary" className="bg-navy-50 text-navy-700 rounded-full">
                  {course.level === 'BEGINNER' ? 'Pemula' : course.level === 'INTERMEDIATE' ? 'Menengah' : 'Lanjut'}
                </Badge>
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 rounded-full">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Gratis
                </Badge>
                <Badge variant="secondary" className="bg-cyan-50 text-cyan-700 rounded-full">
                  {course.totalLessons} Pelajaran
                </Badge>
              </div>

              <MagneticButton
                onClick={onClick}
                className="bg-navy-900 hover:bg-navy-800 btn-navy-glow rounded-full h-12 px-6 font-semibold inline-flex items-center justify-center gap-2 text-white"
                strength={0.2}
              >
                <Play className="w-4 h-4" />
                Mulai Belajar
              </MagneticButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </TiltCard>
  );
}

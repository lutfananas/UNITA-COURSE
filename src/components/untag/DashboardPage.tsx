'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Loader2,
  BookOpen,
  Award,
  Play,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import type { Enrollment, Certificate, User, View } from '@/lib/types';
import { toast } from 'sonner';

interface DashboardPageProps {
  user: User | null;
  onNavigate: (view: View) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export function DashboardPage({ user, onNavigate, onOpenAuth }: DashboardPageProps) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('learning');

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const [enrRes, certRes] = await Promise.all([
        fetch('/api/enrollments'),
        fetch('/api/certificate'),
      ]);
      const enrData = await enrRes.json();
      const certData = await certRes.json();
      setEnrollments(enrData.enrollments || []);
      setCertificates(certData.certificates || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      onOpenAuth('login');
      return;
    }
    fetchData();
  }, [user, fetchData, onOpenAuth]);

  if (!user) {
    return null;
  }

  const inProgress = enrollments.filter((e) => e.progressPct < 100);
  const completed = enrollments.filter((e) => e.progressPct >= 100);

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-cyan-700 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-white/30">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback className="bg-white/20 text-white text-xl font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
              {user.headline && (
                <p className="text-white/80 text-sm mt-0.5">{user.headline}</p>
              )}
              <p className="text-white/60 text-xs mt-1">{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <Card className="bg-white/10 border-0 backdrop-blur text-white">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <div className="text-2xl font-bold">{enrollments.length}</div>
                <div className="text-xs text-white/70">Kursus Diambil</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-0 backdrop-blur text-white">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <div className="text-2xl font-bold">{inProgress.length}</div>
                <div className="text-xs text-white/70">Sedang Berjalan</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-0 backdrop-blur text-white">
              <CardContent className="p-4 text-center">
                <Award className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <div className="text-2xl font-bold">{certificates.length}</div>
                <div className="text-xs text-white/70">Sertifikat</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6 max-w-md">
                <TabsTrigger value="learning">
                  Sedang Berjalan ({inProgress.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Selesai ({completed.length})
                </TabsTrigger>
                <TabsTrigger value="certificates">
                  Sertifikat ({certificates.length})
                </TabsTrigger>
              </TabsList>

              {/* In Progress */}
              <TabsContent value="learning" className="space-y-4">
                {inProgress.length === 0 ? (
                  <EmptyState
                    icon={<BookOpen className="w-8 h-8" />}
                    title="Belum ada kursus yang sedang berjalan"
                    description="Mulai jelajahi katalog dan ambil kursus pertama Anda"
                    action={
                      <Button
                        className="bg-teal-600 hover:bg-teal-700"
                        onClick={() => onNavigate({ type: 'home' })}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Jelajahi Kursus
                      </Button>
                    }
                  />
                ) : (
                  inProgress.map((enr) => (
                    <Card key={enr.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-48 aspect-video sm:aspect-auto overflow-hidden bg-muted flex-shrink-0">
                            {enr.course.thumbnail ? (
                              <img
                                src={enr.course.thumbnail}
                                alt={enr.course.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
                                <BookOpen className="w-10 h-10 text-teal-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 p-5">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                {enr.course.category && (
                                  <div className="text-xs text-teal-600 font-medium mb-1">
                                    {enr.course.category.name}
                                  </div>
                                )}
                                <h3 className="font-bold text-base mb-1">{enr.course.title}</h3>
                                <div className="text-xs text-muted-foreground">
                                  oleh {enr.course.instructor.name}
                                </div>
                              </div>
                              <Badge variant="secondary" className="bg-teal-50 text-teal-700 flex-shrink-0">
                                {enr.progressPct}%
                              </Badge>
                            </div>
                            <div className="mb-3">
                              <Progress value={enr.progressPct} className="h-1.5" />
                              <div className="text-xs text-muted-foreground mt-1">
                                {enr.completedLessons} dari {enr.totalLessons} pelajaran selesai
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Terakhir diakses: {enr.lastAccessed
                                  ? new Date(enr.lastAccessed).toLocaleDateString('id-ID', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })
                                  : 'Baru saja'}
                              </div>
                              <Button
                                size="sm"
                                className="bg-teal-600 hover:bg-teal-700"
                                onClick={() => onNavigate({ type: 'learn', courseId: enr.courseId })}
                              >
                                <Play className="w-3.5 h-3.5 mr-1" />
                                Lanjutkan
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Completed */}
              <TabsContent value="completed" className="space-y-4">
                {completed.length === 0 ? (
                  <EmptyState
                    icon={<CheckCircle2 className="w-8 h-8" />}
                    title="Belum ada kursus yang selesai"
                    description="Selesaikan kursus yang sedang berjalan untuk melihatnya di sini"
                    action={
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab('learning')}
                      >
                        Lihat Kursus Aktif
                      </Button>
                    }
                  />
                ) : (
                  completed.map((enr) => (
                    <Card key={enr.id} className="overflow-hidden hover:shadow-md transition-shadow border-amber-200">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-48 aspect-video sm:aspect-auto overflow-hidden bg-muted flex-shrink-0 relative">
                            {enr.course.thumbnail && (
                              <img src={enr.course.thumbnail} alt={enr.course.title} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                                <Trophy className="w-3 h-3 mr-1" />
                                Selesai
                              </Badge>
                            </div>
                          </div>
                          <div className="flex-1 p-5">
                            <h3 className="font-bold text-base mb-1">{enr.course.title}</h3>
                            <div className="text-xs text-muted-foreground mb-3">
                              oleh {enr.course.instructor.name}
                            </div>
                            <div className="text-xs text-muted-foreground mb-3">
                              Selesai pada:{' '}
                              {enr.completedAt
                                ? new Date(enr.completedAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })
                                : '-'}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onNavigate({ type: 'learn', courseId: enr.courseId })}
                              >
                                <BookOpen className="w-3.5 h-3.5 mr-1" />
                                Tinjau Materi
                              </Button>
                              {enr.hasCertificate && (
                                <Button
                                  size="sm"
                                  className="bg-amber-600 hover:bg-amber-700"
                                  onClick={() => {
                                    const cert = certificates.find((c) => c.course.id === enr.courseId);
                                    if (cert) {
                                      onNavigate({ type: 'certificate', certificateId: cert.id });
                                    }
                                  }}
                                >
                                  <Award className="w-3.5 h-3.5 mr-1" />
                                  Lihat Sertifikat
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Certificates */}
              <TabsContent value="certificates" className="space-y-4">
                {certificates.length === 0 ? (
                  <EmptyState
                    icon={<Award className="w-8 h-8" />}
                    title="Belum memiliki sertifikat"
                    description="Selesaikan course dan lulus kuis untuk mendapatkan sertifikat resmi UNTAG"
                    action={
                      <Button
                        className="bg-teal-600 hover:bg-teal-700"
                        onClick={() => onNavigate({ type: 'home' })}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Mulai Belajar
                      </Button>
                    }
                  />
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {certificates.map((cert) => (
                      <Card key={cert.id} className="overflow-hidden border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                              <Award className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-sm leading-tight mb-1">
                                {cert.course.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {cert.course.instructor.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mb-3">
                            <div>No. Sertifikat: <span className="font-mono font-semibold text-foreground">{cert.certificateNo}</span></div>
                            <div>Diterbitkan: {new Date(cert.issuedAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}</div>
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-amber-600 hover:bg-amber-700"
                            onClick={() => onNavigate({ type: 'certificate', certificateId: cert.id })}
                          >
                            <Award className="w-3.5 h-3.5 mr-1" />
                            Lihat Sertifikat
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground">
          {icon}
        </div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Toaster as SonnerToaster } from 'sonner';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/untag/Header';
import { HomePage } from '@/components/untag/HomePage';
import { CourseDetailPage } from '@/components/untag/CourseDetailPage';
import { LearningPage } from '@/components/untag/LearningPage';
import { DashboardPage } from '@/components/untag/DashboardPage';
import { AuthModal } from '@/components/untag/AuthModal';
import { CertificatePage } from '@/components/untag/CertificatePage';
import { QuizPage } from '@/components/untag/QuizPage';
import { Footer } from '@/components/untag/Footer';
import type { User } from '@/lib/types';

type View =
  | { type: 'home' }
  | { type: 'course'; slug: string }
  | { type: 'learn'; courseId: string; lessonId?: string }
  | { type: 'dashboard' }
  | { type: 'certificate'; certificateId: string }
  | { type: 'quiz'; courseId: string };

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [view, setView] = useState<View>({ type: 'home' });
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Scroll to top on view change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [view]);

  // Load session on mount
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const navigate = (newView: View) => {
    setView(newView);
  };

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    toast.success('Anda telah keluar');
    navigate({ type: 'home' });
  };

  const requireAuth = (action: () => void) => {
    if (!user) {
      toast.info('Silakan login terlebih dahulu');
      openAuth('login');
      return;
    }
    action();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        user={user}
        userLoading={userLoading}
        onNavigate={navigate}
        onOpenAuth={openAuth}
        onLogout={handleLogout}
        currentView={view.type}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={JSON.stringify(view)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {view.type === 'home' && (
              <HomePage
                user={user}
                onNavigate={navigate}
                onOpenAuth={openAuth}
                requireAuth={requireAuth}
              />
            )}
            {view.type === 'course' && (
              <CourseDetailPage
                slug={view.slug}
                user={user}
                onNavigate={navigate}
                onOpenAuth={openAuth}
                requireAuth={requireAuth}
              />
            )}
            {view.type === 'learn' && (
              <LearningPage
                courseId={view.courseId}
                lessonId={view.lessonId}
                user={user}
                onNavigate={navigate}
                onOpenAuth={openAuth}
              />
            )}
            {view.type === 'dashboard' && (
              <DashboardPage
                user={user}
                onNavigate={navigate}
                onOpenAuth={openAuth}
              />
            )}
            {view.type === 'certificate' && (
              <CertificatePage
                certificateId={view.certificateId}
                user={user}
                onNavigate={navigate}
              />
            )}
            {view.type === 'quiz' && (
              <QuizPage
                courseId={view.courseId}
                user={user}
                onNavigate={navigate}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={navigate} />

      <AuthModal
        open={authOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setAuthOpen(false)}
        onSuccess={(u) => {
          setUser(u);
          setAuthOpen(false);
          toast.success(`Selamat datang, ${u.name}!`);
        }}
      />

      <SonnerToaster position="top-right" richColors />
    </div>
  );
}

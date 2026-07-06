'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Search,
  LayoutDashboard,
  Award,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import type { User, View } from '@/lib/types';

interface HeaderProps {
  user: User | null;
  userLoading: boolean;
  currentView: string;
  onNavigate: (view: View) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

export function Header({
  user,
  userLoading,
  currentView,
  onNavigate,
  onOpenAuth,
  onLogout,
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate({ type: 'home' });
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('unita:search', { detail: searchValue }));
    }, 50);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="signature-bar" />
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? 'glass-strong shadow-[0_8px_32px_rgba(10,22,40,0.06)]'
            : 'bg-white/40 backdrop-blur-md'
        }`}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 md:h-18 items-center justify-between gap-4">
            {/* Logo */}
            <motion.button
              onClick={() => onNavigate({ type: 'home' })}
              className="flex items-center gap-2.5 group relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-white flex items-center justify-center shadow-[0_8px_24px_-6px_rgba(30,58,138,0.5)] group-hover:shadow-[0_12px_32px_-6px_rgba(30,58,138,0.65)] transition-shadow ring-1 ring-navy-100">
                <img
                  src="/unita-logo.png"
                  alt="UNITA Learn Logo"
                  className="w-full h-full object-cover"
                />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 ring-2 ring-white"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-base leading-none tracking-tight">
                  <span className="text-navy-900">UNITA</span>{' '}
                  <span className="text-foreground/80">Learn</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1 leading-none font-medium tracking-wide">
                  Fakultas Ekonomi · Univ. Tulungagung
                </div>
              </div>
            </motion.button>

            {/* Search (desktop) — Apple-style pill */}
            <motion.form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md mx-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-focus-within:text-navy-700 transition-colors" />
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Cari kursus..."
                  className="pl-11 pr-4 h-11 bg-white/60 backdrop-blur-md border border-navy-100 rounded-full focus-visible:ring-2 focus-visible:ring-navy-700/20 focus-visible:bg-white focus-visible:border-navy-200 transition-all text-sm"
                />
              </div>
            </motion.form>

            {/* Right nav */}
            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                {!userLoading && user ? (
                  <motion.div
                    key="logged-in"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-2"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:flex items-center gap-2 hover:bg-navy-50 hover:text-navy-700 rounded-full px-4 h-10 transition-colors"
                      onClick={() => onNavigate({ type: 'dashboard' })}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="hidden lg:inline font-medium">Dashboard</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 rounded-full p-1 hover:bg-navy-50 transition-colors"
                        >
                          <Avatar className="w-9 h-9 ring-2 ring-navy-100 ring-offset-2 ring-offset-white">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-navy-900 to-navy-700 text-white text-sm font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </motion.button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-elevated border-navy-100">
                        <div className="px-3 py-2">
                          <div className="text-sm font-semibold truncate">{user.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                          {user.headline && (
                            <div className="text-xs text-muted-foreground mt-1 truncate">{user.headline}</div>
                          )}
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onNavigate({ type: 'dashboard' })}
                          className="hover:bg-navy-50 hover:text-navy-700 cursor-pointer rounded-lg px-3 py-2 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onNavigate({ type: 'dashboard' })}
                          className="hover:bg-navy-50 hover:text-navy-700 cursor-pointer rounded-lg px-3 py-2 transition-colors"
                        >
                          <Award className="w-4 h-4 mr-2" />
                          Sertifikat
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={onLogout}
                          className="text-red-600 hover:bg-red-50 cursor-pointer rounded-lg px-3 py-2 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Keluar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                ) : !userLoading ? (
                  <motion.div
                    key="logged-out"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-2"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onOpenAuth('login')}
                      className="hidden sm:flex hover:bg-navy-50 hover:text-navy-700 rounded-full px-4 h-10 transition-colors font-medium"
                    >
                      Masuk
                    </Button>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        size="sm"
                        onClick={() => onOpenAuth('register')}
                        className="bg-navy-900 hover:bg-navy-800 btn-navy-glow rounded-full px-5 h-10 font-medium"
                      >
                        <Sparkles className="w-4 h-4 mr-1.5" />
                        Daftar Gratis
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile search & menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden border-t border-navy-100"
            >
              <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-4 space-y-3">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Cari kursus..."
                      className="pl-10 h-11 rounded-full bg-muted/50"
                    />
                  </div>
                </form>
                {!user && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-navy-200 text-navy-700 hover:bg-navy-50 rounded-full h-11"
                      onClick={() => {
                        onOpenAuth('login');
                        setMobileOpen(false);
                      }}
                    >
                      Masuk
                    </Button>
                    <Button
                      className="flex-1 bg-navy-900 hover:bg-navy-800 rounded-full h-11"
                      onClick={() => {
                        onOpenAuth('register');
                        setMobileOpen(false);
                      }}
                    >
                      Daftar
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
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
  GraduationCap,
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate({ type: 'home' });
    // Dispatch event for HomePage to catch
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('untag:search', { detail: searchValue }));
    }, 50);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-white/85 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => onNavigate({ type: 'home' })}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-base leading-none">
                <span className="text-teal-600">UNTAG</span>{' '}
                <span className="text-foreground">Learn</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 leading-none">
                Fakultas Ekonomi UNTAG
              </div>
            </div>
          </button>

          {/* Search (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Cari kursus: interview, akuntansi, marketing..."
                className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </form>

          {/* Right nav */}
          <div className="flex items-center gap-2">
            {!userLoading && user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex items-center gap-2"
                  onClick={() => onNavigate({ type: 'dashboard' })}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full p-1 hover:bg-muted transition-colors">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback className="bg-teal-100 text-teal-700 text-sm font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <div className="text-sm font-semibold truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                      {user.headline && (
                        <div className="text-xs text-muted-foreground mt-0.5 truncate">{user.headline}</div>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate({ type: 'dashboard' })}>
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate({ type: 'dashboard' })}>
                      <Award className="w-4 h-4 mr-2" />
                      Sertifikat
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : !userLoading ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenAuth('login')}
                  className="hidden sm:flex"
                >
                  Masuk
                </Button>
                <Button
                  size="sm"
                  onClick={() => onOpenAuth('register')}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Daftar Gratis
                </Button>
              </>
            ) : null}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        {mobileOpen && (
          <div className="md:hidden pb-3 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Cari kursus..."
                  className="pl-10 bg-muted/50"
                />
              </div>
            </form>
            {!user && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileOpen(false);
                  }}
                >
                  Masuk
                </Button>
                <Button
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
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
        )}
      </div>
    </header>
  );
}

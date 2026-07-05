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
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('unita:search', { detail: searchValue }));
    }, 50);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 glass shadow-sm">
      {/* Signature top bar */}
      <div className="signature-bar" />
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => onNavigate({ type: 'home' })}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center shadow-navy group-hover:shadow-lg transition-all group-hover:scale-105">
              <GraduationCap className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 ring-2 ring-white" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-base leading-none tracking-tight">
                <span className="text-blue-900">UNITA</span>{' '}
                <span className="text-foreground">Learn</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 leading-none font-medium tracking-wide">
                Fakultas Ekonomi · Univ. Tulungagung
              </div>
            </div>
          </button>

          {/* Search (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-focus-within:text-blue-700 transition-colors" />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Cari kursus: interview, akuntansi, marketing..."
                className="pl-10 bg-muted/40 border-0 focus-visible:ring-2 focus-visible:ring-blue-900/20 focus-visible:bg-white transition-all"
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
                  className="hidden sm:flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => onNavigate({ type: 'dashboard' })}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full p-1 hover:bg-muted transition-colors">
                      <Avatar className="w-8 h-8 ring-2 ring-blue-100">
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-900 to-blue-700 text-white text-sm font-semibold">
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
                    <DropdownMenuItem onClick={() => onNavigate({ type: 'dashboard' })} className="hover:bg-blue-50 hover:text-blue-700 cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate({ type: 'dashboard' })} className="hover:bg-blue-50 hover:text-blue-700 cursor-pointer">
                      <Award className="w-4 h-4 mr-2" />
                      Sertifikat
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="text-red-600 hover:bg-red-50 cursor-pointer">
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
                  className="hidden sm:flex hover:bg-blue-50 hover:text-blue-700"
                >
                  Masuk
                </Button>
                <Button
                  size="sm"
                  onClick={() => onOpenAuth('register')}
                  className="bg-blue-900 hover:bg-blue-800 btn-glow"
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
                  className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileOpen(false);
                  }}
                >
                  Masuk
                </Button>
                <Button
                  className="flex-1 bg-blue-900 hover:bg-blue-800"
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

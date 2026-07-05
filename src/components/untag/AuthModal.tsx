'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { GraduationCap, Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@/lib/types';

interface AuthModalProps {
  open: boolean;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export function AuthModal({
  open,
  mode,
  onModeChange,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPwd, setLoginPwd] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPwd, setRegPwd] = useState('');
  const [regHeadline, setRegHeadline] = useState('');

  useEffect(() => {
    if (open) {
      setLoginEmail('');
      setLoginPwd('');
      setRegName('');
      setRegEmail('');
      setRegPwd('');
      setRegHeadline('');
      setShowPwd(false);
    }
  }, [open]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPwd }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Gagal masuk');
        return;
      }
      onSuccess(data.user);
    } catch {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPwd,
          headline: regHeadline,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Gagal daftar');
        return;
      }
      onSuccess(data.user);
    } catch {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setLoginEmail('mahasiswa@untag.ac.id');
    setLoginPwd('password123');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold leading-tight">
                <span className="text-teal-600">UNTAG</span> Learn
              </DialogTitle>
              <DialogDescription className="text-xs">
                Fakultas Ekonomi Universitas Tulungagung
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v) => onModeChange(v as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Masuk</TabsTrigger>
            <TabsTrigger value="register">Daftar</TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login" className="space-y-4 mt-4">
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-sm">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="email@untag.ac.id"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="login-pwd" className="text-sm">Password</Label>
                <div className="relative">
                  <Input
                    id="login-pwd"
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={loginPwd}
                    onChange={(e) => setLoginPwd(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Masuk
              </Button>
            </form>
            <button
              onClick={fillDemo}
              className="w-full text-xs text-muted-foreground hover:text-primary text-center"
            >
              💡 Klik untuk isi akun demo: mahasiswa@untag.ac.id
            </button>
          </TabsContent>

          {/* REGISTER */}
          <TabsContent value="register" className="space-y-4 mt-4">
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="reg-name" className="text-sm">Nama Lengkap</Label>
                <Input
                  id="reg-name"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Budi Santoso"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-email" className="text-sm">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="email@gmail.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-headline" className="text-sm">Status (opsional)</Label>
                <Input
                  id="reg-headline"
                  value={regHeadline}
                  onChange={(e) => setRegHeadline(e.target.value)}
                  placeholder="Mahasiswa / Fresh Graduate / Profesional"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-pwd" className="text-sm">Password (min. 6 karakter)</Label>
                <div className="relative">
                  <Input
                    id="reg-pwd"
                    type={showPwd ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={regPwd}
                    onChange={(e) => setRegPwd(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Daftar Sekarang
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center">
              Dengan mendaftar, Anda menyetujui Syarat & Ketentuan UNTAG Learn.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

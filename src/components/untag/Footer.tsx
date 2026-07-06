'use client';

import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import type { View } from '@/lib/types';

interface FooterProps {
  onNavigate: (view: View) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <button onClick={() => onNavigate({ type: 'home' })} className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white flex items-center justify-center ring-1 ring-navy-100">
                <img
                  src="/unita-logo.png"
                  alt="UNITA Learn Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-base leading-none">
                  <span className="text-blue-900">UNITA</span>{' '}
                  <span className="text-foreground">Learn</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  Fakultas Ekonomi UNITA
                </div>
              </div>
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Platform MOOC Fakultas Ekonomi Universitas Tulungagung. Belajar kapan saja, di mana saja, gratis.
            </p>
            <div className="flex gap-2 mt-4">
              <a href="#" className="w-8 h-8 rounded-full bg-muted hover:bg-blue-100 hover:text-blue-800 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-muted hover:bg-blue-100 hover:text-blue-800 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-muted hover:bg-blue-100 hover:text-blue-800 flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-muted hover:bg-blue-100 hover:text-blue-800 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Tautan */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button onClick={() => onNavigate({ type: 'home' })} className="hover:text-primary transition-colors">
                  Semua Kursus
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate({ type: 'dashboard' })} className="hover:text-primary transition-colors">
                  Dashboard Saya
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Tentang Kami</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a>
              </li>
            </ul>
          </div>

          {/* Kategori */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Kategori</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Manajemen</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Akuntansi</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Ekonomi Pembangunan</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Soft Skills</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Keuangan</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kewirausahaan</a></li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Kontak</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-900 flex-shrink-0" />
                <span>Jl. Mayor Sujadi No. 6, Tulungagung, Jawa Timur</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-blue-900 flex-shrink-0" />
                <span>learn.fe@untag-tulungagung.ac.id</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-blue-900 flex-shrink-0" />
                <span>(0355) 321432</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} UNITA Learn - Fakultas Ekonomi Universitas Tulungagung. Semua hak dilindungi.</p>
          <p>Dibuat dengan ❤️ untuk pendidikan Indonesia</p>
        </div>
      </div>
    </footer>
  );
}

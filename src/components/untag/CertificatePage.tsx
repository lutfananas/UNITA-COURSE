'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Award,
  ArrowLeft,
  Download,
  Shield,
} from 'lucide-react';
import type { User, View } from '@/lib/types';

interface CertificatePageProps {
  certificateId: string;
  user: User | null;
  onNavigate: (view: View) => void;
}

export function CertificatePage({ certificateId, user, onNavigate }: CertificatePageProps) {
  const [cert, setCert] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch('/api/certificate');
        const data = await res.json();
        const found = data.certificates?.find((c: any) => c.id === certificateId);
        if (found) {
          setCert(found);
        } else {
          onNavigate({ type: 'dashboard' });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [certificateId, user, onNavigate]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-blue-900" />
      </div>
    );
  }

  if (!cert) return null;

  return (
    <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 min-h-[calc(100vh-4rem)] py-10">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        <button
          onClick={() => onNavigate({ type: 'dashboard' })}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </button>

        {/* Certificate */}
        <Card className="border-4 border-amber-300 shadow-2xl overflow-hidden">
          {/* Top decorative bar */}
          <div className="h-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500" />

          <CardContent className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex items-center justify-center ring-1 ring-navy-100">
                  <img
                    src="/unita-logo.png"
                    alt="UNITA Learn Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg leading-none">
                    <span className="text-blue-900">UNITA</span>{' '}
                    <span className="text-foreground">Learn</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    Fakultas Ekonomi Universitas Tulungagung
                  </div>
                </div>
              </div>
            </div>

            <div className="border-y-2 border-amber-300 py-6 mb-6 text-center">
              <div className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-2">
                Sertifikat Resmi
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                Certificate of Completion
              </h1>
              <p className="text-sm text-muted-foreground">
                Diberikan kepada
              </p>
            </div>

            {/* Recipient */}
            <div className="text-center mb-8">
              <div className="text-2xl md:text-3xl font-bold text-blue-800 mb-1">
                {user.name}
              </div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              {user.headline && (
                <div className="text-xs text-muted-foreground mt-1">{user.headline}</div>
              )}
            </div>

            {/* Course */}
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground mb-2">atas penyelesaian kursus</p>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                {cert.course.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                Instruksi oleh {cert.course.instructor.name}
              </p>
              {cert.course.instructor.headline && (
                <p className="text-xs text-muted-foreground">{cert.course.instructor.headline}</p>
              )}
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">No. Sertifikat</div>
                <div className="font-mono font-semibold text-sm text-foreground">
                  {cert.certificateNo}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tanggal Terbit</div>
                <div className="font-semibold text-sm text-foreground">
                  {new Date(cert.issuedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</div>
                <Badge className="bg-blue-900 hover:bg-blue-800 text-white">
                  <Shield className="w-3 h-3 mr-1" />
                  Terverifikasi
                </Badge>
              </div>
            </div>

            {/* Verification notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2 text-xs text-blue-950">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">Sertifikat Terverifikasi UNITA Learn</div>
                  <div className="text-blue-800">
                    Sertifikat ini dapat diverifikasi keasliannya melalui platform UNITA Learn
                    dengan menggunakan nomor sertifikat: <span className="font-mono font-bold">{cert.certificateNo}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 mt-8">
              <div className="text-center">
                <div className="border-t border-foreground/40 pt-2">
                  <div className="font-semibold text-sm">{cert.course.instructor.name}</div>
                  <div className="text-xs text-muted-foreground">Instruktur Kursus</div>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-foreground/40 pt-2">
                  <div className="font-semibold text-sm">Dr. SAWAL SARTONO, M.M.</div>
                  <div className="text-xs text-muted-foreground">Dekan Fakultas Ekonomi</div>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Bottom decorative bar */}
          <div className="h-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500" />
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button
            variant="outline"
            className="border-blue-300 text-blue-800 hover:bg-blue-50"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4 mr-2" />
            Cetak / Save as PDF
          </Button>
          <Button
            className="bg-blue-900 hover:bg-blue-800"
            onClick={() => onNavigate({ type: 'dashboard' })}
          >
            <Award className="w-4 h-4 mr-2" />
            Semua Sertifikat
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          🎓 Terus tingkatkan kompetensi Anda dengan kursus lain di UNITA Learn
        </p>
      </div>
    </div>
  );
}

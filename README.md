# 🎓 UNITA Learn

Platform MOOC Fakultas Ekonomi Universitas Tulungagung. Belajar kapan saja, di mana saja. Kursus online berkualitas dari dosen FE UNITA. Gratis untuk semua.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)

## ✨ Fitur

- 🏠 **Homepage premium** dengan animasi Apple-style (framer-motion)
- 📚 **7 kursus ekonomi** (Manajemen, Akuntansi, Ekonomi, Soft Skills, Keuangan, Kewirausahaan)
- 🎓 **Pilot course**: Interview Skills for Beginners (4 modul, 11 pelajaran, 10 soal kuis)
- 📺 **Learning page** dengan video embed, progress tracking, lesson sidebar
- 🏆 **Quiz system** dengan auto-issue sertifikat
- 📜 **Sertifikat resmi** dengan nomor unik (bisa di-print/PDF)
- 👤 **Dashboard mahasiswa** (sedang berjalan, selesai, sertifikat)
- 🔐 **Auth** dengan session cookie (bcrypt + HTTP-only)
- ⭐ **Review system** dengan rating & komentar
- 📱 **Responsive** mobile-first design

## 🎨 Design System

- **Warna**: Navy biru dongker (#0a1628, #1e3a8a) + Gold accent (#fbbf24)
- **Typography**: Apple-inspired, tracking tight, weights bold
- **Animasi**: framer-motion v12 (magnetic buttons, 3D tilt cards, parallax, stagger reveals)
- **Glass morphism**: Header & modal dengan backdrop blur

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: Prisma ORM (SQLite untuk dev, bisa swap ke PostgreSQL/MySQL)
- **Auth**: Custom session-based (bcrypt + HTTP-only cookie)
- **Animation**: framer-motion v12
- **Icons**: lucide-react

## 📦 Instalasi Lokal

```bash
# Clone repo
git clone https://github.com/USERNAME/UNITA-COURSE.git
cd UNITA-COURSE

# Install dependencies
bun install

# Setup database
cp .env.example .env
bun run db:push

# Seed data (7 kursus + akun demo)
node scripts/seed.js

# Jalankan dev server
bun run dev
```

Buka `http://localhost:3000`

## 🔑 Akun Demo

- **Mahasiswa**: `mahasiswa@unita.ac.id` / `password123`
- **Admin**: `admin@unita.ac.id` / `admin123`

## 📁 Struktur Project

```
src/
├── app/
│   ├── api/              # API routes (auth, courses, enroll, progress, quiz, certificate, reviews)
│   ├── globals.css       # Theme + design system
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main app (view switching)
├── components/
│   └── untag/            # 9 komponen utama + animations.tsx
└── lib/
    ├── db.ts             # Prisma client
    ├── session.ts        # Session helper
    └── types.ts          # TypeScript types
prisma/
└── schema.prisma         # 8 model: User, Course, Module, Lesson, Enrollment, Progress, QuizAttempt, Certificate, Review, Category
scripts/
└── seed.js               # Seed 7 kursus + akun demo
```

## 🌐 Deployment

### Vercel (recommended untuk Next.js)
1. Push ke GitHub
2. Import repo di vercel.com
3. Set env var `DATABASE_URL`
4. Deploy

### Cloudflare Pages
- Perlu swap SQLite → Cloudflare D1 atau Turso
- Gunakan `@cloudflare/next-on-pages` adapter

### Railway / Render / Fly.io
- Support Prisma SQLite via persistent volume
- Setup lebih simpel

## 📝 License

MIT - Fakultas Ekonomi Universitas Tulungagung

---

Dibuat dengan ❤️ untuk pendidikan Indonesia

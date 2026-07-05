// Seed UNTAG Learn - MOOC Fakultas Ekonomi
// Pilot course: Interview Skills for Beginners + 5 course ekonomi lainnya

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const db = new PrismaClient();

async function main() {
  console.log('🌱 Seeding UNTAG Learn...');

  // ── 1. Instructors ──
  const pwdHash = await bcrypt.hash('password123', 10);
  const adminPwd = await bcrypt.hash('admin123', 10);

  const instructor1 = await db.user.upsert({
    where: { email: 'dosen.fe@untag.ac.id' },
    update: {},
    create: {
      email: 'dosen.fe@untag.ac.id',
      name: 'Dr. Siti Maimunah, M.M.',
      passwordHash: pwdHash,
      role: 'INSTRUCTOR',
      headline: 'Dosen Senior Manajemen FE UNTAG',
      bio: 'Pengajar Manajemen SDM & Pengembangan Karir dengan 15+ tahun pengalaman. Bersertifikat CHRP, CHT.',
      avatar: 'https://i.pravatar.cc/150?img=47',
    },
  });

  const instructor2 = await db.user.upsert({
    where: { email: 'andi.fe@untag.ac.id' },
    update: {},
    create: {
      email: 'andi.fe@untag.ac.id',
      name: 'Andi Pratama, M.Si.',
      passwordHash: pwdHash,
      role: 'INSTRUCTOR',
      headline: 'Lektor Akuntansi FE UNTAG',
      bio: 'Praktisi akuntansi keuangan & investasi. Mantan auditor Big 4.',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  });

  const instructor3 = await db.user.upsert({
    where: { email: 'rina.fe@untag.ac.id' },
    update: {},
    create: {
      email: 'rina.fe@untag.ac.id',
      name: 'Rina Wulandari, M.E.',
      passwordHash: pwdHash,
      role: 'INSTRUCTOR',
      headline: 'Dosen Ekonomi Pembangunan FE UNTAG',
      bio: 'Riset di bidang ekonomi digital & keuangan inklusif.',
      avatar: 'https://i.pravatar.cc/150?img=32',
    },
  });

  const student1 = await db.user.upsert({
    where: { email: 'mahasiswa@untag.ac.id' },
    update: {},
    create: {
      email: 'mahasiswa@untag.ac.id',
      name: 'Budi Santoso',
      passwordHash: pwdHash,
      role: 'STUDENT',
      headline: 'Mahasiswa S1 Manajemen 2022',
      avatar: 'https://i.pravatar.cc/150?img=15',
    },
  });

  const admin = await db.user.upsert({
    where: { email: 'admin@untag.ac.id' },
    update: {},
    create: {
      email: 'admin@untag.ac.id',
      name: 'Admin UNTAG Learn',
      passwordHash: adminPwd,
      role: 'ADMIN',
      headline: 'Administrator Platform',
    },
  });

  console.log('✅ Users seeded');

  // ── 2. Categories ──
  const categories = [
    { name: 'Manajemen', slug: 'manajemen', icon: 'Briefcase' },
    { name: 'Akuntansi', slug: 'akuntansi', icon: 'Calculator' },
    { name: 'Ekonomi Pembangunan', slug: 'ekonomi-pembangunan', icon: 'TrendingUp' },
    { name: 'Soft Skills', slug: 'soft-skills', icon: 'Users' },
    { name: 'Keuangan', slug: 'keuangan', icon: 'Wallet' },
    { name: 'Bisnis & Kewirausahaan', slug: 'kewirausahaan', icon: 'Rocket' },
  ];

  const catMap = {};
  for (const c of categories) {
    catMap[c.slug] = await db.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  console.log('✅ Categories seeded');

  // ── 3. PILOT COURSE: Interview Skills for Beginners ──
  const interviewCourse = await db.course.upsert({
    where: { slug: 'interview-skills-for-beginners' },
    update: {},
    create: {
      title: 'Interview Skills for Beginners',
      slug: 'interview-skills-for-beginners',
      shortDesc: 'Kuasai keterampilan wawancara kerja dari persiapan, presentasi diri, hingga follow-up. Cocok untuk fresh graduate & career shifter.',
      description: 'Mata kuliah/pelatihan ini dirancang untuk membekali mahasiswa Fakultas Ekonomi maupun publik umum dengan keterampilan praktis menghadapi wawancara kerja. Materi disusun bertahap mulai dari memahami psikologi pewawancara, menyusun jawaban STAR (Situation-Task-Action-Result), mengelola nervous, hingga etika follow-up pasca wawancara. Setelah menyelesaikan course ini, peserta diharapkan mampu tampil percaya diri di berbagai jenis wawancara: HR round, technical round, dan final interview.',
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      previewVideo: 'https://www.youtube.com/embed/_ZfWq1Bo9Ew',
      categoryId: catMap['soft-skills'].id,
      level: 'BEGINNER',
      language: 'id',
      durationMin: 180,
      price: 0,
      premium: false,
      rating: 4.8,
      reviewCount: 24,
      enrollCount: 312,
      whatYouLearn: 'Memahami siklus wawancara kerja & jenis-jenis wawancara modern\nMenyusun jawaban dengan metode STAR untuk pertanyaan behavioral\nMempersiapkan mental & mengelola gugup sebelum wawancara\nBerlatih menjawab pertanyaan umum: "ceritakan tentang diri Anda", kelebihan/kekurangan, dll\nMenguasai body language & komunikasi non-verbal yang positif\nMelakukan follow-up profesional & evaluasi diri pasca wawancara',
      requirements: 'Mahasiswa atau fresh graduate bidang apapun\nSiap untuk berlatih dengan latihan mandiri\nMemiliki akses internet untuk menonton video materi',
      tags: 'interview,karir,soft-skills,wawancara,hr,job',
      instructorId: instructor1.id,
    },
  });

  // Modules + Lessons for Interview Skills
  const m1 = await db.module.create({
    data: {
      courseId: interviewCourse.id,
      title: 'Modul 1: Pengantar Wawancara Kerja',
      description: 'Memahami esensi, jenis, dan siklus wawancara kerja modern.',
      order: 1,
      lessons: {
        create: [
          {
            title: '1.1 Apa itu Wawancara Kerja & Mengapa Penting',
            description: 'Pengantar tentang tujuan wawancara dari sudut pandang perusahaan dan kandidat.',
            contentMd: `# Apa itu Wawancara Kerja?

Wawancara kerja adalah percakangan formal antara kandidat dan perwakilan perusahaan (HR, hiring manager, atau user) untuk menilai kesesuaian kandidat dengan posisi yang dilamar.

## Mengapa Wawancara Penting?

Bagi perusahaan:
- Memvalidasi informasi di CV
- Menilai *culture fit* dan soft skills
- Mengevaluasi kemampuan komunikasi
- Mengukur motivasi & komitmen

Bagi kandidat:
- Membuktikan kompetensi secara langsung
- Menilai apakah perusahaan cocok
- Menegosiasikan ekspektasi

## Statistik Penting

> Survey terbaru menunjukkan 33% keputusan rekrutmen ditentukan dalam 90 detik pertama wawancara (Forbes, 2023).

## Tugas Mandiri
Refleksikan: kenapa Anda melamar posisi ini?`,
            videoUrl: 'https://www.youtube.com/embed/_ZfWq1Bo9Ew',
            durationMin: 12,
            order: 1,
            preview: true,
          },
          {
            title: '1.2 Jenis-Jenis Wawancara Modern',
            description: 'HR round, technical interview, panel interview, case interview, video interview.',
            contentMd: `# Jenis-Jenis Wawancara Modern

## 1. HR Round (Screening)
Fokus: kesesuaian CV, ekspektasi gaji, ketersediaan.

## 2. Technical / User Interview
Fokus: hard skills, portofolio, problem solving.

## 3. Panel Interview
Wawancara dengan 3-5 pewawancara sekaligus. Tantangan: harus menjawab untuk berbagai perspektif.

## 4. Case Interview
Diberi studi kasus bisnis untuk diselesaikan. Umum di konsultan & investment banking.

## 5. Video Interview
- Pre-recorded: jawab pertanyaan yang direkam
- Live via Zoom/Meet

## 6. Group Interview
Beberapa kandidat dinilai bersamaan via diskusi kelompok.`,
            videoUrl: 'https://www.youtube.com/embed/Y2RD7k0MoUs',
            durationMin: 14,
            order: 2,
            preview: true,
          },
          {
            title: '1.3 Siklus Wawancara: Sebelum, Saat, Setelah',
            description: 'Roadmap lengkap persiapan, pelaksanaan, dan follow-up wawancara.',
            contentMd: `# Siklus Wawancara Kerja

## Fase 1: Sebelum Wawancara (Persiapan)
- Riset perusahaan & posisi
- Latihan pertanyaan umum
- Siapkan outfit & dokumen
- Cek teknologi (jika online)

## Fase 2: Saat Wawancara
- Hadir 10-15 menit lebih awal
- Sapa resepsionis & pewawancara dengan sopan
- Dengar pertanyaan dengan saksama
- Jawab dengan struktur (STAR method)
- Ajukan pertanyaan balik di akhir

## Fase 3: Setelah Wawancara (Follow-up)
- Kirim thank-you email dalam 24 jam
- Refleksi & catat pelajaran
- Tunggu kabar, jangan terlalu agresif menagih

> Tip: Persiapan adalah 80% kunci sukses wawancara.`,
            videoUrl: 'https://www.youtube.com/embed/8jPQj8gUBhg',
            durationMin: 10,
            order: 3,
            preview: false,
          },
        ],
      },
    },
  });

  const m2 = await db.module.create({
    data: {
      courseId: interviewCourse.id,
      title: 'Modul 2: Menyusun Jawaban dengan Metode STAR',
      description: 'Teknik menjawab pertanyaan behavioral dengan struktur yang jelas.',
      order: 2,
      lessons: {
        create: [
          {
            title: '2.1 Apa itu Metode STAR?',
            description: 'Situation-Task-Action-Result: framework klasik untuk pertanyaan behavioral.',
            contentMd: `# Metode STAR

STAR adalah framework untuk menjawab pertanyaan behavioral interview dengan terstruktur.

## S - Situation
Jelaskan konteks/situasi (1-2 kalimat). Contoh: "Saat saya jadi ketua BEM tahun 2022..."

## T - Task
Apa yang harus Anda selesaikan? "Saya harus mengorganisir event dengan budget terbatas."

## A - Action
Langkah konkret yang Anda lakukan (bagian terpanjang). "Saya melakukan pendekatan X, Y, Z..."

## R - Result
Hasil terukur. "Event dihadiri 500 peserta, hemat budget 20%."

## Contoh Lengkap
> "Ceritakan pengalaman Anda menyelesaikan masalah tim."

**Situation:** Saat saya magang di startup X, tim developer mengalami konflik internal yang menunda peluncuran fitur.

**Task:** Sebagai project manager intern, saya diminta menengahi konflik.

**Action:** Saya mengadakan one-on-one meeting dengan setiap anggota tim, mendengarkan keluhan, lalu memfasilitasi meeting bersama untuk menyepakati pembagian tugas baru berdasarkan kekuatan masing-masing.

**Result:** Konflik selesai dalam 1 minggu, fitur rilis tepat waktu, dan saya diminta extend magang.`,
            videoUrl: 'https://www.youtube.com/embed/BLyyFfr5t2U',
            durationMin: 15,
            order: 1,
            preview: false,
          },
          {
            title: '2.2 Pertanyaan Umum & Cara Menjawabnya',
            description: '"Tell me about yourself", kelebihan/kekurangan, kenapa perusahaan ini.',
            contentMd: `# Pertanyaan Umum Wawancara

## 1. "Tell me about yourself" / "CERITAKAN TENTANG DIRI ANDA"
Struktur: Present-Past-Future
- Present: "Saya mahasiswa semester akhir Manajemen UNTAG..."
- Past: "Selama kuliah saya aktif di organisasi X, magang di Y..."
- Future: "Saya tertarik dengan posisi Z karena..."

## 2. "Apa kelebihan & kekurangan Anda?"
Kelebihan: pilih yang relevan dengan posisi, sertakan contoh konkret.
Kekurangan: pilih yang BUKAN red flag + tunjukkan upaya perbaikan.

❌ "Saya terlalu perfeksionis" (klise)
✅ "Saya kadang kesulitan delegasi tugas. Untuk memperbaikinya, saya mulai menggunakan Trello..."

## 3. "Kenapa Anda memilih perusahaan kami?"
Wajib riset terlebih dahulu: produk, value, project terbaru.

## 4. "Di mana Anda melihat diri Anda 5 tahun ke depan?"
Tunjukkan ambisi yang realistis & selaras dengan jenjang karir di perusahaan.

## 5. "Kenapa kami harus menerima Anda?"
Highlight 2-3 keunggulan + bagaimana itu memberi value.`,
            videoUrl: 'https://www.youtube.com/embed/k3I9MoUAOEM',
            durationMin: 18,
            order: 2,
            preview: false,
          },
          {
            title: '2.3 Menjawab Pertanyaan Sulit & Jebakan',
            description: 'Pertanyaan tentang gap CV, PHK, gaji ekspektasi, dll.',
            contentMd: `# Pertanyaan Sulit & Jebakan

## 1. "Kenapa Anda keluar dari pekerjaan sebelumnya?"
❌ Jangan badmouth mantan atasan/perusahaan.
✅ Fokus pada growth: "Saya mencari tantangan baru di bidang X yang lebih dalam."

## 2. "Apa ekspektasi gaji Anda?"
- Riset pasar terlebih dahulu (glassdoor, linkedin salary)
- Beri range, bukan angka pasti
- "Berdasarkan riset dan pengalaman saya, range X-Y sesuai. Tapi terbuka untuk diskusi."

## 3. "Kenapa ada gap di CV Anda?"
Jujur + positif. "Saya ambil waktu untuk [kuliah/merawat keluarga/belajar skill X]."

## 4. "Ceritakan kegagalan terbesar Anda."
Pilih kegagalan yang BUKAN red flag + pelajaran yang dipetik.

## 5. Pertanyaan case/logika
Jangan panik. Pikirkan keras, narrative proses berpikir Anda.`,
            videoUrl: 'https://www.youtube.com/embed/EB1v6TfPtKc',
            durationMin: 16,
            order: 3,
            preview: false,
          },
        ],
      },
    },
  });

  const m3 = await db.module.create({
    data: {
      courseId: interviewCourse.id,
      title: 'Modul 3: Body Language & Komunikasi Non-Verbal',
      description: 'Bahasa tubuh, contact mata, postur, dan vocal tone yang tepat.',
      order: 3,
      lessons: {
        create: [
          {
            title: '3.1 Bahasa Tubuh yang Positif',
            description: 'Postur, eye contact, handshake, dan gesture yang menunjukkan confidence.',
            contentMd: `# Bahasa Tubuh yang Positif

## Postur
- Duduk tegak tapi rileks
- Sed condong ke depan = tertarik
- Kaki tidak silang (tertutup)

## Eye Contact
- Pertahankan 60-70% dari waktu
- Tatap mata pewawancara saat menjawab
- Jangan staring, sesekali alihkan ke slide/CV

## Handshake (jika offline)
- Sambil berdiri
- Tegang cukup, tidak lembek/iwak
- Sambil tersenyum & eye contact

## Gesture Tangan
- Hindari menutupi mulut
- Tangan di meja, tidak di saku
- Hindari main rambut/jam tangan

## Ekspresi Wajah
- Senyum natural
- Hindari mengerutkan dahi
- Anggukan saat mendengarkan`,
            videoUrl: 'https://www.youtube.com/embed/VRJzvJ5XPQ4',
            durationMin: 13,
            order: 1,
            preview: false,
          },
          {
            title: '3.2 Vocal Tone & Pace',
            description: 'Cara berbicara yang jelas, percaya diri, dan terukur.',
            contentMd: `# Vocal Tone & Pace

## Volume
- Cukup keras terdengar, tidak berteriak
- Lebih keras 10% dari biasanya untuk energi

## Tempo
- 130-160 kata per menit ideal
- Jangan terlalu cepat (gugup) atau lambat (membosankan)
- Pause 1-2 detik sebelum jawaban sulit

## Intonasi
- Naik di akhir kalimat tanya
- Turun di akhir pernyataan
- Hindari monoton

## Pengisi Waktu
❌ "ehm", "anh", "gitu loh", "trus"
✅ Diam lebih baik daripada filler

## Latihan
Rekam diri sendiri menjawab, lalu evaluasi.`,
            videoUrl: 'https://www.youtube.com/embed/Lo5PQ5sY4TI',
            durationMin: 11,
            order: 2,
            preview: false,
          },
        ],
      },
    },
  });

  const m4 = await db.module.create({
    data: {
      courseId: interviewCourse.id,
      title: 'Modul 4: Persiapan Mental & Follow-Up',
      description: 'Mengelola gugup, menghadapi penolakan, dan follow-up profesional.',
      order: 4,
      lessons: {
        create: [
          {
            title: '4.1 Mengelola Gugup Sebelum Wawancara',
            description: 'Teknik breathing, visualisasi, dan mindset yang membantu.',
            contentMd: `# Mengelola Gugup

Gugup itu WAJAR. Bahkan senior eksekutif pun masih gugup. Yang penting: MANAGE.

## Teknik Breathing
4-7-8 technique: inhale 4 detik, tahan 7, exhale 8.

## Power Pose (Amy Cuddy)
Berdiri dengan postur "Wonder Woman" 2 menit sebelum wawancara → menurunkan kortisol, meningkatkan testosteron (rasa percaya diri).

## Visualisasi
Bayangkan sukses menjawab pertanyaan dengan baik.

## Reframing Mindset
- "Saya diundang karena saya layak."
- "Wawancara = percakapan dua arah, bukan interogasi."
- "Tidak ada yang sempurna, yang penting tulus."

## Persiapan Logistik
- Bawa 2 copy CV
- Pulpen & buku catatan kecil
- Air mineral
- Power bank (jika online)

## Tiba Lebih Awal
10-15 menit sebelum jadwal. Untuk online, login 5 menit lebih awal.`,
            videoUrl: 'https://www.youtube.com/embed/iBFNzP9WBhE',
            durationMin: 12,
            order: 1,
            preview: false,
          },
          {
            title: '4.2 Follow-Up & Thank You Email',
            description: 'Cara menulis email thank-you yang profesional dalam 24 jam.',
            contentMd: `# Follow-Up & Thank You Email

## Timing
Kirim dalam **24 jam** setelah wawancara.

## Struktur Email
1. **Subject:** Thank You - [Nama] - [Posisi]
2. **Salam:** Dear [Pewawancara / HR],
3. **Opening:** Terima kasih atas waktu untuk wawancara tadi.
4. **Highlight:** Sebut 1-2 poin spesifik dari percakapan yang menarik.
5. **Reiterasi minat:** Saya semakin yakin posisi X cocok karena...
6. **Call to action:** Saya menanti kabar baik. Jangan ragu menghubungi saya jika ada informasi tambahan yang dibutuhkan.
7. **Penutup:** Sincerely, [Nama] + kontak

## Template Contoh
> Subject: Thank You - Budi Santoso - Junior Marketing Executive
>
> Dear Ibu Rina,
>
> Terima kasih atas kesempatan untuk berdiskusi mengenai posisi Junior Marketing Executive hari ini. Saya sangat menikmati percakapan kita, terutama diskusi tentang rencana ekspansi digital marketing yang sedang Anda kembangkan.
>
> Semakin saya paham tentang visi PT XYZ, semakin yakin saya bahwa latar belakang saya di digital marketing bisa memberikan kontribusi nyata, terutama untuk kampanye Q1 2025 yang Anda sebutkan.
>
> Saya menanti kabar baik. Mohon hubungi saya di 0812-xxxx jika ada informasi tambahan yang dibutuhkan.
>
> Hormat saya,
> Budi Santoso

## Tips Tambahan
- Kirim ke setiap pewawancara (jika panel)
- Personalisasi, bukan template massal
- Singkat, maksimal 3 paragraf`,
            videoUrl: 'https://www.youtube.com/embed/EW1nph59ZpU',
            durationMin: 14,
            order: 2,
            preview: false,
          },
          {
            title: '4.3 Final Quiz: Uji Pemahaman Anda',
            description: 'Quiz terakhir untuk menguji pemahaman seluruh materi course.',
            contentMd: `# Final Quiz

Selamat! Anda telah menyelesaikan seluruh modul. Saatnya uji pemahaman Anda.

Klik tombol **"Mulai Quiz"** di bawah untuk memulai. Anda harus mendapatkan minimal skor 70 untuk lulus dan mendapatkan sertifikat.

## Format Quiz
- 10 soal pilihan ganda
- Mencakup: jenis wawancara, metode STAR, pertanyaan umum, body language, follow-up
- Durasi: 15 menit
- Bisa dicoba ulang jika belum lulus

Selamat mengerjakan!`,
            durationMin: 8,
            order: 3,
            preview: false,
          },
        ],
      },
    },
  });

  console.log('✅ Interview Skills course seeded with 4 modules & 10 lessons');

  // ── 4. Other Economy Courses ──
  const courses = [
    {
      title: 'Pengantar Akuntansi Keuangan',
      slug: 'pengantar-akuntansi-keuangan',
      shortDesc: 'Dasar akuntansi: siklus, jurnal, buku besar, neraca, dan laporan laba rugi.',
      description: 'Pelatihan dasar akuntansi keuangan untuk mahasiswa awal semester dan publik yang ingin memahami bahasa bisnis. Materi mencakup persamaan dasar akuntansi, siklus akuntansi, pencatatan transaksi, hingga penyusunan laporan keuangan dasar.',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['akuntansi'].id,
      level: 'BEGINNER',
      durationMin: 240,
      rating: 4.7,
      reviewCount: 18,
      enrollCount: 245,
      whatYouLearn: 'Memahami konsep dasar akuntansi & persamaan akuntansi\nMencatat transaksi ke jurnal umum\nMemposting ke buku besar & neraca saldo\nMenyusun laporan laba rugi & neraca',
      requirements: 'Pemahaman matematika dasar',
      tags: 'akuntansi,keuangan,akuntansi-dasar,jurnal',
      instructorId: instructor2.id,
      modules: [
        { title: 'M1: Pengantar Akuntansi', lessons: [
          { title: '1.1 Definisi & Tujuan Akuntansi', durationMin: 12, preview: true },
          { title: '1.2 Persamaan Dasar Akuntansi', durationMin: 14, preview: false },
          { title: '1.3 Akun & Klasifikasi', durationMin: 15, preview: false },
        ]},
        { title: 'M2: Siklus Akuntansi', lessons: [
          { title: '2.1 Jurnal Umum', durationMin: 18, preview: false },
          { title: '2.2 Buku Besar', durationMin: 16, preview: false },
          { title: '2.3 Neraca Saldo', durationMin: 14, preview: false },
        ]},
        { title: 'M3: Laporan Keuangan', lessons: [
          { title: '3.1 Laporan Laba Rugi', durationMin: 16, preview: false },
          { title: '3.2 Neraca', durationMin: 17, preview: false },
          { title: '3.3 Laporan Arus Kas', durationMin: 15, preview: false },
        ]},
      ],
    },
    {
      title: 'Manajemen Keuangan Pribadi untuk Mahasiswa',
      slug: 'manajemen-keuangan-pribadi-mahasiswa',
      shortDesc: 'Belajar budgeting, menabung, dan investasi pemula khusus untuk mahasiswa.',
      description: 'Pelatihan praktis mengelola keuangan pribadi dengan pendapatan terbatas (uang saku/magang). Cocok untuk mahasiswa yang ingin mulai membangun kebiasaan finansial sejak dini.',
      thumbnail: 'https://images.unsplash.com/photo-1579621970795-87facc2c976d?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['keuangan'].id,
      level: 'BEGINNER',
      durationMin: 150,
      rating: 4.9,
      reviewCount: 35,
      enrollCount: 412,
      whatYouLearn: 'Membuat budgeting bulanan dengan metode 50/30/20\nMembangun dana darurat\nMemahami instrumen investasi pemula (reksadana, saham)\nMenghindari jeratan utang konsumtif',
      requirements: 'Tidak ada',
      tags: 'keuangan,investasi,budgeting,mahasiswa',
      instructorId: instructor3.id,
      modules: [
        { title: 'M1: Mindset Keuangan', lessons: [
          { title: '1.1 Hubungan Anda dengan Uang', durationMin: 12, preview: true },
          { title: '1.2 Financial Goals', durationMin: 11, preview: false },
        ]},
        { title: 'M2: Budgeting', lessons: [
          { title: '2.1 Metode 50/30/20', durationMin: 14, preview: false },
          { title: '2.2 Tracking Pengeluaran', durationMin: 13, preview: false },
          { title: '2.3 Aplikasi Keuangan', durationMin: 10, preview: false },
        ]},
        { title: 'M3: Investasi Pemula', lessons: [
          { title: '3.1 Reksadana untuk Pemula', durationMin: 16, preview: false },
          { title: '3.2 Saham vs Obligasi', durationMin: 15, preview: false },
        ]},
      ],
    },
    {
      title: 'Digital Marketing 101 untuk UMKM',
      slug: 'digital-marketing-101-umkm',
      shortDesc: 'Strategi pemasaran digital praktis untuk pelaku UMKM dengan budget terbatas.',
      description: 'Pelatihan digital marketing untuk UMKM dengan budget minimal. Materi meliputi pembuatan konten Instagram, Facebook Ads pemula, SEO dasar, dan copywriting yang convert.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['manajemen'].id,
      level: 'BEGINNER',
      durationMin: 200,
      rating: 4.6,
      reviewCount: 22,
      enrollCount: 178,
      whatYouLearn: 'Membangun akun Instagram bisnis dari nol\nMembuat konten yang engagement tinggi\nMenjalankan Facebook/IG Ads dengan budget Rp 50rb\nCopywriting yang menghasilkan penjualan',
      requirements: 'Punya smartphone & internet',
      tags: 'digital-marketing,umkm,instagram,sosial-media',
      instructorId: instructor1.id,
      modules: [
        { title: 'M1: Fundamentals Digital Marketing', lessons: [
          { title: '1.1 Apa itu Digital Marketing?', durationMin: 11, preview: true },
          { title: '1.2 Customer Journey', durationMin: 13, preview: false },
        ]},
        { title: 'M2: Instagram Marketing', lessons: [
          { title: '2.1 Optimasi Profil Bisnis', durationMin: 12, preview: false },
          { title: '2.2 Konten Pillar', durationMin: 15, preview: false },
          { title: '2.3 Instagram Reels', durationMin: 14, preview: false },
        ]},
      ],
    },
    {
      title: 'Pengantar Ekonomi Makro',
      slug: 'pengantar-ekonomi-makro',
      shortDesc: 'Konsep GDP, inflasi, moneter, dan fiskal untuk memahami berita ekonomi.',
      description: 'Mata kuliah pengantar ekonomi makro yang membahas indikator makroekonomi utama, kebijakan moneter Bank Indonesia, dan kebijakan fiskal pemerintah.',
      thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['ekonomi-pembangunan'].id,
      level: 'INTERMEDIATE',
      durationMin: 280,
      rating: 4.5,
      reviewCount: 15,
      enrollCount: 132,
      whatYouLearn: 'Memahami konsep PDB, inflasi, dan pengangguran\nMenganalisis kebijakan moneter BI\nMemahami APBN & kebijakan fiskal\nMembaca indikator ekonomi di berita',
      requirements: 'Pemahaman matematika dasar',
      tags: 'ekonomi,makro,inflasi,gdp,moneter',
      instructorId: instructor3.id,
      modules: [
        { title: 'M1: Indikator Makro', lessons: [
          { title: '1.1 PDB & Pertumbuhan Ekonomi', durationMin: 16, preview: true },
          { title: '1.2 Inflasi & Cara Pengukuran', durationMin: 14, preview: false },
        ]},
        { title: 'M2: Kebijakan Moneter', lessons: [
          { title: '2.1 Bank Indonesia & BI Rate', durationMin: 17, preview: false },
          { title: '2.2 Instrumen Pasar Uang', durationMin: 15, preview: false },
        ]},
      ],
    },
    {
      title: 'Kewirausahaan: Dari Ide ke Bisnis',
      slug: 'kewirausahaan-dari-ide-ke-bisnis',
      shortDesc: 'Framework menyusun business model canvas & validasi ide bisnis pemula.',
      description: 'Pelatihan kewirausahaan praktis dengan framework Business Model Canvas, validasi ide, dan MVP development. Cocok untuk mahasiswa yang sedang menyiapkan startup atau bisnis kecil.',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['kewirausahaan'].id,
      level: 'INTERMEDIATE',
      durationMin: 220,
      rating: 4.7,
      reviewCount: 28,
      enrollCount: 287,
      whatYouLearn: 'Menyusun Business Model Canvas untuk ide bisnis Anda\nValidasi ide dengan customer interview\nMembangun MVP dengan budget minim\nPitching ke investor (template pitch deck)',
      requirements: 'Punya ide bisnis atau tertarik entrepreneurship',
      tags: 'startup,wirausaha,bmc,ide-bisnis',
      instructorId: instructor1.id,
      modules: [
        { title: 'M1: Ide & Validasi', lessons: [
          { title: '1.1 Sumber Ide Bisnis', durationMin: 12, preview: true },
          { title: '1.2 Customer Interview', durationMin: 15, preview: false },
        ]},
        { title: 'M2: Business Model Canvas', lessons: [
          { title: '2.1 9 Building Blocks BMC', durationMin: 18, preview: false },
          { title: '2.2 Studi Kasus UMKM', durationMin: 14, preview: false },
        ]},
      ],
    },
    {
      title: 'Microsoft Excel untuk Akuntansi',
      slug: 'microsoft-excel-untuk-akuntansi',
      shortDesc: 'Formula & pivot table Excel khusus untuk pekerjaan akuntansi sehari-hari.',
      description: 'Pelatihan Excel berorientasi praktik akuntansi: VLOOKUP, SUMIFS, pivot table untuk rekap transaksi, dan template laporan keuangan otomatis.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['akuntansi'].id,
      level: 'INTERMEDIATE',
      durationMin: 180,
      rating: 4.8,
      reviewCount: 41,
      enrollCount: 523,
      premium: false,
      whatYouLearn: 'VLOOKUP, HLOOKUP, INDEX-MATCH\nSUMIFS, COUNTIFS untuk laporan\nPivot Table untuk analisis data\nTemplate laporan keuangan otomatis',
      requirements: 'Pemahaman Excel dasar',
      tags: 'excel,akuntansi,formula,pivot-table',
      instructorId: instructor2.id,
      modules: [
        { title: 'M1: Formula Dasar', lessons: [
          { title: '1.1 VLOOKUP & HLOOKUP', durationMin: 16, preview: true },
          { title: '1.2 INDEX-MATCH', durationMin: 14, preview: false },
        ]},
        { title: 'M2: Analisis Data', lessons: [
          { title: '2.1 Pivot Table', durationMin: 18, preview: false },
          { title: '2.2 Conditional Formatting', durationMin: 12, preview: false },
        ]},
      ],
    },
  ];

  for (const c of courses) {
    const { modules, ...courseData } = c;
    const created = await db.course.create({
      data: {
        ...courseData,
        language: 'id',
        price: 0,
        premium: false,
      },
    });
    for (let i = 0; i < modules.length; i++) {
      const m = modules[i];
      await db.module.create({
        data: {
          courseId: created.id,
          title: m.title,
          order: i + 1,
          lessons: {
            create: m.lessons.map((l, j) => ({
              title: l.title,
              durationMin: l.durationMin,
              preview: l.preview,
              order: j + 1,
              contentMd: `# ${l.title}\n\nMateri ${l.title} - konten lengkap akan ditampilkan di sini.`,
            })),
          },
        },
      });
    }
  }
  console.log('✅ 6 economy courses seeded');

  // ── 5. Sample reviews ──
  const reviewData = [
    { userId: student1.id, courseId: interviewCourse.id, rating: 5, comment: 'Materinya sangat praktis! Saya langsung berhasil di wawancara pertama saya setelah ikut course ini.' },
    { userId: student1.id, courseId: 'pengantar-akuntansi-keuangan', rating: 4, comment: 'Penjelasan jelas, contoh kasus relevan.' },
  ];
  for (const r of reviewData) {
    const c = await db.course.findUnique({ where: { slug: r.courseId === interviewCourse.id ? 'interview-skills-for-beginners' : 'pengantar-akuntansi-keuangan' } });
    if (c) {
      await db.review.create({
        data: {
          userId: r.userId,
          courseId: c.id,
          rating: r.rating,
          comment: r.comment,
        },
      }).catch(() => {});
    }
  }
  console.log('✅ Reviews seeded');

  // ── 6. Sample enrollment ──
  await db.enrollment.create({
    data: {
      userId: student1.id,
      courseId: interviewCourse.id,
      progressPct: 35,
    },
  }).catch(() => {});
  console.log('✅ Sample enrollment seeded');

  console.log('\n🎉 Seed complete!');
  console.log('Login demo:');
  console.log('  Student  : mahasiswa@untag.ac.id / password123');
  console.log('  Instructor: dosen.fe@untag.ac.id / password123');
  console.log('  Admin    : admin@untag.ac.id / admin123');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => db.$disconnect());

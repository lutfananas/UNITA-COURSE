// Seed D1 database via Cloudflare API
// This script sends INSERT statements directly to D1
//
// Usage: 
//   export CF_KEY="your-global-api-key"
//   export CF_EMAIL="your-cloudflare-email"
//   export ACCOUNT_ID="your-account-id"
//   export D1_UUID="your-d1-database-uuid"
//   node scripts/seed-d1.js

const CF_KEY = process.env.CF_KEY;
const CF_EMAIL = process.env.CF_EMAIL;
const ACCOUNT_ID = process.env.ACCOUNT_ID;
const D1_UUID = process.env.D1_UUID;

if (!CF_KEY || !CF_EMAIL || !ACCOUNT_ID || !D1_UUID) {
  console.error('❌ Missing environment variables. Please set:');
  console.error('   CF_KEY, CF_EMAIL, ACCOUNT_ID, D1_UUID');
  console.error('');
  console.error('See README.md for instructions on how to get these values.');
  process.exit(1);
}

const bcrypt = require('bcryptjs');
const https = require('https');
const crypto = require('crypto');

function d1Query(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ sql });
    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/accounts/${ACCOUNT_ID}/d1/database/${D1_UUID}/raw`,
      method: 'POST',
      headers: {
        'X-Auth-Key': CF_KEY,
        'X-Auth-Email': CF_EMAIL,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}. Raw: ${data.slice(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// CUID generator
function cuid() {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(8).toString('hex').slice(0, 8);
  return `c${timestamp}${random}`;
}

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

async function main() {
  console.log('🌱 Seeding D1 database (unita-course-db)...');

  // Clean existing data
  console.log('Cleaning existing data...');
  await d1Query('DELETE FROM Certificate; DELETE FROM QuizAttempt; DELETE FROM Progress; DELETE FROM Enrollment; DELETE FROM Review; DELETE FROM Lesson; DELETE FROM Module; DELETE FROM Course; DELETE FROM Category; DELETE FROM User;');

  // ── 1. Users (Instructors + Student + Admin) ──
  const pwdHash = await bcrypt.hash('password123', 10);
  const adminPwd = await bcrypt.hash('admin123', 10);

  const users = [
    { id: cuid(), email: 'dosen.fe@unita.ac.id', name: 'GAUTAMA SASTRA WASKITA, S.E., B.BA., M.M.', passwordHash: pwdHash, role: 'INSTRUCTOR', headline: 'Dosen Senior Manajemen FE UNITA', bio: 'Pengajar Manajemen SDM & Pengembangan Karir dengan 15+ tahun pengalaman. Bersertifikat CHRP, CHT.', avatar: 'https://i.pravatar.cc/150?img=68' },
    { id: cuid(), email: 'andi.fe@unita.ac.id', name: 'Andi Pratama, M.Si.', passwordHash: pwdHash, role: 'INSTRUCTOR', headline: 'Lektor Akuntansi FE UNITA', bio: 'Praktisi akuntansi keuangan & investasi. Mantan auditor Big 4.', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: cuid(), email: 'rina.fe@unita.ac.id', name: 'Rina Wulandari, M.E.', passwordHash: pwdHash, role: 'INSTRUCTOR', headline: 'Dosen Ekonomi Pembangunan FE UNITA', bio: 'Riset di bidang ekonomi digital & keuangan inklusif.', avatar: 'https://i.pravatar.cc/150?img=32' },
    { id: cuid(), email: 'mahasiswa@unita.ac.id', name: 'Budi Santoso', passwordHash: pwdHash, role: 'STUDENT', headline: 'Mahasiswa S1 Manajemen 2022', bio: null, avatar: 'https://i.pravatar.cc/150?img=15' },
    { id: cuid(), email: 'admin@unita.ac.id', name: 'Admin UNITA Learn', passwordHash: adminPwd, role: 'ADMIN', headline: 'Administrator Platform', bio: null, avatar: null },
  ];

  for (const u of users) {
    await d1Query(`INSERT INTO User (id, email, name, passwordHash, role, avatar, bio, headline, createdAt, updatedAt) VALUES (${escapeSql(u.id)}, ${escapeSql(u.email)}, ${escapeSql(u.name)}, ${escapeSql(u.passwordHash)}, ${escapeSql(u.role)}, ${escapeSql(u.avatar)}, ${escapeSql(u.bio)}, ${escapeSql(u.headline)}, datetime('now'), datetime('now'));`);
  }
  console.log(`✅ ${users.length} users inserted`);

  // ── 2. Categories ──
  const categories = [
    { id: cuid(), name: 'Manajemen', slug: 'manajemen', icon: 'Briefcase' },
    { id: cuid(), name: 'Akuntansi', slug: 'akuntansi', icon: 'Calculator' },
    { id: cuid(), name: 'Ekonomi Pembangunan', slug: 'ekonomi-pembangunan', icon: 'TrendingUp' },
    { id: cuid(), name: 'Soft Skills', slug: 'soft-skills', icon: 'Users' },
    { id: cuid(), name: 'Keuangan', slug: 'keuangan', icon: 'Wallet' },
    { id: cuid(), name: 'Bisnis & Kewirausahaan', slug: 'kewirausahaan', icon: 'Rocket' },
  ];

  for (const c of categories) {
    await d1Query(`INSERT INTO Category (id, name, slug, icon) VALUES (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.slug)}, ${escapeSql(c.icon)});`);
  }
  console.log(`✅ ${categories.length} categories inserted`);

  // ── 3. Pilot Course: Interview Skills ──
  const instructor1Id = users[0].id;
  const softSkillsCatId = categories[3].id;

  const pilotCourseId = cuid();
  await d1Query(`INSERT INTO Course (id, title, slug, description, shortDesc, thumbnail, previewVideo, categoryId, level, language, durationMin, price, premium, rating, reviewCount, enrollCount, published, whatYouLearn, requirements, tags, createdAt, updatedAt, instructorId) VALUES (
    ${escapeSql(pilotCourseId)},
    'Interview Skills for Beginners',
    'interview-skills-for-beginners',
    'Mata kuliah/pelatihan ini dirancang untuk membekali mahasiswa Fakultas Ekonomi maupun publik umum dengan keterampilan praktis menghadapi wawancara kerja. Materi disusun bertahap mulai dari memahami psikologi pewawancara, menyusun jawaban STAR (Situation-Task-Action-Result), mengelola nervous, hingga etika follow-up pasca wawancara. Setelah menyelesaikan course ini, peserta diharapkan mampu tampil percaya diri di berbagai jenis wawancara: HR round, technical round, dan final interview.',
    'Kuasai keterampilan wawancara kerja dari persiapan, presentasi diri, hingga follow-up. Cocok untuk fresh graduate & career shifter.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    'https://www.youtube.com/embed/_ZfWq1Bo9Ew',
    ${escapeSql(softSkillsCatId)},
    'BEGINNER',
    'id',
    180,
    0,
    0,
    4.8,
    24,
    312,
    1,
    'Memahami siklus wawancara kerja & jenis-jenis wawancara modern\nMenyusun jawaban dengan metode STAR untuk pertanyaan behavioral\nMempersiapkan mental & mengelola gugup sebelum wawancara\nBerlatih menjawab pertanyaan umum\nMenguasai body language & komunikasi non-verbal yang positif\nMelakukan follow-up profesional & evaluasi diri pasca wawancara',
    'Mahasiswa atau fresh graduate bidang apapun\nSiap untuk berlatih dengan latihan mandiri\nMemiliki akses internet untuk menonton video materi',
    'interview,karir,soft-skills,wawancara,hr,job',
    datetime('now'),
    datetime('now'),
    ${escapeSql(instructor1Id)}
  );`);

  // ── Modules & Lessons for pilot course ──
  const modules = [
    {
      title: 'Modul 1: Pengantar Wawancara Kerja',
      order: 1,
      lessons: [
        { title: '1.1 Apa itu Wawancara Kerja & Mengapa Penting', durationMin: 12, preview: 1, videoUrl: 'https://www.youtube.com/embed/_ZfWq1Bo9Ew', contentMd: '# Apa itu Wawancara Kerja?\n\nWawancara kerja adalah percakangan formal antara kandidat dan perwakilan perusahaan untuk menilai kesesuaian kandidat dengan posisi yang dilamar.\n\n## Mengapa Wawancara Penting?\n\nBagi perusahaan: validasi CV, menilai culture fit, evaluasi kemampuan komunikasi.\n\n> Survey terbaru menunjukkan 33% keputusan rekrutmen ditentukan dalam 90 detik pertama wawancara (Forbes, 2023).' },
        { title: '1.2 Jenis-Jenis Wawancara Modern', durationMin: 14, preview: 1, videoUrl: 'https://www.youtube.com/embed/Y2RD7k0MoUs', contentMd: '# Jenis-Jenis Wawancara Modern\n\n1. HR Round (Screening)\n2. Technical / User Interview\n3. Panel Interview\n4. Case Interview\n5. Video Interview\n6. Group Interview' },
        { title: '1.3 Siklus Wawancara: Sebelum, Saat, Setelah', durationMin: 10, preview: 0, videoUrl: 'https://www.youtube.com/embed/8jPQj8gUBhg', contentMd: '# Siklus Wawancara Kerja\n\n## Fase 1: Sebelum Wawancara\n- Riset perusahaan & posisi\n- Latihan pertanyaan umum\n- Siapkan outfit & dokumen\n\n## Fase 2: Saat Wawancara\n- Hadir 10-15 menit lebih awal\n- Jawab dengan struktur (STAR method)\n\n## Fase 3: Setelah Wawancara\n- Kirim thank-you email dalam 24 jam' },
      ],
    },
    {
      title: 'Modul 2: Menyusun Jawaban dengan Metode STAR',
      order: 2,
      lessons: [
        { title: '2.1 Apa itu Metode STAR?', durationMin: 15, preview: 0, videoUrl: 'https://www.youtube.com/embed/BLyyFfr5t2U', contentMd: '# Metode STAR\n\nSTAR adalah framework untuk menjawab pertanyaan behavioral interview dengan terstruktur.\n\n- S: Situation\n- T: Task\n- A: Action\n- R: Result' },
        { title: '2.2 Pertanyaan Umum & Cara Menjawabnya', durationMin: 18, preview: 0, videoUrl: 'https://www.youtube.com/embed/k3I9MoUAOEM', contentMd: '# Pertanyaan Umum Wawancara\n\n1. "Tell me about yourself" - Present-Past-Future\n2. Kelebihan & kekurangan\n3. Kenapa perusahaan ini\n4. 5 tahun ke depan\n5. Kenapa kami harus menerima Anda' },
        { title: '2.3 Menjawab Pertanyaan Sulit & Jebakan', durationMin: 16, preview: 0, videoUrl: 'https://www.youtube.com/embed/EB1v6TfPtKc', contentMd: '# Pertanyaan Sulit & Jebakan\n\n1. Kenapa keluar dari pekerjaan sebelumnya?\n2. Ekspektasi gaji?\n3. Gap di CV?\n4. Kegagalan terbesar?' },
      ],
    },
    {
      title: 'Modul 3: Body Language & Komunikasi Non-Verbal',
      order: 3,
      lessons: [
        { title: '3.1 Bahasa Tubuh yang Positif', durationMin: 13, preview: 0, videoUrl: 'https://www.youtube.com/embed/VRJzvJ5XPQ4', contentMd: '# Bahasa Tubuh yang Positif\n\n- Postur: duduk tegak tapi rileks\n- Eye contact: 60-70% dari waktu\n- Handshake: tegang cukup\n- Gesture: hindari menutupi mulut' },
        { title: '3.2 Vocal Tone & Pace', durationMin: 11, preview: 0, videoUrl: 'https://www.youtube.com/embed/Lo5PQ5sY4TI', contentMd: '# Vocal Tone & Pace\n\n- Volume: cukup keras, tidak berteriak\n- Tempo: 130-160 kata per menit\n- Intonasi: naik untuk tanya, turun untuk pernyataan\n- Hindari filler: ehm, anh, gitu loh' },
      ],
    },
    {
      title: 'Modul 4: Persiapan Mental & Follow-Up',
      order: 4,
      lessons: [
        { title: '4.1 Mengelola Gugup Sebelum Wawancara', durationMin: 12, preview: 0, videoUrl: 'https://www.youtube.com/embed/iBFNzP9WBhE', contentMd: '# Mengelola Gugup\n\n- 4-7-8 breathing\n- Power pose (2 menit)\n- Visualisasi sukses\n- Reframing mindset' },
        { title: '4.2 Follow-Up & Thank You Email', durationMin: 14, preview: 0, videoUrl: 'https://www.youtube.com/embed/EW1nph59ZpU', contentMd: '# Follow-Up Email\n\nKirim dalam 24 jam setelah wawancara.\n\n## Struktur\n1. Subject: Thank You - [Nama] - [Posisi]\n2. Opening: terima kasih atas waktu\n3. Highlight: sebut 1-2 poin spesifik\n4. Reiterasi minat\n5. Call to action\n6. Penutup' },
        { title: '4.3 Final Quiz: Uji Pemahaman Anda', durationMin: 8, preview: 0, videoUrl: null, contentMd: '# Final Quiz\n\nKlik tombol "Mulai Quiz" untuk memulai. Minimal skor 70 untuk lulus dan mendapatkan sertifikat.' },
      ],
    },
  ];

  for (const m of modules) {
    const moduleId = cuid();
    await d1Query(`INSERT INTO Module (id, courseId, title, description, "order") VALUES (${escapeSql(moduleId)}, ${escapeSql(pilotCourseId)}, ${escapeSql(m.title)}, NULL, ${m.order});`);
    for (let i = 0; i < m.lessons.length; i++) {
      const l = m.lessons[i];
      await d1Query(`INSERT INTO Lesson (id, moduleId, title, description, contentMd, videoUrl, durationMin, "order", preview) VALUES (
        ${escapeSql(cuid())},
        ${escapeSql(moduleId)},
        ${escapeSql(l.title)},
        NULL,
        ${escapeSql(l.contentMd)},
        ${escapeSql(l.videoUrl)},
        ${l.durationMin},
        ${i + 1},
        ${l.preview ? 1 : 0}
      );`);
    }
  }
  console.log(`✅ Pilot course with ${modules.length} modules inserted`);

  // ── 4. Other Economy Courses ──
  const otherCourses = [
    {
      title: 'Pengantar Akuntansi Keuangan', slug: 'pengantar-akuntansi-keuangan', level: 'BEGINNER', durationMin: 240, rating: 4.7, reviewCount: 18, enrollCount: 245,
      shortDesc: 'Dasar akuntansi: siklus, jurnal, buku besar, neraca, dan laporan laba rugi.',
      description: 'Pelatihan dasar akuntansi keuangan untuk mahasiswa awal semester dan publik yang ingin memahami bahasa bisnis.',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
      categoryId: categories[1].id, instructorId: users[1].id,
      whatYouLearn: 'Memahami konsep dasar akuntansi\nMencatat transaksi ke jurnal umum\nMemposting ke buku besar & neraca saldo\nMenyusun laporan laba rugi & neraca',
      requirements: 'Pemahaman matematika dasar', tags: 'akuntansi,keuangan,dasar',
      modules: [
        { title: 'M1: Pengantar Akuntansi', lessons: [{title:'1.1 Definisi & Tujuan Akuntansi',durationMin:12,preview:1},{title:'1.2 Persamaan Dasar Akuntansi',durationMin:14,preview:0},{title:'1.3 Akun & Klasifikasi',durationMin:15,preview:0}]},
        { title: 'M2: Siklus Akuntansi', lessons: [{title:'2.1 Jurnal Umum',durationMin:18,preview:0},{title:'2.2 Buku Besar',durationMin:16,preview:0},{title:'2.3 Neraca Saldo',durationMin:14,preview:0}]},
        { title: 'M3: Laporan Keuangan', lessons: [{title:'3.1 Laporan Laba Rugi',durationMin:16,preview:0},{title:'3.2 Neraca',durationMin:17,preview:0},{title:'3.3 Laporan Arus Kas',durationMin:15,preview:0}]},
      ],
    },
    {
      title: 'Manajemen Keuangan Pribadi untuk Mahasiswa', slug: 'manajemen-keuangan-pribadi-mahasiswa', level: 'BEGINNER', durationMin: 150, rating: 4.9, reviewCount: 35, enrollCount: 412,
      shortDesc: 'Belajar budgeting, menabung, dan investasi pemula khusus untuk mahasiswa.',
      description: 'Pelatihan praktis mengelola keuangan pribadi dengan pendapatan terbatas.',
      thumbnail: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=800&q=80',
      categoryId: categories[4].id, instructorId: users[2].id,
      whatYouLearn: 'Membuat budgeting bulanan\nMembangun dana darurat\nMemahami instrumen investasi pemula\nMenghindari utang konsumtif',
      requirements: 'Tidak ada', tags: 'keuangan,investasi,budgeting',
      modules: [
        { title: 'M1: Mindset Keuangan', lessons: [{title:'1.1 Hubungan Anda dengan Uang',durationMin:12,preview:1},{title:'1.2 Financial Goals',durationMin:11,preview:0}]},
        { title: 'M2: Budgeting', lessons: [{title:'2.1 Metode 50/30/20',durationMin:14,preview:0},{title:'2.2 Tracking Pengeluaran',durationMin:13,preview:0}]},
        { title: 'M3: Investasi Pemula', lessons: [{title:'3.1 Reksadana untuk Pemula',durationMin:16,preview:0},{title:'3.2 Saham vs Obligasi',durationMin:15,preview:0}]},
      ],
    },
    {
      title: 'Digital Marketing 101 untuk UMKM', slug: 'digital-marketing-101-umkm', level: 'BEGINNER', durationMin: 200, rating: 4.6, reviewCount: 22, enrollCount: 178,
      shortDesc: 'Strategi pemasaran digital praktis untuk pelaku UMKM dengan budget terbatas.',
      description: 'Pelatihan digital marketing untuk UMKM dengan budget minimal.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      categoryId: categories[0].id, instructorId: users[0].id,
      whatYouLearn: 'Membangun akun Instagram bisnis\nMembuat konten engagement tinggi\nMenjalankan Facebook/IG Ads\nCopywriting yang menghasilkan penjualan',
      requirements: 'Punya smartphone & internet', tags: 'digital-marketing,umkm,instagram',
      modules: [
        { title: 'M1: Fundamentals Digital Marketing', lessons: [{title:'1.1 Apa itu Digital Marketing?',durationMin:11,preview:1},{title:'1.2 Customer Journey',durationMin:13,preview:0}]},
        { title: 'M2: Instagram Marketing', lessons: [{title:'2.1 Optimasi Profil Bisnis',durationMin:12,preview:0},{title:'2.2 Konten Pillar',durationMin:15,preview:0}]},
      ],
    },
    {
      title: 'Pengantar Ekonomi Makro', slug: 'pengantar-ekonomi-makro', level: 'INTERMEDIATE', durationMin: 280, rating: 4.5, reviewCount: 15, enrollCount: 132,
      shortDesc: 'Konsep GDP, inflasi, moneter, dan fiskal untuk memahami berita ekonomi.',
      description: 'Mata kuliah pengantar ekonomi makro yang membahas indikator makroekonomi utama.',
      thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
      categoryId: categories[2].id, instructorId: users[2].id,
      whatYouLearn: 'Memahami konsep PDB, inflasi, dan pengangguran\nMenganalisis kebijakan moneter BI\nMemahami APBN & kebijakan fiskal\nMembaca indikator ekonomi di berita',
      requirements: 'Pemahaman matematika dasar', tags: 'ekonomi,makro,inflasi,gdp',
      modules: [
        { title: 'M1: Indikator Makro', lessons: [{title:'1.1 PDB & Pertumbuhan Ekonomi',durationMin:16,preview:1},{title:'1.2 Inflasi & Cara Pengukuran',durationMin:14,preview:0}]},
        { title: 'M2: Kebijakan Moneter', lessons: [{title:'2.1 Bank Indonesia & BI Rate',durationMin:17,preview:0},{title:'2.2 Instrumen Pasar Uang',durationMin:15,preview:0}]},
      ],
    },
    {
      title: 'Kewirausahaan: Dari Ide ke Bisnis', slug: 'kewirausahaan-dari-ide-ke-bisnis', level: 'INTERMEDIATE', durationMin: 220, rating: 4.7, reviewCount: 28, enrollCount: 287,
      shortDesc: 'Framework menyusun business model canvas & validasi ide bisnis pemula.',
      description: 'Pelatihan kewirausahaan praktis dengan framework Business Model Canvas.',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
      categoryId: categories[5].id, instructorId: users[0].id,
      whatYouLearn: 'Menyusun Business Model Canvas\nValidasi ide dengan customer interview\nMembangun MVP dengan budget minim\nPitching ke investor',
      requirements: 'Punya ide bisnis atau tertarik entrepreneurship', tags: 'startup,wirausaha,bmc',
      modules: [
        { title: 'M1: Ide & Validasi', lessons: [{title:'1.1 Sumber Ide Bisnis',durationMin:12,preview:1},{title:'1.2 Customer Interview',durationMin:15,preview:0}]},
        { title: 'M2: Business Model Canvas', lessons: [{title:'2.1 9 Building Blocks BMC',durationMin:18,preview:0},{title:'2.2 Studi Kasus UMKM',durationMin:14,preview:0}]},
      ],
    },
    {
      title: 'Microsoft Excel untuk Akuntansi', slug: 'microsoft-excel-untuk-akuntansi', level: 'INTERMEDIATE', durationMin: 180, rating: 4.8, reviewCount: 41, enrollCount: 523,
      shortDesc: 'Formula & pivot table Excel khusus untuk pekerjaan akuntansi sehari-hari.',
      description: 'Pelatihan Excel berorientasi praktik akuntansi.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      categoryId: categories[1].id, instructorId: users[1].id,
      whatYouLearn: 'VLOOKUP, HLOOKUP, INDEX-MATCH\nSUMIFS, COUNTIFS untuk laporan\nPivot Table untuk analisis data\nTemplate laporan keuangan otomatis',
      requirements: 'Pemahaman Excel dasar', tags: 'excel,akuntansi,formula,pivot-table',
      modules: [
        { title: 'M1: Formula Dasar', lessons: [{title:'1.1 VLOOKUP & HLOOKUP',durationMin:16,preview:1},{title:'1.2 INDEX-MATCH',durationMin:14,preview:0}]},
        { title: 'M2: Analisis Data', lessons: [{title:'2.1 Pivot Table',durationMin:18,preview:0},{title:'2.2 Conditional Formatting',durationMin:12,preview:0}]},
      ],
    },
  ];

  for (const c of otherCourses) {
    const courseId = cuid();
    await d1Query(`INSERT INTO Course (id, title, slug, description, shortDesc, thumbnail, previewVideo, categoryId, level, language, durationMin, price, premium, rating, reviewCount, enrollCount, published, whatYouLearn, requirements, tags, createdAt, updatedAt, instructorId) VALUES (
      ${escapeSql(courseId)},
      ${escapeSql(c.title)},
      ${escapeSql(c.slug)},
      ${escapeSql(c.description)},
      ${escapeSql(c.shortDesc)},
      ${escapeSql(c.thumbnail)},
      NULL,
      ${escapeSql(c.categoryId)},
      ${escapeSql(c.level)},
      'id',
      ${c.durationMin},
      0,
      0,
      ${c.rating},
      ${c.reviewCount},
      ${c.enrollCount},
      1,
      ${escapeSql(c.whatYouLearn)},
      ${escapeSql(c.requirements)},
      ${escapeSql(c.tags)},
      datetime('now'),
      datetime('now'),
      ${escapeSql(c.instructorId)}
    );`);

    for (let mi = 0; mi < c.modules.length; mi++) {
      const m = c.modules[mi];
      const moduleId = cuid();
      await d1Query(`INSERT INTO Module (id, courseId, title, description, "order") VALUES (${escapeSql(moduleId)}, ${escapeSql(courseId)}, ${escapeSql(m.title)}, NULL, ${mi + 1});`);
      for (let li = 0; li < m.lessons.length; li++) {
        const l = m.lessons[li];
        await d1Query(`INSERT INTO Lesson (id, moduleId, title, description, contentMd, videoUrl, durationMin, "order", preview) VALUES (
          ${escapeSql(cuid())},
          ${escapeSql(moduleId)},
          ${escapeSql(l.title)},
          NULL,
          ${escapeSql('# ' + l.title + '\n\nMateri lengkap akan ditampilkan di sini.')},
          NULL,
          ${l.durationMin},
          ${li + 1},
          ${l.preview ? 1 : 0}
        );`);
      }
    }
  }
  console.log(`✅ ${otherCourses.length} economy courses inserted`);

  // ── 5. Sample review ──
  const reviewId = cuid();
  await d1Query(`INSERT INTO Review (id, userId, courseId, rating, comment, createdAt) VALUES (
    ${escapeSql(reviewId)},
    ${escapeSql(users[3].id)},
    ${escapeSql(pilotCourseId)},
    5,
    'Materinya sangat praktis! Saya langsung berhasil di wawancara pertama saya setelah ikut course ini.',
    datetime('now')
  );`);

  // Update course rating
  await d1Query(`UPDATE Course SET rating = 5.0, reviewCount = 1 WHERE id = ${escapeSql(pilotCourseId)};`);
  console.log('✅ Sample review inserted');

  // ── 6. Sample enrollment ──
  await d1Query(`INSERT INTO Enrollment (id, userId, courseId, enrolledAt, progressPct, lastAccessed) VALUES (
    ${escapeSql(cuid())},
    ${escapeSql(users[3].id)},
    ${escapeSql(pilotCourseId)},
    datetime('now'),
    0,
    datetime('now')
  );`);
  await d1Query(`UPDATE Course SET enrollCount = 313 WHERE id = ${escapeSql(pilotCourseId)};`);
  console.log('✅ Sample enrollment inserted');

  console.log('\n🎉 D1 seed complete!');
  console.log('Login demo:');
  console.log('  Student  : mahasiswa@unita.ac.id / password123');
  console.log('  Instructor: dosen.fe@unita.ac.id / password123');
  console.log('  Admin    : admin@unita.ac.id / admin123');
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});

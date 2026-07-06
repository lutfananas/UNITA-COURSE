---
Task ID: 1
Agent: main (Super Z)
Task: Membuat RPS Mata Kuliah Matematika Dasar (4 SKS) Prodi S1 Teknik Sipil Universitas Tulungagung berdasarkan file Excel CPL (data_cpl_2021.xlsx) dan PDF referensi (REFERENSI MATEMATIKA DASAR.pdf). Format Word (.docx), sangat detail, dengan kolom RPS sesuai spesifikasi user (9 kolom), pertemuan 8=UTS dan 16=UAS.

Work Log:
- Membaca file Excel CPL: 12 CPL (CPL 1-12) Prodi S1 Teknik Sipil UNTANG, kategori S/P/KU/KK.
- Membaca PDF referensi: RPS Matematika I Universitas Riau, 6 halaman, 14 pertemuan materi (sistem bilangan, fungsi, limit, turunan, integral, transendental, koordinat kutub).
- Load skill docx, baca routes/create.md, references/common-rules.md, design-system.md (R5 academic cover).
- Susun outline 11 section (cover, identitas, CPL, CPMK, pemetaan, jenis pertemuan, RPS detail 16 pertemuan, bobot, metode, pustaka, approval).
- Tulis script generator di /home/z/my-project/scripts/generate_rps_mtk.js (~700 baris).
- Generate docx, jalankan postcheck → 9/9 passed.
- Konversi ke PDF untuk verifikasi visual → ditemukan section RPS detail (section 3) tidak terender landscape.
- Root cause: docx-js menukar dimensi pgSz saat orient=landscape, menghasilkan XML `w:w=11906 w:h=16838 w:orient=landscape` (orientasi landscape tapi dimensi portrait).
- Tulis patch script /home/z/my-project/scripts/fix_landscape.js (pakai JSZip) untuk swap w:h sehingga menjadi w=16838, h=11906.
- Patch berhasil, regenerate PDF → halaman 7-15 sekarang landscape (842x595), halaman lain portrait.
- Final postcheck: 9/9 passed, 0 errors, 0 warnings.

Stage Summary:
- File deliverable: /home/z/my-project/download/RPS_Matematika_Dasar_S1_Teknik_Sipil_UNTAG.docx (31.6 KB)
- Total 19 halaman: 1 cover + 5 portrait (A-E) + 9 landscape (RPS detail 16 pertemuan) + 4 portrait (G-J).
- CPMK yang dibuat: 7 CPMK (CPMK-1 s/d CPMK-7) dengan 4 Sub-CPMK tiap CPMK, memetakan ke CPL 3, 4, 6, 11, 12.
- Bobot: 7x5% tugas/PR (35%) + 10% keaktifan + 25% UTS + 25% UAS + 5% tugas terstruktur = 100%. Termasuk skala nilai A-E.
- RPS detail 16 pertemuan dengan 9 kolom persis sesuai permintaan user, termasuk UTS di pertemuan 8 (jenis T) dan UAS di pertemuan 16 (jenis A).
- Mata kuliah 4 SKS (3 SKS teori luring + 1 SKS praktikum) sesuai jawaban user.
- Pustaka: 3 utama (Purcell, Larson, Buku Ajar Kalkulus 2014) + 6 pendukung (Anton, Stewart, Thomas, Sydsaeter, Leithold, Spivak).

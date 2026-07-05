// RPS Matematika Dasar - 4 SKS
// Prodi S1 Teknik Sipil, Fakultas Teknik, Universitas Tulungagung
// Format: docx, Landscape A4 untuk tabel RPS detail

const {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  AlignmentType, HeadingLevel, PageNumber, PageBreak,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  ShadingType, TableLayoutType, VerticalAlign,
  PageOrientation, NumberFormat, SectionType, HeightRule,
  LevelFormat, convertInchesToTwip, Break,
} = require("docx");
const fs = require("fs");

// ── PALETTE: Academic Black (R5 ACADEMIC) ──
const P = {
  primary: "#162032",
  body: "#1C2A3D",
  secondary: "#5B6B7D",
  accent: "#1F4E79",        // dark blue (sipil/teknik)
  surface: "#F2F4F6",
  surfaceAlt: "#FFFFFF",
  headerBg: "#1F4E79",      // table header dark blue
  headerText: "#FFFFFF",
  zebra: "#EEF3F8",
};

const c = (hex) => hex.replace("#", "");

// ── BORDER HELPERS ──
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = {
  top: NB, bottom: NB, left: NB, right: NB,
  insideHorizontal: NB, insideVertical: NB,
};
const SB = { style: BorderStyle.SINGLE, size: 4, color: "808080" };
const SBdark = { style: BorderStyle.SINGLE, size: 6, color: "1F4E79" };
const tableBorders = {
  top: SBdark, bottom: SBdark, left: SB, right: SB,
  insideHorizontal: SB, insideVertical: SB,
};

// ── FONTS ──
const FONT_BODY = { ascii: "Times New Roman", eastAsia: "SimSun" };
const FONT_HEAD = { ascii: "Times New Roman", eastAsia: "SimHei" };

// ── PARAGRAPH HELPERS ──
function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.JUSTIFIED,
    spacing: { line: 312, before: opts.before || 0, after: opts.after || 60 },
    indent: opts.noIndent ? undefined : { firstLine: 480 },
    children: [
      new TextRun({
        text,
        size: opts.size || 22,
        bold: opts.bold || false,
        color: opts.color || c(P.body),
        font: opts.head ? FONT_HEAD : FONT_BODY,
      }),
    ],
  });
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.LEFT,
    spacing: { before: 360, after: 180, line: 312 },
    children: [
      new TextRun({
        text,
        size: 28,
        bold: true,
        color: c(P.primary),
        font: FONT_HEAD,
      }),
    ],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120, line: 312 },
    children: [
      new TextRun({
        text,
        size: 24,
        bold: true,
        color: c(P.primary),
        font: FONT_HEAD,
      }),
    ],
  });
}

// ── CELL HELPERS ──
function cell(text, opts = {}) {
  // text: string or array of Paragraph
  let children;
  if (Array.isArray(text)) {
    children = text;
  } else {
    const lines = String(text || "").split("\n");
    children = lines.map((line, i) =>
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        spacing: { line: 276, before: i === 0 ? 0 : 40, after: 40 },
        children: [
          new TextRun({
            text: line,
            size: opts.size || 20,
            bold: opts.bold || false,
            color: opts.color || c(P.body),
            font: opts.head ? FONT_HEAD : FONT_BODY,
          }),
        ],
      })
    );
    if (children.length === 0) {
      children = [new Paragraph({ children: [new TextRun({ text: "", size: 20 })] })];
    }
  }
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    shading: opts.fill
      ? { type: ShadingType.CLEAR, fill: opts.fill, color: "auto" }
      : undefined,
    verticalAlign: opts.valign || VerticalAlign.TOP,
    margins: { top: 80, bottom: 80, left: 80, right: 80 },
    children: children,
  });
}

function headerCell(text, opts = {}) {
  return cell(text, {
    ...opts,
    fill: c(P.headerBg),
    color: c(P.headerText),
    bold: true,
    head: true,
    align: opts.align || AlignmentType.CENTER,
    valign: VerticalAlign.CENTER,
  });
}

// ── 1. COVER (R5-inspired Clean White Academic) ──
function buildCover() {
  const PAGE_H = 16838;
  const simMarginLR = 1701;
  const simMarginT = 1200;
  const contentW = 11906 - simMarginLR * 2;

  const titleText = "RENCANA PEMBELAJARAN SEMESTER (RPS)";
  const subtitle1 = "MATA KULIAH MATEMATIKA DASAR";
  const subtitle2 = "(4 SKS)";

  const metaEntries = [
    { label: "Program Studi", value: "S1 Teknik Sipil" },
    { label: "Fakultas", value: "Teknik" },
    { label: "Universitas", value: "Tulungagung" },
    { label: "Tahun Akademik", value: "2024 / 2025" },
    { label: "Semester", value: "I (Ganjil)" },
    { label: "Kode Mata Kuliah", value: "TS-1101" },
  ];

  const bottomBorder = { style: BorderStyle.SINGLE, size: 4, color: "000000" };

  // Build meta table
  const metaRows = metaEntries.map((entry) =>
    new TableRow({
      children: [
        new TableCell({
          width: { size: 40, type: WidthType.PERCENTAGE },
          borders: noBorders,
          margins: { top: 80, bottom: 80, left: 0, right: 0 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 60, after: 60, line: 400 },
              children: [
                new TextRun({
                  text: entry.label + " :",
                  size: 24,
                  font: FONT_BODY,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 60, type: WidthType.PERCENTAGE },
          borders: { top: NB, left: NB, right: NB, bottom: bottomBorder },
          margins: { top: 80, bottom: 80, left: 100, right: 0 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 60, after: 60, line: 400 },
              children: [
                new TextRun({
                  text: entry.value,
                  size: 24,
                  font: FONT_BODY,
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  const metaTable = new Table({
    width: { size: 70, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: metaRows,
  });

  const children = [];
  // top spacer
  children.push(new Paragraph({ spacing: { before: 2400 } }));

  // School name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200, line: 460 },
      children: [
        new TextRun({
          text: "UNIVERSITAS TULUNGAGUNG",
          size: 36,
          bold: true,
          characterSpacing: 30,
          font: FONT_HEAD,
          color: c(P.primary),
        }),
      ],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: "FAKULTAS TEKNIK - PROGRAM STUDI S1 TEKNIK SIPIL",
          size: 22,
          font: FONT_BODY,
          color: c(P.secondary),
        }),
      ],
    })
  );

  // decorative line (paragraph border)
  children.push(
    new Paragraph({
      spacing: { after: 600 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 12, color: c(P.accent), space: 1 },
      },
      children: [new TextRun({ text: "", size: 8 })],
    })
  );

  // Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240, line: 600 },
      children: [
        new TextRun({
          text: titleText,
          size: 56,
          bold: true,
          font: FONT_HEAD,
          color: c(P.primary),
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120, line: 500 },
      children: [
        new TextRun({
          text: subtitle1,
          size: 40,
          bold: true,
          font: FONT_HEAD,
          color: c(P.accent),
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: subtitle2,
          size: 28,
          font: FONT_BODY,
          color: c(P.secondary),
        }),
      ],
    })
  );

  // Meta info
  children.push(metaTable);

  // Bottom spacer
  children.push(new Paragraph({ spacing: { before: 1200 } }));

  // Footer
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 0 },
      children: [
        new TextRun({
          text: "Disusun oleh: Tim Dosen Pengampu Mata Kuliah Matematika Dasar",
          size: 22,
          italics: true,
          font: FONT_BODY,
          color: c(P.body),
        }),
      ],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100 },
      children: [
        new TextRun({
          text: "Tahun Akademik 2024/2025",
          size: 20,
          font: FONT_BODY,
          color: c(P.secondary),
        }),
      ],
    })
  );

  // 16838 outer wrapper
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      borders: allNoBorders,
      rows: [
        new TableRow({
          height: { value: PAGE_H, rule: "exact" },
          children: [
            new TableCell({
              shading: { type: ShadingType.CLEAR, fill: "FFFFFF", color: "auto" },
              borders: noBorders,
              verticalAlign: VerticalAlign.TOP,
              margins: { left: simMarginLR, right: simMarginLR },
              children: children,
            }),
          ],
        }),
      ],
    }),
  ];
}

// ── 2. IDENTITAS MATA KULIAH ──
function buildIdentitas() {
  const rows = [
    ["Nama Mata Kuliah", "Matematika Dasar"],
    ["Kode Mata Kuliah", "TS-1101"],
    ["Bobot SKS", "4 SKS (3 SKS Teori + 1 SKS Praktikum)"],
    ["Semester", "I (Ganjil)"],
    ["Program Studi", "S1 Teknik Sipil"],
    ["Fakultas", "Teknik"],
    ["Universitas", "Tulungagung"],
    ["Tahun Akademik", "2024 / 2025"],
    ["Klasifikasi MK", "Mata Kuliah Wajib Bidang Keahlian Dasar"],
    ["Prasyarat", "Tidak ada (lulus SMA/MA Program IPA)"],
    [
      "Dosen Pengampu",
      "1. 【Nama Dosen 1】, 【NIDN】\n2. 【Nama Dosen 2】, 【NIDN】",
    ],
  ];

  const tableRows = rows.map(
    (r) =>
      new TableRow({
        cantSplit: true,
        children: [
          cell(r[0], {
            width: 30,
            bold: true,
            fill: c(P.surface),
            valign: VerticalAlign.CENTER,
          }),
          cell(r[1], { width: 70, valign: VerticalAlign.CENTER }),
        ],
      })
  );

  const descPara = [
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 312, after: 120 },
      indent: { firstLine: 480 },
      children: [
        new TextRun({
          text:
            "Deskripsi Mata Kuliah: Mata kuliah Matematika Dasar merupakan mata kuliah wajib pada Program Studi S1 Teknik Sipil yang membekali mahasiswa dengan konsep-konsep dasar matematika sebagai fondasi untuk mata kuliah keteknikan sipil lanjutan. Mata kuliah ini membahas sistem bilangan riil, fungsi dan jenisnya, limit dan kekontinuan fungsi, konsep turunan beserta aplikasinya, integral serta teknik pengintegralan, fungsi transendental, aplikasi integral untuk menghitung luas, volume benda putar, panjang busur, momen inersia, titik pusat, serta fungsi pada koordinat kutub. ",
          size: 22,
          font: FONT_BODY,
          color: c(P.body),
        }),
        new TextRun({
          text:
            "Penekanan diberikan pada kemampuan menerapkan konsep matematika untuk menyelesaikan permasalahan rekayasa sipil seperti perhitungan momen lentur, luas penampang, volume beton, serta analisis laju perubahan. Pembelajaran dilaksanakan dalam bentuk kuliah interaktif, diskusi kelompok, latihan soal terstruktur, dan penugasan berbasis masalah (problem-based learning) dengan dukungan e-learning melalui LMS. Mata kuliah ini berkontribusi langsung pada pencapaian CPL-3 (menerapkan ilmu dasar matematika dan sains serta ilmu dasar keteknikan bidang Rekayasa Sipil), CPL-4 (menerapkan prinsip, peraturan, norma, standar pada bidang Rekayasa Sipil), CPL-6 (mengidentifikasi, merumuskan, menganalisis, menyelesaikan permasalahan Rekayasa Sipil), dan CPL-11 (berkomunikasi lisan/tulisan dengan baik).",
          size: 22,
          font: FONT_BODY,
          color: c(P.body),
        }),
      ],
    }),
  ];

  return [
    heading1("A. IDENTITAS MATA KULIAH"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      borders: tableBorders,
      rows: tableRows,
    }),
    new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "" })] }),
    heading2("Deskripsi Mata Kuliah"),
    ...descPara,
  ];
}

// ── 3. CPL YANG DIBEBANKAN ──
function buildCPL() {
  const cplData = [
    ["CPL 3", "Mampu menerapkan ilmu dasar matematika dan sains serta ilmu dasar keteknikan bidang Rekayasa Sipil", "Pengetahuan"],
    ["CPL 4", "Mampu menerapkan prinsip-prinsip, peraturan, norma, standar, pedoman, dan manual yang berlaku pada bidang Rekayasa Sipil", "Pengetahuan"],
    ["CPL 6", "Mampu mengidentifikasi, merumuskan, menganalisis, dan menyelesaikan permasalahan bidang Rekayasa Sipil", "Keterampilan Khusus"],
    ["CPL 11", "Mampu berkomunikasi secara lisan dan tulisan dengan baik dan benar", "Keterampilan Umum"],
    ["CPL 12", "Mampu bekerja sama dalam tim", "Keterampilan Umum"],
  ];

  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      headerCell("Kode CPL", { width: 12 }),
      headerCell("Deskripsi CPL", { width: 73 }),
      headerCell("Kategori", { width: 15 }),
    ],
  });

  const dataRows = cplData.map(
    (r, i) =>
      new TableRow({
        cantSplit: true,
        children: [
          cell(r[0], { width: 12, bold: true, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[1], { width: 73, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[2], { width: 15, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
        ],
      })
  );

  return [
    heading1("B. CAPAIAN PEMBELAJARAN LULUSAN (CPL) YANG DIBEBANKAN"),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 312, after: 200 },
      indent: { firstLine: 480 },
      children: [
        new TextRun({
          text:
            "Berdasarkan Capaian Pembelajaran Lulusan (CPL) Program Studi S1 Teknik Sipil Universitas Tulungagung tahun kurikulum 2021, mata kuliah Matematika Dasar berkontribusi pada pencapaian beberapa CPL sebagai berikut:",
          size: 22,
          font: FONT_BODY,
          color: c(P.body),
        }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      borders: tableBorders,
      rows: [headerRow, ...dataRows],
    }),
  ];
}

// ── 4. CPMK & SUB-CPMK ──
function buildCPMK() {
  const cpmkData = [
    {
      code: "CPMK-1",
      desc: "Mampu menjelaskan pembagian sistem bilangan riil, manipulasi persamaan dan pertidaksamaan, harga mutlak, serta menentukan daerah asal, hasil, dan jenis-jenis fungsi beserta grafiknya pada bidang Kartesius.",
      sub: [
        "Sub-CPMK-1.1: Mampu menjelaskan pembagian sistem bilangan riil (asli, bulat, rasional, irasional)",
        "Sub-CPMK-1.2: Mampu memanipulasi rumus dan menyelesaikan persamaan, pertidaksamaan, dan harga mutlak",
        "Sub-CPMK-1.3: Mampu menentukan daerah asal dan hasil suatu fungsi",
        "Sub-CPMK-1.4: Mampu menjelaskan jenis-jenis fungsi (aljabar, transendental, komposisi) dan menggambarkannya pada bidang Kartesius",
      ],
    },
    {
      code: "CPMK-2",
      desc: "Mampu menyebutkan teknik perhitungan limit dan menjelaskan syarat kekontinuan fungsi, baik pada titik hingga maupun di tak hingga.",
      sub: [
        "Sub-CPMK-2.1: Mampu menentukan definisi limit fungsi sederhana dan fungsi trigonometri",
        "Sub-CPMK-2.2: Mampu menentukan nilai limit fungsi di titik hingga (teknik aljabar, pemfaktoran, rasionalisasi)",
        "Sub-CPMK-2.3: Mampu menentukan nilai limit di tak hingga dan limit trigonometri",
        "Sub-CPMK-2.4: Mampu menentukan kekontinuan fungsi di suatu titik",
      ],
    },
    {
      code: "CPMK-3",
      desc: "Mampu menjelaskan konsep turunan suatu fungsi, menentukan rumus-rumus turunan, turunan orde tinggi, dan turunan fungsi implisit.",
      sub: [
        "Sub-CPMK-3.1: Mampu menentukan turunan suatu fungsi menggunakan konsep turunan (definisi limit)",
        "Sub-CPMK-3.2: Mampu menentukan turunan fungsi menggunakan rumus-rumus (aturan jumlah, kali, bagi, rantai)",
        "Sub-CPMK-3.3: Mampu menentukan turunan berorde tinggi (turunan ke-2, ke-3, dst.)",
        "Sub-CPMK-3.4: Mampu menentukan turunan fungsi implisit",
      ],
    },
    {
      code: "CPMK-4",
      desc: "Mampu menggunakan konsep turunan dalam menyelesaikan masalah maksimum dan minimum, laju-laju yang berkaitan, hukum harga rata-rata, dan aturan L'Hopital.",
      sub: [
        "Sub-CPMK-4.1: Mampu menjelaskan fungsi naik dan turun, kecekungan dan titik belok",
        "Sub-CPMK-4.2: Mampu menjelaskan simetris dan asimtot (tegak, mendatar, miring)",
        "Sub-CPMK-4.3: Mampu menentukan nilai maksimum dan minimum suatu fungsi",
        "Sub-CPMK-4.4: Mampu menerapkan aturan L'Hopital dan menyelesaikan masalah laju berkaitan",
      ],
    },
    {
      code: "CPMK-5",
      desc: "Mampu menjelaskan antiturunan (integral), notasi sigma, penjumlahan Riemann, teorema dasar kalkulus, dan menentukan integral suatu fungsi dengan berbagai teknik pengintegralan.",
      sub: [
        "Sub-CPMK-5.1: Mampu menjelaskan integral tak tentu, notasi sigma, dan penjumlahan Riemann",
        "Sub-CPMK-5.2: Mampu menentukan nilai integral tentu menggunakan teorema dasar kalkulus",
        "Sub-CPMK-5.3: Mampu menentukan integral suatu fungsi dengan teknik subtitusi",
        "Sub-CPMK-5.4: Mampu menentukan integral suatu fungsi dengan teknik parsial, parsial trigonometri, dan substitusi trigonometri",
      ],
    },
    {
      code: "CPMK-6",
      desc: "Mampu menggunakan integral tentu untuk menghitung luas di antara dua kurva, volume benda putar, panjang busur, luas permukaan benda putar, momen, dan titik pusat.",
      sub: [
        "Sub-CPMK-6.1: Mampu menentukan luas di antara dua kurva",
        "Sub-CPMK-6.2: Mampu menentukan volume benda putar (metode cakram, kulit, dan cincin) jika luasan diputar mengelilingi sumbu x atau y",
        "Sub-CPMK-6.3: Mampu menentukan panjang busur suatu kurva",
        "Sub-CPMK-6.4: Mampu menghitung luas permukaan benda putar, momen, dan titik pusat suatu luasan",
      ],
    },
    {
      code: "CPMK-7",
      desc: "Mampu membedakan fungsi aljabar dan fungsi transendental (eksponen, logaritma, trigonometri, hiperbolik) serta menerapkan turunan dan integralnya, termasuk dalam koordinat kutub.",
      sub: [
        "Sub-CPMK-7.1: Mampu menentukan turunan dan integral fungsi eksponen dan logaritma natural",
        "Sub-CPMK-7.2: Mampu menentukan turunan dan integral fungsi trigonometri dan inversnya",
        "Sub-CPMK-7.3: Mampu menjelaskan dan menggambar fungsi pada koordinat kutub",
        "Sub-CPMK-7.4: Mampu menghitung luas dan panjang busur pada koordinat kutub",
      ],
    },
  ];

  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      headerCell("Kode CPMK", { width: 12 }),
      headerCell("Deskripsi CPMK", { width: 38 }),
      headerCell("Sub-CPMK", { width: 50 }),
    ],
  });

  const dataRows = cpmkData.map(
    (cpmk, i) =>
      new TableRow({
        cantSplit: true,
        children: [
          cell(cpmk.code, {
            width: 12,
            bold: true,
            align: AlignmentType.CENTER,
            valign: VerticalAlign.CENTER,
            fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF",
          }),
          cell(cpmk.desc, {
            width: 38,
            valign: VerticalAlign.CENTER,
            fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF",
          }),
          cell(cpmk.sub.join("\n"), {
            width: 50,
            valign: VerticalAlign.TOP,
            fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF",
            size: 18,
          }),
        ],
      })
  );

  return [
    heading1("C. CAPAIAN PEMBELAJARAN MATA KULIAH (CPMK) & SUB-CPMK"),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 312, after: 200 },
      indent: { firstLine: 480 },
      children: [
        new TextRun({
          text:
            "Capaian Pembelajaran Mata Kuliah (CPMK) dirumuskan untuk mendukung pencapaian CPL yang telah ditetapkan. Tujuh CPMK dirumuskan sesuai dengan bahan kajian, dan setiap CPMK dijabarkan menjadi 3-4 Sub-CPMK sebagai indikator pencapaian yang lebih granular pada setiap pertemuan.",
          size: 22,
          font: FONT_BODY,
          color: c(P.body),
        }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      borders: tableBorders,
      rows: [headerRow, ...dataRows],
    }),
  ];
}

// ── 5. PEMETAAN CPMK-CPL ──
function buildPemetaan() {
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      headerCell("CPMK", { width: 16 }),
      headerCell("CPL 3", { width: 14 }),
      headerCell("CPL 4", { width: 14 }),
      headerCell("CPL 6", { width: 14 }),
      headerCell("CPL 11", { width: 14 }),
      headerCell("CPL 12", { width: 14 }),
      headerCell("Bobot", { width: 14 }),
    ],
  });

  const check = "✓";
  const mapping = [
    ["CPMK-1", true, false, false, false, false, "10%"],
    ["CPMK-2", true, false, false, false, false, "10%"],
    ["CPMK-3", true, true, false, false, false, "15%"],
    ["CPMK-4", true, false, true, true, false, "15%"],
    ["CPMK-5", true, true, false, false, false, "10%"],
    ["CPMK-6", true, false, true, true, true, "10%"],
    ["CPMK-7", true, false, true, false, false, "10%"],
    ["UTS", "", "", "", "", "", "10%"],
    ["UAS", "", "", "", "", "", "10%"],
  ];

  const dataRows = mapping.map(
    (r, i) =>
      new TableRow({
        cantSplit: true,
        children: [
          cell(r[0], { width: 16, bold: true, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[1] ? check : "", { width: 14, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[2] ? check : "", { width: 14, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[3] ? check : "", { width: 14, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[4] ? check : "", { width: 14, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[5] ? check : "", { width: 14, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[6], { width: 14, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER, bold: true, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
        ],
      })
  );

  return [
    heading1("D. PEMETAAN CPMK TERHADAP CPL"),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 312, after: 200 },
      indent: { firstLine: 480 },
      children: [
        new TextRun({
          text:
            "Pemetaan matriks berikut menunjukkan keterkaitan setiap CPMK dengan Capaian Pembelajaran Lulusan (CPL) Prodi S1 Teknik Sipil. Tanda ✓ menandakan bahwa CPMK tersebut berkontribusi langsung pada pencapaian CPL terkait.",
          size: 22,
          font: FONT_BODY,
          color: c(P.body),
        }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      borders: tableBorders,
      rows: [headerRow, ...dataRows],
    }),
  ];
}

// ── 6. DAFTAR JENIS PERTEMUAN ──
function buildJenisPertemuan() {
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      headerCell("ID Jenis Pertemuan", { width: 25 }),
      headerCell("Nama Jenis Pertemuan", { width: 40 }),
      headerCell("Keterangan", { width: 35 }),
    ],
  });

  const data = [
    ["A", "UAS", "Ujian Akhir Semester"],
    ["K", "Kuliah", "Perkuliahan tatap muka reguler"],
    ["P", "Praktikum", "Pertemuan praktikum di laboratorium"],
    ["T", "UTS", "Ujian Tengah Semester"],
  ];

  const dataRows = data.map(
    (r, i) =>
      new TableRow({
        cantSplit: true,
        children: [
          cell(r[0], { width: 25, bold: true, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[1], { width: 40, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[2], { width: 35, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
        ],
      })
  );

  return [
    heading1("E. DAFTAR JENIS PERTEMUAN"),
    new Table({
      width: { size: 80, type: WidthType.PERCENTAGE },
      alignment: AlignmentType.CENTER,
      layout: TableLayoutType.FIXED,
      borders: tableBorders,
      rows: [headerRow, ...dataRows],
    }),
  ];
}

// ── 7. RPS DETAIL 16 PERTEMUAN ──
function buildRPSDetail() {
  // 9 columns
  const headers = [
    "Pertemuan Ke-",
    "CPMK & Sub-CPMK",
    "ID Jenis Pertemuan",
    "Materi Pembelajaran (IND)",
    "Materi Pembelajaran (EN)",
    "Indikator Penilaian",
    "Bentuk & Kriteria Penilaian",
    "Metode Pembelajaran Luring",
    "Metode Pembelajaran Daring",
    "Bobot Penilaian (%)",
  ];

  const colWidths = [4, 9, 5, 11, 11, 13, 14, 13, 12, 8];

  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headers.map((h, i) => headerCell(h, { width: colWidths[i] })),
  });

  // Data pertemuan (1-16)
  // [pert, cpmk, jenis, matIND, matEN, indikator, bentuk, luring, daring, bobot]
  const rps = [
    {
      pert: "1",
      cpmk: "CPMK-1\n(Sub-CPMK-1.1, 1.2, 1.3, 1.4)",
      jenis: "K",
      matIND:
        "Kontrak perkuliahan, RP/RPS, Sistem Bilangan Riil (Pertidaksamaan, Harga Mutlak), Fungsi dan Jenisnya",
      matEN:
        "Course contract, syllabus/RPS, Real Number System (Inequalities, Absolute Value), Functions and Their Types",
      indikator:
        "- Mampu menjelaskan pembagian sistem bilangan riil\n- Mampu memanipulasi rumus dan menyelesaikan sistem pertidaksamaan dan harga mutlak\n- Mampu menentukan daerah asal dan hasil suatu fungsi\n- Mampu menjelaskan jenis-jenis fungsi serta menggambarkannya pada bidang Kartesius",
      bentuk:
        "- Keaktifan diskusi dalam kelas\n- Tugas terstruktur: latihan soal persamaan, pertidaksamaan, harga mutlak, dan fungsi\n- Kriteria: ketepatan jawaban ≥ 70 untuk B, ≥ 80 untuk A",
      luring:
        "1. Kuliah interaktif (pemaparan konsep)\n2. Diskusi kelas: TM 1mg (3 sks x 50 menit)\n3. Tugas terstruktur: latihan soal sistem bilangan riil, pertidaksamaan, harga mutlak, dan fungsi\n4. Praktikum: pengenalan software graphing (GeoGebra)",
      daring:
        "1. Pemaparan materi via Zoom\n2. E-Learning: video materi, modul, dan kuis di LMS\n3. Diskusi forum: pertanyaan & jawaban",
      bobot: "5",
    },
    {
      pert: "2",
      cpmk: "CPMK-2\n(Sub-CPMK-2.1, 2.2)",
      jenis: "K",
      matIND:
        "Limit dan Kekontinuan Fungsi: Definisi limit, limit fungsi sederhana dan trigonometri, limit di titik hingga",
      matEN:
        "Limits and Continuity of Functions: Definition of limit, limits of simple and trigonometric functions, limits at finite points",
      indikator:
        "- Mampu menentukan definisi limit fungsi sederhana dan fungsi trigonometri\n- Mampu menentukan nilai limit fungsi di titik hingga dengan teknik aljabar, pemfaktoran, dan rasionalisasi",
      bentuk:
        "- Keaktifan diskusi\n- Tugas terstruktur: latihan soal limit\n- Kriteria: ketepatan prosedur dan jawaban benar ≥ 70",
      luring:
        "1. Pembahasan PR pertemuan 1\n2. Kuliah interaktif materi limit\n3. Diskusi kelas: TM 1mg (3 sks x 50)\n4. Tugas: latihan limit fungsi aljabar & trigonometri\n5. Praktikum: visualisasi limit dengan GeoGebra",
      daring:
        "1. Diskusi via Zoom\n2. E-Learning: animasi limit, modul\n3. Quiz online di LMS",
      bobot: "5",
    },
    {
      pert: "3",
      cpmk: "CPMK-2\n(Sub-CPMK-2.3, 2.4)",
      jenis: "K",
      matIND:
        "Limit di Tak Hingga dan Kekontinuan Fungsi: Limit pada infinity, kekontinuan suatu fungsi di titik tertentu",
      matEN:
        "Limits at Infinity and Continuity: Limit at infinity, continuity of a function at a point",
      indikator:
        "- Mampu menentukan nilai limit di tak hingga (infinity)\n- Mampu menentukan kekontinuan fungsi di suatu titik",
      bentuk:
        "- Tugas terstruktur: review pertemuan berikutnya\n- Kriteria: pemahaman konsep kekontinuan benar",
      luring:
        "1. Pembahasan PR pertemuan 2\n2. Kuliah: limit di tak hingga & kekontinuan\n3. Diskusi: TM 1mg (3 sks x 50)\n4. Tugas: soal limit di tak hingga & kekontinuan\n5. Praktikum: simulasi grafik fungsi kontinu dan diskontinu",
      daring:
        "1. Diskusi via Zoom\n2. E-Learning: video & modul\n3. Forum diskusi tugas",
      bobot: "5",
    },
    {
      pert: "4",
      cpmk: "CPMK-3\n(Sub-CPMK-3.1, 3.2)",
      jenis: "K",
      matIND:
        "Konsep Turunan Fungsi dan Aplikasinya: Definisi turunan (limit), rumus-rumus turunan (jumlah, kali, bagi, rantai)",
      matEN:
        "Concept of Derivative and Its Applications: Definition of derivative (limit), derivative rules (sum, product, quotient, chain rule)",
      indikator:
        "- Mampu menentukan turunan suatu fungsi menggunakan konsep turunan (definisi limit)\n- Mampu menentukan turunan fungsi menggunakan rumus-rumus turunan",
      bentuk:
        "- Tugas rumah (Homework/PR) tentang turunan\n- Kriteria: ketepatan rumus dan hasil benar ≥ 70",
      luring:
        "1. Pembahasan PR pertemuan 3\n2. Kuliah: konsep & rumus turunan\n3. Diskusi: TM 1mg (3 sks x 50)\n4. Tugas: Homework turunan\n5. Praktikum: turunan numerik dengan software",
      daring:
        "1. Pemaparan via Zoom\n2. E-Learning: modul & video\n3. Pengumpulan tugas via LMS",
      bobot: "5",
    },
    {
      pert: "5",
      cpmk: "CPMK-3\n(Sub-CPMK-3.3, 3.4)",
      jenis: "K",
      matIND:
        "Turunan Orde Tinggi dan Fungsi Implisit: Turunan ke-2, ke-3, dst., turunan fungsi implisit",
      matEN:
        "Higher Order Derivatives and Implicit Functions: Second, third and higher order derivatives, derivatives of implicit functions",
      indikator:
        "- Mampu menentukan turunan berorde tinggi\n- Mampu menentukan turunan fungsi implisit",
      bentuk:
        "- Tugas terstruktur: latihan turunan orde tinggi & implisit\n- Kriteria: ketepatan prosedur ≥ 70",
      luring:
        "1. Pembahasan PR pertemuan 4\n2. Kuliah: turunan orde tinggi & implisit\n3. Diskusi: TM 1mg (3 sks x 50)\n4. Tugas: soal turunan implisit\n5. Praktikum: visualisasi turunan implisit",
      daring:
        "1. Diskusi via Zoom\n2. E-Learning: video & modul\n3. Forum diskusi",
      bobot: "5",
    },
    {
      pert: "6",
      cpmk: "CPMK-4\n(Sub-CPMK-4.1, 4.2, 4.3)",
      jenis: "K",
      matIND:
        "Aplikasi Turunan (Bagian 1): Fungsi naik dan turun, kecekungan dan titik belok, simetris dan asimtot, nilai maksimum dan minimum",
      matEN:
        "Applications of Derivatives (Part 1): Increasing and decreasing functions, concavity and inflection points, symmetry and asymptotes, maximum and minimum values",
      indikator:
        "- Mampu menjelaskan fungsi naik dan turun, kecekungan dan titik belok\n- Mampu menjelaskan simetris dan asimtot (tegak, mendatar, miring)\n- Mampu menentukan nilai maksimum dan minimum suatu fungsi",
      bentuk:
        "- Tugas terstruktur: analisis kurva lengkap\n- Kriteria: ketepatan analisis grafik ≥ 70",
      luring:
        "1. Pemaparan materi aplikasi turunan\n2. Tanya jawab & latihan di kelas\n3. Studi literatur (konstruksi pengetahuan)\n4. Tugas: sketsa kurva & analisis maks/min\n5. Praktikum: plotting kurva & ekstrim",
      daring:
        "1. Pemaparan via Zoom\n2. E-Learning: video & modul aplikasi turunan\n3. Diskusi forum",
      bobot: "5",
    },
    {
      pert: "7",
      cpmk: "CPMK-4\n(Sub-CPMK-4.4)",
      jenis: "K",
      matIND:
        "Aplikasi Turunan (Bagian 2): Aturan L'Hopital, laju-laju yang berkaitan (related rates), hukum harga rata-rata",
      matEN:
        "Applications of Derivatives (Part 2): L'Hopital's rule, related rates, mean value theorem",
      indikator:
        "- Mampu menerapkan aturan L'Hopital untuk limit bentuk tak tentu\n- Mampu menyelesaikan masalah laju berkaitan\n- Mampu menjelaskan hukum harga rata-rata",
      bentuk:
        "- Tugas terstruktur: review materi UTS\n- Kriteria: pemahaman konsep aplikasi turunan ≥ 70",
      luring:
        "1. Pemaparan materi L'Hopital & laju berkaitan\n2. Tanya jawab & latihan\n3. Tugas: review materi untuk UTS\n4. Praktikum: studi kasus laju perubahan kecepatan kendaraan",
      daring:
        "1. Pemaparan via Zoom\n2. E-Learning: modul & video L'Hopital\n3. Quiz online untuk persiapan UTS",
      bobot: "5",
    },
    {
      pert: "8",
      cpmk: "CPMK-1 s/d CPMK-4",
      jenis: "T",
      matIND:
        "UJIAN TENGAH SEMESTER (UTS): Mencakup materi pertemuan 1-7 (sistem bilangan, fungsi, limit, kekontinuan, turunan & aplikasinya)",
      matEN:
        "MID-TERM EXAM (UTS): Covers materials from meetings 1-7 (number system, functions, limits, continuity, derivatives and applications)",
      indikator:
        "- Penguasaan konsep sistem bilangan riil, fungsi, dan limit\n- Penguasaan konsep turunan dan aplikasinya\n- Ketepatan dalam menyelesaikan soal hitungan",
      bentuk:
        "- UTS tertulis (soal uraian & beberapa pilihan ganda)\n- Durasi 100 menit\n- Kriteria penilaian: skal 0-100, konversi ke huruf A-E",
      luring:
        "Pelaksanaan UTS tatap muka di ruang kelas sesuai jadwal (proktor dosen pengampu)",
      daring:
        "Apabila dared: UTS online via LMS dengan proctoring (jika diperlukan)",
      bobot: "10",
    },
    {
      pert: "9",
      cpmk: "CPMK-5\n(Sub-CPMK-5.1, 5.2)",
      jenis: "K",
      matIND:
        "Integral dan Teknik Pengintegralan: Antiturunan (integral tak tentu), notasi sigma, penjumlahan Riemann, integral tentu, teorema dasar kalkulus",
      matEN:
        "Integrals and Integration Techniques: Antiderivatives (indefinite integral), sigma notation, Riemann sums, definite integral, fundamental theorem of calculus",
      indikator:
        "- Mampu menjelaskan integral tak tentu, notasi sigma, dan penjumlahan Riemann\n- Mampu menentukan nilai integral tentu menggunakan teorema dasar kalkulus",
      bentuk:
        "- Tugas terstruktur: review pertemuan berikutnya\n- Kriteria: pemahaman konsep integral tentu benar",
      luring:
        "1. Pemaparan materi integral & teorema dasar kalkulus\n2. Tanya jawab & latihan kelas\n3. Tugas: latihan soal integral tentu\n4. Praktikum: visualisasi integral sebagai luas daerah",
      daring:
        "1. Pemaparan via Zoom\n2. E-Learning: animasi Riemann sum, modul\n3. Diskusi forum",
      bobot: "5",
    },
    {
      pert: "10",
      cpmk: "CPMK-5\n(Sub-CPMK-5.3)",
      jenis: "K",
      matIND:
        "Teknik Pengintegralan: Substitusi (substitusi sederhana dan substitusi trigonometri)",
      matEN:
        "Integration Techniques: Substitution (simple substitution and trigonometric substitution)",
      indikator:
        "- Mampu menentukan integral suatu fungsi dengan teknik substitusi\n- Mampu menentukan integral fungsi dengan substitusi trigonometri",
      bentuk:
        "- Tugas terstruktur: latihan substitusi\n- Kriteria: ketepatan pemilihan teknik substitusi ≥ 70",
      luring:
        "1. Pembahasan PR pertemuan 9\n2. Kuliah: teknik substitusi\n3. Diskusi: TM 1mg (3 sks x 50)\n4. Tugas: soal integral substitusi\n5. Praktikum: integral numerik",
      daring:
        "1. Diskusi via Zoom\n2. E-Learning: modul & video substitusi\n3. Forum diskusi tugas",
      bobot: "5",
    },
    {
      pert: "11",
      cpmk: "CPMK-5\n(Sub-CPMK-5.4)",
      jenis: "K",
      matIND:
        "Teknik Pengintegralan: Integral parsial, parsial trigonometri, pecahan rasional (partial fractions)",
      matEN:
        "Integration Techniques: Integration by parts, trigonometric integration, partial fractions",
      indikator:
        "- Mampu menentukan integral suatu fungsi dengan teknik parsial\n- Mampu menentukan integral parsial trigonometri dan pecahan rasional",
      bentuk:
        "- Tugas terstruktur: latihan integral parsial\n- Kriteria: ketepatan prosedur ≥ 70",
      luring:
        "1. Pembahasan PR pertemuan 10\n2. Kuliah: integral parsial & pecahan rasional\n3. Diskusi: TM 1mg (3 sks x 50)\n4. Tugas: soal integral parsial\n5. Praktikum: integral parsial numerik",
      daring:
        "1. Diskusi via Zoom\n2. E-Learning: modul & video integral parsial\n3. Quiz online",
      bobot: "5",
    },
    {
      pert: "12",
      cpmk: "CPMK-7\n(Sub-CPMK-7.1, 7.2)",
      jenis: "K",
      matIND:
        "Fungsi Transendental: Fungsi eksponen, logaritma natural, fungsi trigonometri dan inversnya, turunan dan integralnya",
      matEN:
        "Transcendental Functions: Exponential functions, natural logarithm, trigonometric and inverse trigonometric functions, their derivatives and integrals",
      indikator:
        "- Mampu menentukan turunan & integral fungsi eksponen dan logaritma natural\n- Mampu menentukan turunan & integral fungsi trigonometri dan inversnya",
      bentuk:
        "- Tugas terstruktur: latihan turunan & integral transendental\n- Kriteria: ketepatan rumus & hasil ≥ 70",
      luring:
        "1. Pembahasan PR pertemuan 11\n2. Kuliah: fungsi transendental\n3. Diskusi: TM 1mg (3 sks x 50)\n4. Tugas: turunan & integral eksponen, log, trigonometri\n5. Praktikum: plot fungsi transendental",
      daring:
        "1. Pemaparan via Zoom\n2. E-Learning: video & modul\n3. Diskusi forum",
      bobot: "5",
    },
    {
      pert: "13",
      cpmk: "CPMK-6\n(Sub-CPMK-6.1, 6.2, 6.3)",
      jenis: "K",
      matIND:
        "Aplikasi Integral (Bagian 1): Luas di antara dua kurva, volume benda putar (metode cakram, kulit, cincin), panjang busur",
      matEN:
        "Applications of Integrals (Part 1): Area between two curves, volume of solid of revolution (disk, shell, washer methods), arc length",
      indikator:
        "- Mampu menentukan luas di antara dua kurva\n- Mampu menentukan volume benda putar jika luasan diputar mengelilingi sumbu x atau y\n- Mampu menentukan panjang busur suatu kurva",
      bentuk:
        "- Homework/PR tentang penggunaan integral tentu untuk hitung luas, volume, dan panjang busur\n- Kriteria: ketepatan rumus & hasil ≥ 70",
      luring:
        "1. Pemaparan materi aplikasi integral\n2. Tanya jawab & latihan kelas\n3. Tugas: Homework aplikasi integral\n4. Praktikum: visualisasi volume benda putar",
      daring:
        "1. Pemaparan via Zoom\n2. E-Learning: animasi volume putar, modul\n3. Pengumpulan tugas via LMS",
      bobot: "5",
    },
    {
      pert: "14",
      cpmk: "CPMK-6\n(Sub-CPMK-6.4)",
      jenis: "K",
      matIND:
        "Aplikasi Integral (Bagian 2): Luas permukaan benda putar, momen, dan titik pusat suatu luasan",
      matEN:
        "Applications of Integrals (Part 2): Surface area of solid of revolution, moments, and centroids of plane regions",
      indikator:
        "- Mampu menghitung luas permukaan benda putar\n- Mampu menghitung momen dan titik pusat suatu luasan",
      bentuk:
        "- Tugas terstruktur: review pertemuan berikutnya\n- Kriteria: pemahaman konsep momen & pusat ≥ 70",
      luring:
        "1. Pembahasan PR pertemuan 13\n2. Pemaparan materi luas permukaan & momen\n3. Tanya jawab & latihan\n4. Tugas: soal momen & titik pusat\n5. Praktikum: perhitungan momen inersia penampang",
      daring:
        "1. Diskusi via Zoom\n2. E-Learning: modul & video\n3. Forum diskusi tugas",
      bobot: "5",
    },
    {
      pert: "15",
      cpmk: "CPMK-7\n(Sub-CPMK-7.3, 7.4)",
      jenis: "K",
      matIND:
        "Fungsi pada Koordinat Kutub: Konversi koordinat, sketsa grafik fungsi kutub, luas dan panjang busur pada koordinat kutub",
      matEN:
        "Functions in Polar Coordinates: Coordinate conversion, sketching polar graphs, area and arc length in polar coordinates",
      indikator:
        "- Mampu menjelaskan dan menggambar fungsi pada koordinat kutub\n- Mampu menghitung luas dan panjang busur pada koordinat kutub",
      bentuk:
        "- Tugas terstruktur: review materi UAS\n- Kriteria: pemahaman konsep koordinat kutub ≥ 70",
      luring:
        "1. Pemaparan materi koordinat kutub\n2. Tanya jawab & latihan\n3. Tugas: review materi untuk UAS\n4. Praktikum: plot grafik kutub & perhitungan luas",
      daring:
        "1. Pemaparan via Zoom\n2. E-Learning: video & modul koordinat kutub\n3. Quiz online persiapan UAS",
      bobot: "5",
    },
    {
      pert: "16",
      cpmk: "CPMK-1 s/d CPMK-7",
      jenis: "A",
      matIND:
        "UJIAN AKHIR SEMESTER (UAS): Mencakup seluruh materi semester (sistem bilangan, fungsi, limit, turunan, integral, transendental, aplikasi, koordinat kutub)",
      matEN:
        "FINAL EXAM (UAS): Covers all semester materials (number systems, functions, limits, derivatives, integrals, transcendental, applications, polar coordinates)",
      indikator:
        "- Penguasaan konsep seluruh materi semester\n- Kemampuan menerapkan konsep dalam menyelesaikan soal\n- Ketepatan prosedur & hasil hitungan",
      bentuk:
        "- UAS tertulis (soal uraian & beberapa pilihan ganda)\n- Durasi 120 menit\n- Kriteria: skal 0-100, konversi ke huruf A-E",
      luring:
        "Pelaksanaan UAS tatap muka di ruang kelas sesuai jadwal (proktor dosen pengampu)",
      daring:
        "Apabila dared: UAS online via LMS dengan proctoring",
      bobot: "10",
    },
  ];

  const dataRows = rps.map(
    (r, i) =>
      new TableRow({
        cantSplit: true,
        children: [
          cell(r.pert, { width: colWidths[0], align: AlignmentType.CENTER, bold: true, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r.cpmk, { width: colWidths[1], valign: VerticalAlign.TOP, size: 18, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r.jenis, { width: colWidths[2], align: AlignmentType.CENTER, bold: true, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r.matIND, { width: colWidths[3], valign: VerticalAlign.TOP, size: 18, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r.matEN, { width: colWidths[4], valign: VerticalAlign.TOP, size: 18, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r.indikator, { width: colWidths[5], valign: VerticalAlign.TOP, size: 18, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r.bentuk, { width: colWidths[6], valign: VerticalAlign.TOP, size: 18, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r.luring, { width: colWidths[7], valign: VerticalAlign.TOP, size: 18, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r.daring, { width: colWidths[8], valign: VerticalAlign.TOP, size: 18, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r.bobot, { width: colWidths[9], align: AlignmentType.CENTER, bold: true, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
        ],
      })
  );

  // Total row
  const totalRow = new TableRow({
    cantSplit: true,
    children: [
      cell("TOTAL", {
        width: colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6] + colWidths[7] + colWidths[8],
        bold: true,
        align: AlignmentType.RIGHT,
        valign: VerticalAlign.CENTER,
        fill: c(P.headerBg),
        color: c(P.headerText),
      }),
      cell("100", {
        width: colWidths[9],
        bold: true,
        align: AlignmentType.CENTER,
        valign: VerticalAlign.CENTER,
        fill: c(P.headerBg),
        color: c(P.headerText),
      }),
    ],
  });

  // We need to span the first 9 columns into one. Let's use columnSpan
  const totalRowFixed = new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        columnSpan: 9,
        shading: { type: ShadingType.CLEAR, fill: c(P.headerBg), color: "auto" },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 80, bottom: 80, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: "TOTAL", bold: true, color: c(P.headerText), size: 22, font: FONT_HEAD }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: colWidths[9], type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: c(P.headerBg), color: "auto" },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 80, bottom: 80, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "100", bold: true, color: c(P.headerText), size: 22, font: FONT_HEAD }),
            ],
          }),
        ],
      }),
    ],
  });

  return [
    heading1("F. RENCANA PEMBELAJARAN SEMESTER (RPS) DETAIL - 16 PERTEMUAN"),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 312, after: 200 },
      indent: { firstLine: 480 },
      children: [
        new TextRun({
          text:
            "Rincian kegiatan pembelajaran selama 16 pertemuan disajikan pada tabel berikut. Pertemuan ke-8 merupakan Ujian Tengah Semester (UTS) dan pertemuan ke-16 merupakan Ujian Akhir Semester (UAS). Mata kuliah berbobot 4 SKS dengan rincian 3 SKS teori (luring) + 1 SKS praktikum. Setiap pertemuan kuliah dilaksanakan 3x50 menit TM + 1x60 menit praktikum.",
          size: 22,
          font: FONT_BODY,
          color: c(P.body),
        }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      borders: tableBorders,
      rows: [headerRow, ...dataRows, totalRowFixed],
    }),
  ];
}

// ── 8. RINCIAN BOBOT PENILAIAN ──
function buildBobot() {
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      headerCell("No", { width: 8 }),
      headerCell("Komponen Penilaian", { width: 32 }),
      headerCell("Bentuk Penilaian", { width: 30 }),
      headerCell("Bobot (%)", { width: 15 }),
      headerCell("Kriteria", { width: 15 }),
    ],
  });

  const data = [
    ["1", "Tugas/PR Pertemuan 1", "Latihan soal sistem bilangan & fungsi", "5", "≥ 70"],
    ["2", "Tugas/PR Pertemuan 2-3", "Latihan soal limit & kekontinuan", "5", "≥ 70"],
    ["3", "Tugas/PR Pertemuan 4-5", "Latihan soal turunan & implisit", "5", "≥ 70"],
    ["4", "Tugas/PR Pertemuan 6-7", "Latihan aplikasi turunan & L'Hopital", "5", "≥ 70"],
    ["5", "Tugas/PR Pertemuan 9-10", "Latihan integral & substitusi", "5", "≥ 70"],
    ["6", "Tugas/PR Pertemuan 11-12", "Latihan integral parsial & transendental", "5", "≥ 70"],
    ["7", "Tugas/PR Pertemuan 13-15", "Latihan aplikasi integral & koordinat kutub", "5", "≥ 70"],
    ["8", "Keaktifan & Kehadiran", "Partisipasi diskusi & kehadiran ≥ 80%", "10", "≥ 80"],
    ["9", "UTS (Pertemuan 8)", "Ujian tertulis (soal uraian + PG)", "25", "≥ 56"],
    ["10", "UAS (Pertemuan 16)", "Ujian tertulis (soal uraian + PG)", "25", "≥ 56"],
  ];

  const dataRows = data.map(
    (r, i) =>
      new TableRow({
        cantSplit: true,
        children: [
          cell(r[0], { width: 8, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[1], { width: 32, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[2], { width: 30, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[3], { width: 15, align: AlignmentType.CENTER, bold: true, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[4], { width: 15, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
        ],
      })
  );

  const totalRow = new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        columnSpan: 3,
        shading: { type: ShadingType.CLEAR, fill: c(P.headerBg), color: "auto" },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 80, bottom: 80, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "TOTAL", bold: true, color: c(P.headerText), size: 22, font: FONT_HEAD })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 15, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: c(P.headerBg), color: "auto" },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 80, bottom: 80, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "100", bold: true, color: c(P.headerText), size: 22, font: FONT_HEAD })],
          }),
        ],
      }),
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: c(P.headerBg), color: "auto" },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 80, bottom: 80, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "", color: c(P.headerText), size: 22 })],
          }),
        ],
      }),
    ],
  });

  // Skala nilai
  const skalaHeader = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      headerCell("Rentang Nilai", { width: 25 }),
      headerCell("Huruf Mutu", { width: 20 }),
      headerCell("Predikat", { width: 25 }),
      headerCell("Bobot", { width: 15 }),
      headerCell("Keterangan", { width: 15 }),
    ],
  });

  const skala = [
    ["85 - 100", "A", "Sangat Baik", "4", "Lulus"],
    ["80 - 84", "A-", "Baik Sekali", "3.75", "Lulus"],
    ["75 - 79", "B+", "Lebih dari Baik", "3.5", "Lulus"],
    ["70 - 74", "B", "Baik", "3", "Lulus"],
    ["65 - 69", "B-", "Cukup Baik", "2.75", "Lulus"],
    ["60 - 64", "C+", "Lebih dari Cukup", "2.5", "Lulus"],
    ["56 - 59", "C", "Cukup", "2", "Lulus"],
    ["41 - 55", "D", "Kurang", "1", "Tidak Lulus"],
    ["0 - 40", "E", "Gagal", "0", "Tidak Lulus"],
  ];

  const skalaRows = skala.map(
    (r, i) =>
      new TableRow({
        cantSplit: true,
        children: [
          cell(r[0], { width: 25, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[1], { width: 20, align: AlignmentType.CENTER, bold: true, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[2], { width: 25, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[3], { width: 15, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
          cell(r[4], { width: 15, align: AlignmentType.CENTER, valign: VerticalAlign.CENTER, fill: i % 2 === 0 ? c(P.zebra) : "FFFFFF" }),
        ],
      })
  );

  return [
    heading1("G. RINCIAN BOBOT PENILAIAN"),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 312, after: 200 },
      indent: { firstLine: 480 },
      children: [
        new TextRun({
          text:
            "Penilaian mahasiswa dilakukan secara komprehensif melalui beberapa komponen yang terdiri dari tugas/PR terstruktur pada setiap pertemuan, keaktifan dan kehadiran dalam diskusi, Ujian Tengah Semester (UTS), serta Ujian Akhir Semester (UAS). Setiap komponen memiliki bobot tertentu sesuai dengan tingkat kompleksitas dan tingkat pencapaian CPMK yang diukur. Mahasiswa dinyatakan lulus mata kuliah ini apabila memperoleh nilai akhir minimal 56 (C).",
          size: 22,
          font: FONT_BODY,
          color: c(P.body),
        }),
      ],
    }),
    heading2("1. Komponen Penilaian"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      borders: tableBorders,
      rows: [headerRow, ...dataRows, totalRow],
    }),
    new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "" })] }),
    heading2("2. Skala Penilaian (Konversi Nilai Akhir ke Huruf Mutu)"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      borders: tableBorders,
      rows: [skalaHeader, ...skalaRows],
    }),
  ];
}

// ── 9. METODE & STRATEGI PEMBELAJARAN ──
function buildMetode() {
  return [
    heading1("H. METODE & STRATEGI PEMBELAJARAN"),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 312, after: 200 },
      indent: { firstLine: 480 },
      children: [
        new TextRun({
          text:
            "Pembelajaran mata kuliah Matematika Dasar ini menggunakan pendekatan Student-Centered Learning (SCL) dengan metode kombinasi kuliah interaktif, diskusi kelompok, penugasan terstruktur, dan problem-based learning (PBL). Karena bobot 4 SKS terdiri dari 3 SKS teori dan 1 SKS praktikum, pembelajaran dilaksanakan dalam dua mode utama, yaitu luring (tatap muka langsung di kelas) dan daring (melalui platform e-learning LMS Universitas Tulungagung serta video conference via Zoom).",
          size: 22,
          font: FONT_BODY,
          color: c(P.body),
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 312, after: 200 },
      indent: { firstLine: 480 },
      children: [
        new TextRun({
          text:
            "Pada mode luring, dosen memaparkan konsep dasar secara interaktif selama 3x50 menit per pertemuan, diikuti dengan sesi diskusi dan tanya jawab untuk memastikan pemahaman mahasiswa. Setiap pertemuan juga dilengkapi dengan praktikum 1x60 menit menggunakan software matematika seperti GeoGebra, Wolfram Alpha, atau MATLAB untuk memvisualisasikan konsep-konsep abstrak seperti grafik fungsi, limit, turunan, dan integral. Praktikum ini bertujuan memperkuat pemahaman konseptual mahasiswa melalui eksplorasi visual dan numerik.",
          size: 22,
          font: FONT_BODY,
          color: c(P.body),
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 312, after: 200 },
      indent: { firstLine: 480 },
      children: [
        new TextRun({
          text:
            "Pada mode daring, materi perkuliahan didistribusikan melalui Learning Management System (LMS) berupa modul elektronik, video pembelajaran, animasi interaktif (khususnya untuk konsep limit, Riemann sum, dan volume benda putar), serta kuis online untuk evaluasi mandiri. Diskusi kelompok dan konsultasi dilakukan melalui forum diskusi LMS dan video conference Zoom. Penugasan terstruktur diberikan setiap pertemuan untuk memperdalam pemahaman, dengan pengumpulan dan umpan balik melalui LMS. Pendekatan ini memastikan mahasiswa memiliki akses materi 24/7 dan dapat belajar sesuai dengan kecepatan masing-masing.",
          size: 22,
          font: FONT_BODY,
          color: c(P.body),
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 312, after: 200 },
      indent: { firstLine: 480 },
      children: [
        new TextRun({
          text:
            "Selain metode di atas, pembelajaran juga menggunakan pendekatan problem-based learning (PBL) pada materi aplikasi turunan dan aplikasi integral. Mahasiswa diberi permasalahan rekayasa sipil nyata seperti perhitungan momen lentur maksimum balok, perhitungan volume beton untuk struktur silindris, atau perhitungan luas penampang hidrolis, dan diminta menyelesaikannya dalam kelompok kecil. Pendekatan ini melatih kemampuan analisis, kerja tim, dan komunikasi (sesuai CPL-11 dan CPL-12), serta mengintegrasikan pengetahuan matematika dengan konteks rekayasa sipil (sesuai CPL-3, CPL-4, dan CPL-6).",
          size: 22,
          font: FONT_BODY,
          color: c(P.body),
        }),
      ],
    }),
  ];
}

// ── 10. PUSTAKA ──
function buildPustaka() {
  const pustakaUtama = [
    "Purcell, E.J., Varberg, D., & Rigdon, S.E. (1998). Kalkulus dan Geometri Analisis (Edisi ke-8). Jakarta: Penerbit Erlangga.",
    "Larson, R.E., Hostetler, R.P., & Edwards, B.H. (1994). Calculus with Analytic Geometry (5th ed.). Lexington, MA: D.C. Heath and Company.",
    "Tim Dosen. (2014). Buku Ajar Mata Kuliah Kalkulus Diferensial dan Integral, Program Studi S1 Teknik Sipil. [Internal Publication].",
  ];

  const pustakaPendukung = [
    "Anton, H., Bivens, I., & Davis, S. (2015). Calculus: Early Transcendentals (11th ed.). New York: John Wiley & Sons.",
    "Stewart, J. (2016). Calculus: Early Transcendentals (8th ed.). Boston, MA: Cengage Learning.",
    "Thomas, G.B., & Finney, R.L. (2010). Thomas' Calculus (12th ed.). Boston, MA: Pearson Education.",
    "Sydsaeter, K., Hammond, P., & Strom, A. (2016). Essential Mathematics for Economic Analysis (5th ed.). Harlow: Pearson Education.",
    "Leithold, L. (2002). The Calculus 7 (7th ed.). New York: HarperCollins College Publishers.",
    "Spivak, M. (2008). Calculus (4th ed.). Houston, TX: Publish or Perish.",
  ];

  const listParas = (items, isUtama) =>
    items.map(
      (item, i) =>
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { line: 312, after: 100 },
          indent: { left: 720, hanging: 360 },
          children: [
            new TextRun({
              text: `${i + 1}. ${item}`,
              size: 22,
              font: FONT_BODY,
              color: c(P.body),
            }),
          ],
        })
    );

  return [
    heading1("I. PUSTAKA UTAMA DAN PENDUKUNG"),
    heading2("Pustaka Utama"),
    ...listParas(pustakaUtama, true),
    new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "" })] }),
    heading2("Pustaka Pendukung"),
    ...listParas(pustakaPendukung, false),
    new Paragraph({ spacing: { before: 200, after: 0 }, children: [new TextRun({ text: "" })] }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 312, after: 100 },
      indent: { firstLine: 480 },
      children: [
        new TextRun({
          text:
            "Selain pustaka di atas, mahasiswa dianjurkan membaca jurnal ilmiah terindeks terkait aplikasi matematika dalam rekayasa sipil, serta mengakses sumber daring seperti MIT OpenCourseWare, Khan Academy, dan Wolfram MathWorld untuk memperkaya pemahaman konsep.",
          size: 22,
          font: FONT_BODY,
          color: c(P.body),
        }),
      ],
    }),
  ];
}

// ── 11. APPROVAL ──
function buildApproval() {
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      headerCell("Disusun oleh", { width: 33 }),
      headerCell("Diketahui oleh", { width: 33 }),
      headerCell("Disahkan oleh", { width: 34 }),
    ],
  });

  const roleRow = new TableRow({
    cantSplit: true,
    children: [
      cell("Dosen Pengampu Mata Kuliah", { width: 33, align: AlignmentType.CENTER, bold: true, valign: VerticalAlign.CENTER, fill: c(P.surface) }),
      cell("Ketua Program Studi S1 Teknik Sipil", { width: 33, align: AlignmentType.CENTER, bold: true, valign: VerticalAlign.CENTER, fill: c(P.surface) }),
      cell("Dekan Fakultas Teknik", { width: 34, align: AlignmentType.CENTER, bold: true, valign: VerticalAlign.CENTER, fill: c(P.surface) }),
    ],
  });

  // Empty space for signature
  const signatureRow = new TableRow({
    cantSplit: true,
    height: { value: 2200, rule: HeightRule.ATLEAST },
    children: [
      cell("\n\n\n\n(Tanda Tangan & Stempel)", { width: 33, align: AlignmentType.CENTER, valign: VerticalAlign.BOTTOM, size: 18 }),
      cell("\n\n\n\n(Tanda Tangan & Stempel)", { width: 33, align: AlignmentType.CENTER, valign: VerticalAlign.BOTTOM, size: 18 }),
      cell("\n\n\n\n(Tanda Tangan & Stempel)", { width: 34, align: AlignmentType.CENTER, valign: VerticalAlign.BOTTOM, size: 18 }),
    ],
  });

  const nameRow = new TableRow({
    cantSplit: true,
    children: [
      cell("Nama : 【Nama Dosen Pengampu】\nNIDN/NIY : 【NIDN】", { width: 33, align: AlignmentType.LEFT, valign: VerticalAlign.TOP }),
      cell("Nama : 【Ka. Prodi TS】\nNIDN/NIY : 【NIDN】", { width: 33, align: AlignmentType.LEFT, valign: VerticalAlign.TOP }),
      cell("Nama : 【Dekan FT】\nNIDN/NIY : 【NIDN】", { width: 34, align: AlignmentType.LEFT, valign: VerticalAlign.TOP }),
    ],
  });

  return [
    heading1("J. PENGESAHAN"),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 312, after: 200 },
      indent: { firstLine: 480 },
      children: [
        new TextRun({
          text:
            "Rencana Pembelajaran Semester (RPS) Mata Kuliah Matematika Dasar ini telah disusun dan disahkan sebagai pedoman pelaksanaan pembelajaran untuk Semester Ganjil Tahun Akademik 2024/2025 di Program Studi S1 Teknik Sipil, Fakultas Teknik, Universitas Tulungagung.",
          size: 22,
          font: FONT_BODY,
          color: c(P.body),
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: 312, after: 200 },
      children: [
        new TextRun({
          text: "Tulungagung, ____ ____________ 2024",
          size: 22,
          font: FONT_BODY,
          color: c(P.body),
        }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      borders: tableBorders,
      rows: [headerRow, roleRow, signatureRow, nameRow],
    }),
  ];
}

// ── ASSEMBLY ──
const doc = new Document({
  creator: "Z.ai",
  title: "RPS Matematika Dasar - Prodi S1 Teknik Sipil UNTANG",
  styles: {
    default: {
      document: {
        run: {
          font: FONT_BODY,
          size: 22,
          color: c(P.body),
        },
        paragraph: {
          spacing: { line: 312 },
        },
      },
      heading1: {
        run: {
          font: FONT_HEAD,
          size: 28,
          bold: true,
          color: c(P.primary),
        },
        paragraph: {
          spacing: { before: 360, after: 180, line: 312 },
        },
      },
      heading2: {
        run: {
          font: FONT_HEAD,
          size: 24,
          bold: true,
          color: c(P.primary),
        },
        paragraph: {
          spacing: { before: 240, after: 120, line: 312 },
        },
      },
    },
  },
  sections: [
    // SECTION 1: Cover (no page number, portrait)
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: buildCover(),
    },
    // SECTION 2: Body (portrait) - sections A-E
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              border: {
                bottom: { style: BorderStyle.SINGLE, size: 4, color: c(P.accent), space: 4 },
              },
              children: [
                new TextRun({
                  text: "RPS Matematika Dasar - S1 Teknik Sipil FT UNTANG",
                  size: 18,
                  italics: true,
                  color: c(P.secondary),
                  font: FONT_BODY,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Halaman ",
                  size: 18,
                  color: c(P.secondary),
                  font: FONT_BODY,
                }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  size: 18,
                  color: c(P.secondary),
                  font: FONT_BODY,
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        ...buildIdentitas(),
        ...buildCPL(),
        ...buildCPMK(),
        ...buildPemetaan(),
        ...buildJenisPertemuan(),
      ],
    },
    // SECTION 3: RPS Detail (LANDSCAPE) - the big table
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 16838, height: 11906, orientation: PageOrientation.LANDSCAPE },
          margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              border: {
                bottom: { style: BorderStyle.SINGLE, size: 4, color: c(P.accent), space: 4 },
              },
              children: [
                new TextRun({
                  text: "RPS Matematika Dasar - S1 Teknik Sipil FT UNTANG | Detail 16 Pertemuan",
                  size: 18,
                  italics: true,
                  color: c(P.secondary),
                  font: FONT_BODY,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Halaman ",
                  size: 18,
                  color: c(P.secondary),
                  font: FONT_BODY,
                }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  size: 18,
                  color: c(P.secondary),
                  font: FONT_BODY,
                }),
              ],
            }),
          ],
        }),
      },
      children: [...buildRPSDetail()],
    },
    // SECTION 4: Body after RPS (portrait) - G-J
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              border: {
                bottom: { style: BorderStyle.SINGLE, size: 4, color: c(P.accent), space: 4 },
              },
              children: [
                new TextRun({
                  text: "RPS Matematika Dasar - S1 Teknik Sipil FT UNTANG",
                  size: 18,
                  italics: true,
                  color: c(P.secondary),
                  font: FONT_BODY,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Halaman ",
                  size: 18,
                  color: c(P.secondary),
                  font: FONT_BODY,
                }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  size: 18,
                  color: c(P.secondary),
                  font: FONT_BODY,
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        ...buildBobot(),
        ...buildMetode(),
        ...buildPustaka(),
        ...buildApproval(),
      ],
    },
  ],
});

const outPath = "/home/z/my-project/download/RPS_Matematika_Dasar_S1_Teknik_Sipil_UNTAG.docx";

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outPath, buf);
  console.log("✅ Generated:", outPath);
  console.log("   File size:", (buf.length / 1024).toFixed(1), "KB");
});

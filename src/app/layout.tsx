import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UNITA Learn - Platform MOOC Fakultas Ekonomi Universitas Tulungagung",
  description: "Belajar kapan saja, di mana saja. Kursus online berkualitas dari Fakultas Ekonomi Universitas Tulungagung. Manajemen, Akuntansi, Ekonomi, Soft Skills, dan Kewirausahaan.",
  keywords: ["UNITA", "MOOC", "Fakultas Ekonomi", "Tulungagung", "kursus online", "Manajemen", "Akuntansi", "Kewirausahaan"],
  authors: [{ name: "Fakultas Ekonomi Universitas Tulungagung" }],
  openGraph: {
    title: "UNITA Learn - MOOC Fakultas Ekonomi Universitas Tulungagung",
    description: "Belajar kapan saja, di mana saja. Kursus online berkualitas dari Fakultas Ekonomi Universitas Tulungagung.",
    siteName: "UNITA Learn",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

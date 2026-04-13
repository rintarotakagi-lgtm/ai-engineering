import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const BASE_URL = "https://ai-engineering-three.vercel.app";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "AI活用のための実践レッスン",
    template: "%s — AI活用のための実践レッスン",
  },
  description:
    "機械学習の理論からGit/GitHubの使い方まで、インタラクティブなデモ付きで学べる無料サイト。株式会社Uribo運営。",
  keywords: [
    "機械学習",
    "深層学習",
    "Git",
    "GitHub",
    "AI",
    "教科書",
    "無料",
    "インタラクティブ",
  ],
  authors: [{ name: "株式会社Uribo" }],
  openGraph: {
    title: "AI活用のための実践レッスン",
    description:
      "機械学習の理論からGit/GitHubまで、インタラクティブなデモ付きで学べる無料サイト。",
    url: BASE_URL,
    siteName: "AI活用のための実践レッスン",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI活用のための実践レッスン",
    description:
      "機械学習の理論からGit/GitHubまで、インタラクティブなデモ付き。すべて無料。",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} antialiased`}>
      <body className="flex min-h-screen flex-col bg-white font-[family-name:var(--font-noto-sans-jp)] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <GoogleAnalytics />
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

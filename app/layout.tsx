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
    default: "機械学習の教科書 — かんたん大学数学で理解する",
    template: "%s — 機械学習の教科書",
  },
  description:
    "線形回帰からLLMまで、インタラクティブなデモ付きで機械学習の理論を体系的に学べる無料サイト。全15レッスン、大学レベルの数学で丁寧に解説。",
  keywords: [
    "機械学習",
    "深層学習",
    "ディープラーニング",
    "線形回帰",
    "ニューラルネットワーク",
    "Transformer",
    "LLM",
    "AI",
    "数学",
    "教科書",
    "無料",
    "インタラクティブ",
  ],
  authors: [{ name: "株式会社Uribo" }],
  openGraph: {
    title: "機械学習の教科書 — かんたん大学数学で理解する",
    description:
      "線形回帰からLLMまで、インタラクティブなデモ付きで機械学習の理論を体系的に学べる無料サイト。",
    url: BASE_URL,
    siteName: "機械学習の教科書",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "機械学習の教科書 — かんたん大学数学で理解する",
    description:
      "線形回帰からLLMまで、インタラクティブなデモ付き。全15レッスン無料。",
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

import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "AI Engineering — ゼロから学ぶ機械学習・深層学習",
  description:
    "インタラクティブなデモ付きで、機械学習から LLM まで体系的に学べる無料学習サイト。株式会社Uribo 運営。",
  openGraph: {
    title: "AI Engineering — ゼロから学ぶ機械学習・深層学習",
    description:
      "インタラクティブなデモ付きで、機械学習から LLM まで体系的に学べる無料学習サイト。",
    type: "website",
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
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

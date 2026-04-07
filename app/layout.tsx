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
  title: "機械学習の教科書 — かんたん大学数学で理解する",
  description:
    "線形回帰からLLMまで、インタラクティブなデモ付きで機械学習の理論を体系的に学べる無料サイト。",
  openGraph: {
    title: "機械学習の教科書 — かんたん大学数学で理解する",
    description:
      "線形回帰からLLMまで、インタラクティブなデモ付きで機械学習の理論を体系的に学べる無料サイト。",
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

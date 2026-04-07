"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isLesson = pathname.startsWith("/lessons");

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-lg dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white">
            AI
          </div>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            AI Engineering
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/"
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              !isLesson
                ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            カリキュラム
          </Link>
          <Link
            href="/lessons/linear-regression"
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              isLesson
                ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            レッスン
          </Link>
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-lg dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
        >
          AI活用のための実践レッスン
        </Link>
        <span className="text-xs text-zinc-400">by Uribo</span>
      </div>
    </nav>
  );
}

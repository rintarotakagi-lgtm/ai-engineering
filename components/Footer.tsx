import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white">
                AI
              </div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                AI Engineering
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-500">
              機械学習からLLMまで、理論をインタラクティブに学ぶ無料学習サイト。
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              コンテンツ
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/lessons/linear-regression"
                  className="text-sm text-zinc-600 transition-colors hover:text-amber-600 dark:text-zinc-400"
                >
                  Lesson 1: 線形回帰
                </Link>
              </li>
              <li>
                <Link
                  href="/lessons/logistic-regression"
                  className="text-sm text-zinc-600 transition-colors hover:text-amber-600 dark:text-zinc-400"
                >
                  Lesson 2: ロジスティック回帰
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              運営
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  株式会社Uribo
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400 dark:border-zinc-800">
          &copy; 2026 株式会社Uribo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

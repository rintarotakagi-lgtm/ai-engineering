import Link from "next/link";
import { curriculum } from "@/content/curriculum";

export default function Home() {
  const phases = curriculum.reduce(
    (acc, item) => {
      if (!acc[item.phase]) acc[item.phase] = [];
      acc[item.phase].push(item);
      return acc;
    },
    {} as Record<string, typeof curriculum>,
  );

  const availableCount = curriculum.filter((c) => c.available).length;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Gradient orbs */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-sm font-medium text-amber-300">
                全{curriculum.length}レッスン・インタラクティブデモ付き
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
              AI Engineering
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-zinc-300">
              線形回帰から LLM まで。
              <br className="hidden sm:block" />
              数学的な理論を、触って理解する。
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/lessons/linear-regression"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40"
              >
                学習を始める
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <a
                href="#curriculum"
                className="inline-flex items-center rounded-xl border border-zinc-600 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-400 hover:text-white"
              >
                カリキュラムを見る
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 border-t border-zinc-700/50 pt-8">
            <div>
              <p className="text-3xl font-bold text-amber-400">
                {curriculum.length}
              </p>
              <p className="mt-1 text-sm text-zinc-400">レッスン</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-400">
                {availableCount * 6}+
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                インタラクティブデモ
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-400">無料</p>
              <p className="mt-1 text-sm text-zinc-400">すべてのコンテンツ</p>
            </div>
          </div>
        </div>
      </header>

      {/* Feature highlights */}
      <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="mx-auto grid max-w-5xl gap-0 sm:grid-cols-3">
          {[
            {
              icon: "📐",
              title: "理論をしっかり",
              desc: "数式の意味を一つずつ丁寧に解説。なぜその式なのかを理解する",
            },
            {
              icon: "🖱️",
              title: "触って理解",
              desc: "パラメータを動かして、アルゴリズムの振る舞いを直感的に体感",
            },
            {
              icon: "🧱",
              title: "積み上げ式",
              desc: "線形回帰 → NN → Transformer → LLM。前のレッスンが次の土台に",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="border-b border-zinc-200 p-8 sm:border-b-0 sm:border-r last:border-0 dark:border-zinc-800"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-100">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum */}
      <main id="curriculum" className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            カリキュラム
          </h2>
          <p className="mt-3 text-zinc-500">
            4つのフェーズで、基礎から最先端まで体系的に学ぶ
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {Object.entries(phases).map(([phase, items]) => (
            <section key={phase}>
              <h3 className="mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                <span className="shrink-0">{phase}</span>
                <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
              </h3>
              <div className="space-y-3">
                {items.map((item) => {
                  const lessonNumber =
                    curriculum.findIndex((c) => c.slug === item.slug) + 1;

                  return item.available ? (
                    <Link
                      key={item.slug}
                      href={`/lessons/${item.slug}`}
                      className="group flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-600"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white shadow-md shadow-amber-500/20">
                        {lessonNumber}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-zinc-900 group-hover:text-amber-600 dark:text-zinc-100 dark:group-hover:text-amber-400">
                            {item.title}
                          </h4>
                          <svg
                            className="h-4 w-4 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                        <p className="mt-1 text-sm text-zinc-500">
                          {item.subtitle}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div
                      key={item.slug}
                      className="flex items-start gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800/50 dark:bg-zinc-900/30"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-sm font-bold text-zinc-400 dark:bg-zinc-800">
                        {lessonNumber}
                      </span>
                      <div>
                        <h4 className="font-semibold text-zinc-400 dark:text-zinc-600">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-600">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-white">
            今すぐ学習を始めよう
          </h2>
          <p className="mt-4 text-zinc-400">
            Lesson 1 は5分で始められます。アカウント登録不要。
          </p>
          <Link
            href="/lessons/linear-regression"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40"
          >
            Lesson 1: 線形回帰から始める
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

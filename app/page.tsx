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

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <p className="mb-3 text-sm font-medium tracking-wider text-amber-400">
            全15レッスン・インタラクティブデモ付き
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            AI Engineering
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            線形回帰から LLM まで、理論をインタラクティブに学ぶ
          </p>
          <p className="mt-6 text-sm text-zinc-500">
            運営: 株式会社Uribo
          </p>
        </div>
      </header>

      {/* Curriculum */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        {Object.entries(phases).map(([phase, items]) => (
          <section key={phase} className="mb-12">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
              {phase}
            </h2>
            <div className="space-y-3">
              {items.map((item, i) => {
                const lessonNumber =
                  curriculum.findIndex((c) => c.slug === item.slug) + 1;

                return item.available ? (
                  <Link
                    key={item.slug}
                    href={`/lessons/${item.slug}`}
                    className="group flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-amber-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-600"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                      {lessonNumber}
                    </span>
                    <div>
                      <h3 className="font-semibold text-zinc-900 group-hover:text-amber-600 dark:text-zinc-100 dark:group-hover:text-amber-400">
                        {item.title}
                      </h3>
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
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-400 dark:bg-zinc-800">
                      {lessonNumber}
                    </span>
                    <div>
                      <h3 className="font-semibold text-zinc-400 dark:text-zinc-600">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-600">
                        {item.subtitle}
                      </p>
                      <span className="mt-2 inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-400 dark:bg-zinc-800">
                        Coming soon
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-3xl px-6 py-8 text-center text-sm text-zinc-400">
          &copy; 2026 株式会社Uribo. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

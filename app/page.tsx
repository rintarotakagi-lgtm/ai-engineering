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
    <div>
      {/* Header */}
      <header className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            機械学習の教科書
          </h1>
          <p className="mt-2 text-lg text-zinc-500">
            かんたん大学数学で理解する
          </p>
          <p className="mt-4 leading-relaxed text-zinc-500">
            線形回帰から LLM まで、全{curriculum.length}レッスン。
            インタラクティブなデモ付きで、すべて無料で公開しています。
          </p>
        </div>
      </header>

      {/* Curriculum */}
      <main className="mx-auto max-w-3xl px-6 py-10">
        {Object.entries(phases).map(([phase, items]) => (
          <section key={phase} className="mb-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
              {phase}
            </h2>
            <div className="space-y-2">
              {items.map((item) => {
                const lessonNumber =
                  curriculum.findIndex((c) => c.slug === item.slug) + 1;

                return item.available ? (
                  <Link
                    key={item.slug}
                    href={`/lessons/${item.slug}`}
                    className="group flex items-start gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4 transition-colors hover:border-amber-300 hover:bg-amber-50/30 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-700 dark:hover:bg-amber-950/10"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                      {lessonNumber}
                    </span>
                    <div>
                      <h3 className="font-semibold text-zinc-900 group-hover:text-amber-700 dark:text-zinc-100 dark:group-hover:text-amber-400">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-zinc-500">
                        {item.subtitle}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div
                    key={item.slug}
                    className="flex items-start gap-4 rounded-xl border border-zinc-100 px-5 py-4 dark:border-zinc-800/50"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-sm font-bold text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600">
                      {lessonNumber}
                    </span>
                    <div>
                      <h3 className="text-zinc-300 dark:text-zinc-600">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-zinc-300 dark:text-zinc-700">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

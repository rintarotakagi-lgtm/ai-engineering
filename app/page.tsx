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
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            AI Engineering
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-zinc-500">
            機械学習から LLM まで、理論をインタラクティブに学ぶ。
            全{curriculum.length}レッスン、すべて無料で公開しています。
          </p>
        </div>
      </header>

      {/* Curriculum */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        {Object.entries(phases).map(([phase, items]) => (
          <section key={phase} className="mb-14">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
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
                    className="group -mx-3 flex items-baseline gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  >
                    <span className="w-6 shrink-0 text-right text-sm tabular-nums text-zinc-400">
                      {lessonNumber}
                    </span>
                    <div>
                      <span className="font-medium text-zinc-900 group-hover:text-amber-600 dark:text-zinc-100 dark:group-hover:text-amber-400">
                        {item.title}
                      </span>
                      <span className="ml-3 text-sm text-zinc-400">
                        {item.subtitle}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div
                    key={item.slug}
                    className="-mx-3 flex items-baseline gap-4 px-3 py-3"
                  >
                    <span className="w-6 shrink-0 text-right text-sm tabular-nums text-zinc-300 dark:text-zinc-700">
                      {lessonNumber}
                    </span>
                    <div>
                      <span className="text-zinc-300 dark:text-zinc-700">
                        {item.title}
                      </span>
                      <span className="ml-3 text-sm text-zinc-300 dark:text-zinc-700">
                        {item.subtitle}
                      </span>
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

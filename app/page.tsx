import Link from "next/link";

const courses = [
  {
    slug: "ml",
    title: "機械学習の教科書",
    subtitle: "かんたん大学数学で理解する",
    description:
      "線形回帰からLLMまで、全15レッスン。インタラクティブなデモ付きで理論を体系的に学ぶ。",
    lessonCount: 15,
    color: "amber",
  },
  {
    slug: "git",
    title: "Git/GitHub入門",
    subtitle: "非エンジニアのための実践ガイド",
    description:
      "バージョン管理の基本からチーム開発まで、全8レッスン。ビジュアルで直感的に学ぶ。",
    lessonCount: 8,
    color: "sky",
  },
  {
    slug: "engineer",
    title: "エンジニア入門",
    subtitle: "ディレクター・経営者のためのエンジニアリング基礎",
    description:
      "Webシステム・Python・Git・LLM APIまで、全19レッスン。「コードを書ける」より「読める・判断できる・指示できる」を目指す。",
    lessonCount: 19,
    color: "emerald",
  },
];

export default function Home() {
  return (
    <div>
      <header className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            AI活用のための実践レッスン
          </h1>
          <p className="mt-3 leading-relaxed text-zinc-500">
            インタラクティブなデモ付きで、すべて無料で公開しています。
            <br />
            学びたいコースを選んでください。
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="space-y-4">
          {courses.map((course) => (
            <Link
              key={course.slug}
              href={`/${course.slug}`}
              className="group block rounded-xl border border-zinc-200 bg-white px-6 py-6 transition-colors hover:border-amber-300 hover:bg-amber-50/20 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 group-hover:text-amber-700 dark:text-zinc-100 dark:group-hover:text-amber-400">
                    {course.title}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">{course.subtitle}</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                    {course.description}
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-500 dark:bg-zinc-800">
                  {course.lessonCount}レッスン
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

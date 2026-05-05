import Link from "next/link";

const colorStyles: Record<string, { card: string; title: string; badge: string }> = {
  amber: {
    card: "hover:border-amber-300 hover:bg-amber-50/20 dark:hover:border-amber-700",
    title: "group-hover:text-amber-700 dark:group-hover:text-amber-400",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  sky: {
    card: "hover:border-sky-300 hover:bg-sky-50/20 dark:hover:border-sky-700",
    title: "group-hover:text-sky-700 dark:group-hover:text-sky-400",
    badge: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  },
  emerald: {
    card: "hover:border-emerald-300 hover:bg-emerald-50/20 dark:hover:border-emerald-700",
    title: "group-hover:text-emerald-700 dark:group-hover:text-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  blue: {
    card: "hover:border-blue-300 hover:bg-blue-50/20 dark:hover:border-blue-700",
    title: "group-hover:text-blue-700 dark:group-hover:text-blue-400",
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
};

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
  {
    slug: "python",
    title: "Pythonの教科書",
    subtitle: "入門から中級まで、実行しながら学ぶ",
    description:
      "変数・制御フロー・OOP・型ヒント・テストまで全18レッスン。ブラウザ上でPythonコードを書いて即実行できる。",
    lessonCount: 18,
    color: "blue",
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
          {courses.map((course) => {
            const style = colorStyles[course.color] ?? colorStyles.amber;
            return (
              <Link
                key={course.slug}
                href={`/${course.slug}`}
                className={`group block rounded-xl border border-zinc-200 bg-white px-6 py-6 transition-colors dark:border-zinc-800 dark:bg-zinc-900 ${style.card}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className={`text-xl font-bold text-zinc-900 dark:text-zinc-100 ${style.title}`}>
                      {course.title}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">{course.subtitle}</p>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                      {course.description}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-lg px-3 py-1 text-sm font-medium ${style.badge}`}>
                    {course.lessonCount}レッスン
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

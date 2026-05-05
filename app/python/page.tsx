import Link from "next/link";
import { pythonCurriculum } from "@/content/python-curriculum";

export default function PythonCoursePage() {
  const phases = Array.from(new Set(pythonCurriculum.map((c) => c.phase)));

  return (
    <div>
      <header className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <Link href="/" className="mb-3 inline-block text-sm text-zinc-400 hover:text-zinc-700">
            ← コース一覧
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Pythonの教科書
          </h1>
          <p className="mt-2 text-lg text-zinc-500">
            入門から中級まで、実行しながら学ぶ
          </p>
          <p className="mt-4 leading-relaxed text-zinc-500">
            変数・制御フロー・OOP・型ヒント・テストまで全{pythonCurriculum.length}レッスン。
            ブラウザ上でPythonコードを書いて即実行できます。
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {phases.map((phase) => {
          const items = pythonCurriculum.filter((c) => c.phase === phase);
          const startIndex = pythonCurriculum.findIndex((c) => c.phase === phase);

          return (
            <div key={phase} className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                {phase}
              </h2>
              <div className="space-y-2">
                {items.map((item, i) => {
                  const lessonNumber = startIndex + i + 1;

                  return item.available ? (
                    <Link
                      key={item.slug}
                      href={`/python/${item.slug}`}
                      className="group flex items-start gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4 transition-colors hover:border-blue-300 hover:bg-blue-50/30 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950/10"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                        {lessonNumber}
                      </span>
                      <div>
                        <h3 className="font-semibold text-zinc-900 group-hover:text-blue-700 dark:text-zinc-100 dark:group-hover:text-blue-400">
                          {item.title}
                        </h3>
                        <p className="mt-0.5 text-sm text-zinc-500">{item.subtitle}</p>
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
                        <h3 className="text-zinc-300 dark:text-zinc-600">{item.title}</h3>
                        <p className="mt-0.5 text-sm text-zinc-300 dark:text-zinc-700">{item.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}

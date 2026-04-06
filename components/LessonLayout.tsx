"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lesson } from "@/lib/types";
import RichText from "./RichText";
import Quiz from "./Quiz";
import { interactiveRegistry as lesson1Registry } from "./interactives/lesson1";
import { lesson2Registry } from "./interactives/lesson2";

const interactiveRegistry: Record<string, React.ComponentType> = {
  ...lesson1Registry,
  ...lesson2Registry,
};

export default function LessonLayout({ lesson }: { lesson: Lesson }) {
  const [currentSection, setCurrentSection] = useState(0);
  const section = lesson.sections[currentSection];
  const progress = ((currentSection + 1) / lesson.sections.length) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <Link
            href="/"
            className="mb-4 inline-block text-sm text-zinc-400 transition-colors hover:text-white"
          >
            ← カリキュラム一覧
          </Link>
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <p className="mt-2 text-zinc-400">{lesson.subtitle}</p>
        </div>
      </header>

      {/* Progress bar */}
      <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-center gap-4 py-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-zinc-500">
              {currentSection + 1} / {lesson.sections.length}
            </span>
          </div>

          {/* Section tabs */}
          <div className="flex gap-1 overflow-x-auto pb-2">
            {lesson.sections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentSection(i)}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs transition-colors ${
                  i === currentSection
                    ? "bg-amber-100 font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {section.title}
        </h2>

        {section.blocks.map((block, i) => {
          switch (block.type) {
            case "text":
              return <RichText key={i} content={block.content} />;
            case "interactive": {
              const Component = interactiveRegistry[block.id];
              if (!Component) {
                return (
                  <div
                    key={i}
                    className="my-6 rounded-xl bg-zinc-100 p-8 text-center text-sm text-zinc-400 dark:bg-zinc-800"
                  >
                    Interactive: {block.id} (coming soon)
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="my-6 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <Component />
                </div>
              );
            }
            case "quiz":
              return <Quiz key={i} data={block.data} />;
            default:
              return null;
          }
        })}

        {/* Navigation */}
        <div className="mt-12 flex justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <button
            onClick={() => setCurrentSection((s) => Math.max(0, s - 1))}
            disabled={currentSection === 0}
            className="rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-50 disabled:opacity-30 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            ← 前のセクション
          </button>
          <button
            onClick={() =>
              setCurrentSection((s) =>
                Math.min(lesson.sections.length - 1, s + 1)
              )
            }
            disabled={currentSection === lesson.sections.length - 1}
            className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-30"
          >
            次のセクション →
          </button>
        </div>
      </main>
    </div>
  );
}

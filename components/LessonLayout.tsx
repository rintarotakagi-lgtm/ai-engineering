"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lesson } from "@/lib/types";
import { curriculum } from "@/content/curriculum";
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

  const currentIndex = curriculum.findIndex((c) => c.slug === lesson.slug);
  const lessonNumber = currentIndex + 1;
  const prevLesson = curriculum
    .slice(0, currentIndex)
    .reverse()
    .find((c) => c.available);
  const nextLesson = curriculum.slice(currentIndex + 1).find((c) => c.available);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Lesson Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 py-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold shadow-lg shadow-amber-500/20">
              {lessonNumber}
            </span>
            <span className="rounded-full border border-zinc-600 px-3 py-0.5 text-xs text-zinc-400">
              Lesson {lessonNumber} / {curriculum.length}
            </span>
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">{lesson.title}</h1>
          <p className="mt-3 text-lg text-zinc-400">{lesson.subtitle}</p>
        </div>
      </header>

      {/* Progress bar + section tabs */}
      <div className="sticky top-14 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-center gap-4 py-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="shrink-0 text-xs font-medium text-zinc-500">
              {currentSection + 1} / {lesson.sections.length}
            </span>
          </div>

          <div className="-mb-px flex gap-1 overflow-x-auto pb-0">
            {lesson.sections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentSection(i)}
                className={`shrink-0 border-b-2 px-3 py-2 text-xs transition-colors ${
                  i === currentSection
                    ? "border-amber-500 font-medium text-amber-700 dark:text-amber-400"
                    : "border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
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
                  className="my-8 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
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

        {/* Section navigation */}
        <div className="mt-12 flex justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <button
            onClick={() => setCurrentSection((s) => Math.max(0, s - 1))}
            disabled={currentSection === 0}
            className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-50 disabled:opacity-30 dark:border-zinc-700 dark:hover:bg-zinc-800"
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
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/20 transition-all hover:shadow-amber-500/30 disabled:opacity-30 disabled:shadow-none"
          >
            次のセクション →
          </button>
        </div>

        {/* Lesson navigation */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {prevLesson && (
            <Link
              href={`/lessons/${prevLesson.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700"
            >
              <svg
                className="h-5 w-5 shrink-0 text-zinc-300 group-hover:text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <div>
                <p className="text-xs text-zinc-400">前のレッスン</p>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {prevLesson.title}
                </p>
              </div>
            </Link>
          )}
          {nextLesson && (
            <Link
              href={`/lessons/${nextLesson.slug}`}
              className="group flex items-center justify-end gap-3 rounded-xl border border-zinc-200 p-4 text-right transition-all hover:border-zinc-300 hover:shadow-md sm:col-start-2 dark:border-zinc-800 dark:hover:border-zinc-700"
            >
              <div>
                <p className="text-xs text-zinc-400">次のレッスン</p>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {nextLesson.title}
                </p>
              </div>
              <svg
                className="h-5 w-5 shrink-0 text-zinc-300 group-hover:text-amber-500"
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
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

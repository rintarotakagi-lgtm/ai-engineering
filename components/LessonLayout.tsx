"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lesson, CurriculumItem } from "@/lib/types";
import { curriculum as mlCurriculum } from "@/content/curriculum";
import RichText from "./RichText";
import Quiz from "./Quiz";
import { interactiveRegistry as lesson1Registry } from "./interactives/lesson1";
import { lesson2Registry } from "./interactives/lesson2";
import { lesson3Registry } from "./interactives/lesson3";
import { lesson4Registry } from "./interactives/lesson4";
import { lesson5Registry } from "./interactives/lesson5";
import { lesson6Registry } from "./interactives/lesson6";
import { lesson7Registry } from "./interactives/lesson7";
import { lesson8Registry } from "./interactives/lesson8";
import { lesson9Registry } from "./interactives/lesson9";
import { lesson10Registry } from "./interactives/lesson10";
import { lesson11Registry } from "./interactives/lesson11";
import { lesson12Registry } from "./interactives/lesson12";
import { lesson13Registry } from "./interactives/lesson13";
import { lesson14Registry } from "./interactives/lesson14";
import { lesson15Registry } from "./interactives/lesson15";
import { git1Registry } from "./interactives/git1";
import { git2Registry } from "./interactives/git2";
import { git3Registry } from "./interactives/git3";
import { git4Registry } from "./interactives/git4";
import { git5Registry } from "./interactives/git5";
import { git6Registry } from "./interactives/git6";
import { git7Registry } from "./interactives/git7";
import { git8Registry } from "./interactives/git8";

const interactiveRegistry: Record<string, React.ComponentType> = {
  ...lesson1Registry,
  ...lesson2Registry,
  ...lesson3Registry,
  ...lesson4Registry,
  ...lesson5Registry,
  ...lesson6Registry,
  ...lesson7Registry,
  ...lesson8Registry,
  ...lesson9Registry,
  ...lesson10Registry,
  ...lesson11Registry,
  ...lesson12Registry,
  ...lesson13Registry,
  ...lesson14Registry,
  ...lesson15Registry,
  ...git1Registry,
  ...git2Registry,
  ...git3Registry,
  ...git4Registry,
  ...git5Registry,
  ...git6Registry,
  ...git7Registry,
  ...git8Registry,
};

export default function LessonLayout({ lesson, courseBase = "/ml", curriculum }: { lesson: Lesson; courseBase?: string; curriculum?: CurriculumItem[] }) {
  const cur = curriculum ?? mlCurriculum;
  const [currentSection, setCurrentSection] = useState(0);
  const section = lesson.sections[currentSection];
  const progress = ((currentSection + 1) / lesson.sections.length) * 100;

  const currentIndex = cur.findIndex((c) => c.slug === lesson.slug);
  const lessonNumber = currentIndex + 1;
  const prevLesson = cur
    .slice(0, currentIndex)
    .reverse()
    .find((c) => c.available);
  const nextLesson = cur.slice(currentIndex + 1).find((c) => c.available);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Lesson Header */}
      <header className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <p className="mb-2 text-sm font-medium text-amber-600 dark:text-amber-400">
            Lesson {lessonNumber}
          </p>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {lesson.title}
          </h1>
          <p className="mt-2 text-zinc-500">{lesson.subtitle}</p>
        </div>
      </header>

      {/* Progress bar + section tabs */}
      <div className="sticky top-14 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-center gap-4 py-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-300"
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
          {currentSection < lesson.sections.length - 1 && (
            <button
              onClick={() =>
                setCurrentSection((s) =>
                  Math.min(lesson.sections.length - 1, s + 1)
                )
              }
              className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              次のセクション →
            </button>
          )}
        </div>

        {/* Lesson navigation */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {prevLesson && (
            <Link
              href={`${courseBase}/${prevLesson.slug}`}
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
              href={`${courseBase}/${nextLesson.slug}`}
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

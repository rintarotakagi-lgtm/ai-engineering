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
import { agent1Registry } from "./interactives/agent1";
import { agent2Registry } from "./interactives/agent2";
import { agent3Registry } from "./interactives/agent3";
import { agent4Registry } from "./interactives/agent4";
import { agent5Registry } from "./interactives/agent5";
import { rag1Registry } from "./interactives/rag1";
import { rag2Registry } from "./interactives/rag2";
import { rag3Registry } from "./interactives/rag3";
import { rag4Registry } from "./interactives/rag4";
import { rag5Registry } from "./interactives/rag5";
import { rag6Registry } from "./interactives/rag6";
import { eng1Registry } from "./interactives/eng1";
import { eng2Registry } from "./interactives/eng2";
import { eng3Registry } from "./interactives/eng3";
import { eng4Registry } from "./interactives/eng4";
import { eng5Registry } from "./interactives/eng5";
import { eng6Registry } from "./interactives/eng6";
import { eng7Registry } from "./interactives/eng7";
import { eng8Registry } from "./interactives/eng8";
import { eng9Registry } from "./interactives/eng9";
import { eng10Registry } from "./interactives/eng10";
import { eng11Registry } from "./interactives/eng11";
import { eng12Registry } from "./interactives/eng12";
import { eng13Registry } from "./interactives/eng13";
import { eng14Registry } from "./interactives/eng14";
import { eng15Registry } from "./interactives/eng15";
import { eng16Registry } from "./interactives/eng16";
import { eng17Registry } from "./interactives/eng17";
import { eng18Registry } from "./interactives/eng18";
import { eng19Registry } from "./interactives/eng19";

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
  ...agent1Registry,
  ...agent2Registry,
  ...agent3Registry,
  ...agent4Registry,
  ...agent5Registry,
  ...rag1Registry,
  ...rag2Registry,
  ...rag3Registry,
  ...rag4Registry,
  ...rag5Registry,
  ...rag6Registry,
  ...eng1Registry,
  ...eng2Registry,
  ...eng3Registry,
  ...eng4Registry,
  ...eng5Registry,
  ...eng6Registry,
  ...eng7Registry,
  ...eng8Registry,
  ...eng9Registry,
  ...eng10Registry,
  ...eng11Registry,
  ...eng12Registry,
  ...eng13Registry,
  ...eng14Registry,
  ...eng15Registry,
  ...eng16Registry,
  ...eng17Registry,
  ...eng18Registry,
  ...eng19Registry,
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
          {currentSection > 0 && (
            <button
              onClick={() => setCurrentSection((s) => Math.max(0, s - 1))}
              className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              ← 前のセクション
            </button>
          )}
          {currentSection < lesson.sections.length - 1 && (
            <button
              onClick={() =>
                setCurrentSection((s) =>
                  Math.min(lesson.sections.length - 1, s + 1)
                )
              }
              className="ml-auto rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              次のセクション →
            </button>
          )}
        </div>

        {/* Lesson navigation — show on last section, or always below section nav */}
        <div className={`grid gap-3 sm:grid-cols-2 ${currentSection === lesson.sections.length - 1 ? "mt-12 border-t border-zinc-200 pt-6 dark:border-zinc-800" : "mt-8"}`}>
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

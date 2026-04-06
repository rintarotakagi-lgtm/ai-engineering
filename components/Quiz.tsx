"use client";

import { useState } from "react";
import type { Quiz as QuizType } from "@/lib/types";

export default function Quiz({ data }: { data: QuizType }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (index: number) => {
    if (revealed) return;
    setSelected(index);
  };

  const handleCheck = () => {
    if (selected === null) return;
    setRevealed(true);
  };

  const isCorrect = selected === data.answer;

  return (
    <div className="my-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
      <p className="mb-4 font-semibold text-zinc-800 dark:text-zinc-200">
        {data.question}
      </p>
      <div className="space-y-2">
        {data.options.map((option, i) => {
          let style =
            "border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 hover:border-amber-400";
          if (revealed && i === data.answer) {
            style = "border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30";
          } else if (revealed && i === selected && !isCorrect) {
            style = "border-2 border-red-400 bg-red-50 dark:bg-red-900/30";
          } else if (selected === i && !revealed) {
            style = "border-2 border-amber-400 bg-amber-50 dark:bg-amber-900/20";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full rounded-lg px-4 py-3 text-left text-sm transition-colors ${style}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {!revealed && (
        <button
          onClick={handleCheck}
          disabled={selected === null}
          className="mt-4 rounded-lg bg-amber-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-40"
        >
          回答する
        </button>
      )}

      {revealed && (
        <div
          className={`mt-4 rounded-lg p-4 text-sm ${
            isCorrect
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
              : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          <p className="font-semibold">{isCorrect ? "正解!" : "不正解"}</p>
          <p className="mt-1">{data.explanation}</p>
        </div>
      )}
    </div>
  );
}

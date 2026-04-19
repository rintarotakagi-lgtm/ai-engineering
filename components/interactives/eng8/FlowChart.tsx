"use client";

import { useState } from "react";

export default function FlowChart() {
  const [score, setScore] = useState(75);

  const getGrade = (s: number) => {
    if (s >= 90) return { grade: "A", color: "text-green-600", label: "優秀！" };
    if (s >= 70) return { grade: "B", color: "text-blue-600", label: "良い" };
    if (s >= 50) return { grade: "C", color: "text-amber-600", label: "合格" };
    return { grade: "不合格", color: "text-red-600", label: "再試験" };
  };

  const result = getGrade(score);

  const nodes = [
    { id: "start", label: "開始", type: "start" },
    { id: "q1", label: `score >= 90？`, type: "condition", result: score >= 90 },
    { id: "q2", label: `score >= 70？`, type: "condition", result: score >= 70 && score < 90, active: score < 90 },
    { id: "q3", label: `score >= 50？`, type: "condition", result: score >= 50 && score < 70, active: score < 70 },
    { id: "a", label: "A評価", type: "result", active: score >= 90 },
    { id: "b", label: "B評価", type: "result", active: score >= 70 && score < 90 },
    { id: "c", label: "C評価", type: "result", active: score >= 50 && score < 70 },
    { id: "fail", label: "不合格", type: "result", active: score < 50 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">スコア:</label>
        <input
          type="range"
          min={0}
          max={100}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="flex-1"
        />
        <span className="w-12 text-right font-bold text-zinc-800 dark:text-zinc-200">{score}</span>
      </div>

      <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">
        <p className="mb-3 text-xs font-medium text-zinc-500">if/elif/else フローチャート</p>
        <div className="space-y-1">
          {[
            { cond: `score >= 90`, result: "A評価", active: score >= 90 },
            { cond: `score >= 70`, result: "B評価", active: score >= 70 && score < 90 },
            { cond: `score >= 50`, result: "C評価", active: score >= 50 && score < 70 },
            { cond: "else", result: "不合格", active: score < 50 },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-mono transition ${
                item.active
                  ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/30"
                  : "border-zinc-200 dark:border-zinc-700"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${item.active ? "bg-amber-500" : "bg-zinc-300"}`} />
              <span className="text-zinc-500">{i === 3 ? "else" : `if score ${i === 0 ? "" : "el"}${i > 0 ? "if " : ""}(${item.cond})`}:</span>
              <span className={`ml-2 font-bold ${item.active ? result.color : "text-zinc-400"}`}>→ {item.result}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-xl border-2 p-4 text-center ${result.grade === "不合格" ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/20" : "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/20"}`}>
        <p className="text-xs text-zinc-500">結果</p>
        <p className={`text-3xl font-bold ${result.color}`}>{result.grade}</p>
        <p className="text-sm text-zinc-500">{result.label}</p>
      </div>
    </div>
  );
}

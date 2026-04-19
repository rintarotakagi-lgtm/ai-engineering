"use client";

import { useState } from "react";

type FailureScenario = "none" | "brain-fail" | "hands-fail";

interface ScenarioData {
  id: FailureScenario;
  label: string;
  brainState: string;
  handsState: string;
  recovery: string;
  brainColor: string;
  handsColor: string;
}

const SCENARIOS: ScenarioData[] = [
  {
    id: "none",
    label: "正常動作",
    brainState:
      "Claude が「ファイルを読んで内容を要約する」と判断。Readツールの呼び出しを指示。",
    handsState:
      "サンドボックス内でReadツールを実行。ファイル内容を正常に取得してBrainに返却。",
    recovery: "問題なし。Brainが要約を生成してタスク完了。",
    brainColor: "border-green-400 bg-green-50 dark:border-green-500 dark:bg-green-900/20",
    handsColor: "border-green-400 bg-green-50 dark:border-green-500 dark:bg-green-900/20",
  },
  {
    id: "brain-fail",
    label: "Brainの失敗",
    brainState:
      "Claude が存在しないツール「analyze_sentiment」を呼び出そうとした。ハルシネーションによるミス。",
    handsState: "該当ツールが存在しないため、実行されず。",
    recovery:
      "ハーネスがエラーを検出し、「そのツールは存在しません。利用可能なツール: Read, Write, Bash, Search」とフィードバック。Claudeが正しいツールで再試行。",
    brainColor: "border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/20",
    handsColor: "border-zinc-300 bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800",
  },
  {
    id: "hands-fail",
    label: "Handsの失敗",
    brainState:
      "Claude が正しく「/data/report.csv を読む」と判断。Readツールを指示。",
    handsState:
      "ファイルが見つからない。エラー: ENOENT: no such file or directory '/data/report.csv'",
    recovery:
      "エラー情報がBrainに返却。Claudeが「ファイルが存在しないようです。Globで検索してみます」と別のアプローチを自動選択。",
    brainColor: "border-green-400 bg-green-50 dark:border-green-500 dark:bg-green-900/20",
    handsColor: "border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/20",
  },
];

export default function BrainHandsDemo() {
  const [scenarioId, setScenarioId] = useState<FailureScenario>("none");

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        Brain と Hands の分離
      </h3>

      {/* Scenario selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setScenarioId(s.id)}
            className={`rounded-lg border px-3 py-1.5 text-xs transition-all ${
              scenarioId === s.id
                ? "border-amber-400 bg-amber-50 font-semibold text-amber-600 dark:border-amber-500 dark:bg-amber-900/20 dark:text-amber-400"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Brain & Hands diagram */}
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        {/* Brain */}
        <div className={`rounded-lg border-2 p-4 transition-all ${scenario.brainColor}`}>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-lg dark:bg-purple-900/30">
              🧠
            </span>
            <div>
              <div className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
                Brain
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                Claude + ハーネス
              </div>
            </div>
          </div>
          <div className="rounded bg-white/80 p-2 text-xs text-zinc-600 dark:bg-zinc-900/50 dark:text-zinc-300">
            {scenario.brainState}
          </div>
          <div className="mt-2 text-[10px] text-zinc-400 dark:text-zinc-500">
            役割: 判断・計画・意思決定
          </div>
        </div>

        {/* Hands */}
        <div className={`rounded-lg border-2 p-4 transition-all ${scenario.handsColor}`}>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-lg dark:bg-amber-900/30">
              🤲
            </span>
            <div>
              <div className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
                Hands
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                サンドボックス + ツール
              </div>
            </div>
          </div>
          <div className="rounded bg-white/80 p-2 text-xs text-zinc-600 dark:bg-zinc-900/50 dark:text-zinc-300">
            {scenario.handsState}
          </div>
          <div className="mt-2 text-[10px] text-zinc-400 dark:text-zinc-500">
            役割: 実行・操作
          </div>
        </div>
      </div>

      {/* Arrow between */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
        <span className="text-[10px] text-zinc-400">指示 / 結果</span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
      </div>

      {/* Recovery strategy */}
      <div
        className={`rounded-lg border p-3 ${
          scenarioId === "none"
            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
            : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
        }`}
      >
        <div className="mb-1 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
          {scenarioId === "none" ? "結果" : "回復戦略"}
        </div>
        <p className="text-xs text-zinc-700 dark:text-zinc-300">
          {scenario.recovery}
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

type Phase = "idle" | "pre" | "execute" | "post" | "blocked" | "done";

interface Scenario {
  id: string;
  label: string;
  toolName: string;
  toolInput: string;
  preHookResult: "allow" | "block";
  preHookMessage: string;
  executionResult: string;
  postHookMessage: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "safe",
    label: "安全なコマンド",
    toolName: "bash",
    toolInput: 'command: "npm test"',
    preHookResult: "allow",
    preHookMessage: "安全なコマンドです。実行を許可します。",
    executionResult: "PASS: 全テスト合格 (12/12)",
    postHookMessage: "実行ログを記録しました。実行時間: 3.2秒",
  },
  {
    id: "dangerous",
    label: "危険なコマンド",
    toolName: "bash",
    toolInput: 'command: "rm -rf /"',
    preHookResult: "block",
    preHookMessage:
      "危険なコマンド「rm -rf」を検出。実行をブロックしました。",
    executionResult: "",
    postHookMessage: "",
  },
  {
    id: "file-write",
    label: "ファイル書き込み",
    toolName: "write",
    toolInput: 'file_path: "/etc/passwd", content: "..."',
    preHookResult: "block",
    preHookMessage:
      "システムファイルへの書き込みを検出。実行をブロックしました。",
    executionResult: "",
    postHookMessage: "",
  },
];

const PHASE_LABELS: Record<Phase, { label: string; color: string }> = {
  idle: { label: "待機中", color: "text-zinc-400" },
  pre: { label: "PreToolUse フック実行中", color: "text-purple-500" },
  execute: { label: "ツール実行中", color: "text-amber-500" },
  post: { label: "PostToolUse フック実行中", color: "text-blue-500" },
  blocked: { label: "ブロック！", color: "text-red-500" },
  done: { label: "完了", color: "text-green-500" },
};

export default function HooksDemo() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>([]);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;

  function runScenario() {
    setPhase("idle");
    setLog([]);

    const steps: { phase: Phase; message: string; delay: number }[] = [
      {
        phase: "pre",
        message: `[PreToolUse] ツール: ${scenario.toolName} / 入力: ${scenario.toolInput}`,
        delay: 0,
      },
      {
        phase: "pre",
        message: `[PreToolUse] ${scenario.preHookMessage}`,
        delay: 800,
      },
    ];

    if (scenario.preHookResult === "allow") {
      steps.push(
        {
          phase: "execute",
          message: `[Execute] ${scenario.toolName} を実行中...`,
          delay: 1600,
        },
        {
          phase: "execute",
          message: `[Execute] 結果: ${scenario.executionResult}`,
          delay: 2400,
        },
        {
          phase: "post",
          message: `[PostToolUse] ${scenario.postHookMessage}`,
          delay: 3200,
        },
        { phase: "done", message: "[Done] 正常完了", delay: 4000 }
      );
    } else {
      steps.push({
        phase: "blocked",
        message: "[Blocked] ツール実行がブロックされました",
        delay: 1600,
      });
    }

    steps.forEach(({ phase: p, message, delay }) => {
      setTimeout(() => {
        setPhase(p);
        setLog((prev) => [...prev, message]);
      }, delay);
    });
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        フック実行フローのデモ
      </h3>

      {/* Scenario selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setScenarioId(s.id);
              setPhase("idle");
              setLog([]);
            }}
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

      {/* Pipeline visualization */}
      <div className="mb-4 flex items-center justify-between gap-1 overflow-x-auto">
        {(["pre", "execute", "post"] as const).map((p, i) => {
          const isActive =
            phase === p ||
            (p === "pre" && phase === "blocked");
          const labels = {
            pre: "PreToolUse",
            execute: "Tool 実行",
            post: "PostToolUse",
          };
          return (
            <div key={p} className="flex items-center gap-1">
              {i > 0 && (
                <svg
                  width="24"
                  height="16"
                  viewBox="0 0 24 16"
                  className="shrink-0 text-zinc-300 dark:text-zinc-600"
                >
                  <path
                    d="M0,8 L20,8 M16,4 L20,8 L16,12"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              )}
              <div
                className={`rounded-lg border px-4 py-2 text-center text-xs font-semibold transition-all ${
                  isActive
                    ? "border-amber-400 bg-amber-50 text-amber-600 shadow-sm dark:border-amber-500 dark:bg-amber-900/20 dark:text-amber-400"
                    : "border-zinc-200 text-zinc-400 dark:border-zinc-700 dark:text-zinc-500"
                }`}
              >
                {labels[p]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status */}
      <div className="mb-4 flex items-center gap-2">
        <span
          className={`text-sm font-bold ${PHASE_LABELS[phase].color}`}
        >
          {PHASE_LABELS[phase].label}
        </span>
        {phase === "idle" && (
          <button
            onClick={runScenario}
            className="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-amber-600"
          >
            実行
          </button>
        )}
        {(phase === "done" || phase === "blocked") && (
          <button
            onClick={() => {
              setPhase("idle");
              setLog([]);
            }}
            className="rounded-lg border border-zinc-300 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            リセット
          </button>
        )}
      </div>

      {/* Log output */}
      <div className="rounded-lg bg-zinc-900 p-3 dark:bg-zinc-950">
        <div className="mb-1 text-[10px] font-semibold text-zinc-500">
          実行ログ
        </div>
        <div className="min-h-[80px] space-y-1 font-mono text-xs">
          {log.length === 0 && (
            <div className="text-zinc-600">
              シナリオを選んで「実行」を押してください
            </div>
          )}
          {log.map((entry, i) => {
            let color = "text-zinc-400";
            if (entry.startsWith("[PreToolUse]"))
              color = "text-purple-400";
            if (entry.startsWith("[Execute]")) color = "text-amber-400";
            if (entry.startsWith("[PostToolUse]"))
              color = "text-blue-400";
            if (entry.startsWith("[Blocked]")) color = "text-red-400";
            if (entry.startsWith("[Done]")) color = "text-green-400";
            return (
              <div key={i} className={color}>
                {entry}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

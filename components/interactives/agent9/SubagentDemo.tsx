"use client";

import { useState, useEffect, useCallback } from "react";

type FlowPhase =
  | "idle"
  | "main-receive"
  | "main-think"
  | "spawn-security"
  | "security-work"
  | "security-done"
  | "spawn-perf"
  | "perf-work"
  | "perf-done"
  | "main-integrate"
  | "complete";

interface FlowStep {
  phase: FlowPhase;
  label: string;
  detail: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    phase: "main-receive",
    label: "メインエージェント: タスク受信",
    detail: "「このPull Requestをレビューして」というタスクを受け取りました。",
  },
  {
    phase: "main-think",
    label: "メインエージェント: 計画",
    detail:
      "PRの差分が大きいので、セキュリティチェックとパフォーマンスチェックを専門のサブエージェントに委任します。",
  },
  {
    phase: "spawn-security",
    label: "サブエージェント起動: セキュリティ",
    detail:
      "セキュリティ専門のサブエージェントを起動。指示: 「SQLインジェクション、XSS、認証バイパスの観点でコードをチェック」",
  },
  {
    phase: "security-work",
    label: "セキュリティAgent: 分析中",
    detail:
      "Grepで危険なパターンを検索中... sanitize されていない入力を2箇所発見。",
  },
  {
    phase: "security-done",
    label: "セキュリティAgent: 報告",
    detail:
      "報告: 2件の問題を発見。(1) L42: ユーザー入力の未サニタイズ (2) L78: SQLクエリの文字列結合",
  },
  {
    phase: "spawn-perf",
    label: "サブエージェント起動: パフォーマンス",
    detail:
      "パフォーマンス専門のサブエージェントを起動。指示: 「N+1クエリ、不要な再レンダリング、メモリリークをチェック」",
  },
  {
    phase: "perf-work",
    label: "パフォーマンスAgent: 分析中",
    detail:
      "コードパスを追跡中... ループ内のDB呼び出しを1箇所発見。",
  },
  {
    phase: "perf-done",
    label: "パフォーマンスAgent: 報告",
    detail:
      "報告: 1件の問題を発見。L115-120: forループ内でDB queryを毎回実行（N+1問題）。バッチクエリに変更を推奨。",
  },
  {
    phase: "main-integrate",
    label: "メインエージェント: 統合",
    detail:
      "2つのサブエージェントの結果を統合し、優先度付きのレビューコメントを作成します。",
  },
  {
    phase: "complete",
    label: "完了: レビュー結果",
    detail:
      "レビュー完了。重大: 2件（セキュリティ）、改善推奨: 1件（パフォーマンス）。合計3件のコメントをPRに投稿しました。",
  },
];

function AgentBox({
  label,
  isActive,
  color,
  status,
}: {
  label: string;
  isActive: boolean;
  color: string;
  status: string;
}) {
  return (
    <div
      className={`rounded-lg border-2 p-3 text-center transition-all ${
        isActive
          ? `${color} shadow-md`
          : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
      }`}
    >
      <div
        className={`text-xs font-bold ${isActive ? "" : "text-zinc-400 dark:text-zinc-500"}`}
      >
        {label}
      </div>
      {status && (
        <div className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
          {status}
        </div>
      )}
    </div>
  );
}

export default function SubagentDemo() {
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStep = stepIdx >= 0 ? FLOW_STEPS[stepIdx] : null;
  const phase = currentStep?.phase ?? "idle";

  const advance = useCallback(() => {
    setStepIdx((prev) => {
      const next = prev + 1;
      if (next >= FLOW_STEPS.length) {
        setIsPlaying(false);
        return prev;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(advance, 2000);
    return () => clearInterval(timer);
  }, [isPlaying, advance]);

  function start() {
    setStepIdx(0);
    setIsPlaying(true);
  }

  function reset() {
    setStepIdx(-1);
    setIsPlaying(false);
  }

  const isFinished = stepIdx >= FLOW_STEPS.length - 1;

  function getMainStatus() {
    if (phase === "idle") return "";
    if (phase.startsWith("main")) return "実行中";
    if (phase.startsWith("spawn") || phase.includes("work") || phase.includes("done"))
      return "待機中";
    if (phase === "complete") return "完了";
    return "";
  }

  function getSecurityStatus() {
    if (phase === "spawn-security" || phase === "security-work") return "実行中";
    if (phase === "security-done") return "報告済み";
    if (
      phase === "spawn-perf" ||
      phase === "perf-work" ||
      phase === "perf-done" ||
      phase === "main-integrate" ||
      phase === "complete"
    )
      return "完了";
    return "";
  }

  function getPerfStatus() {
    if (phase === "spawn-perf" || phase === "perf-work") return "実行中";
    if (phase === "perf-done") return "報告済み";
    if (phase === "main-integrate" || phase === "complete") return "完了";
    return "";
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          サブエージェントの動作フロー
        </h3>
        <div className="flex gap-2">
          {stepIdx < 0 && (
            <button
              onClick={start}
              className="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-amber-600"
            >
              再生
            </button>
          )}
          {stepIdx >= 0 && !isFinished && (
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {isPlaying ? "一時停止" : "再開"}
            </button>
          )}
          {stepIdx >= 0 && (
            <button
              onClick={reset}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              リセット
            </button>
          )}
        </div>
      </div>

      {/* Agent boxes */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <AgentBox
          label="メインエージェント"
          isActive={phase.startsWith("main") || phase === "complete"}
          color="border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/20"
          status={getMainStatus()}
        />
        <AgentBox
          label="セキュリティAgent"
          isActive={phase.startsWith("security") || phase === "spawn-security"}
          color="border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
          status={getSecurityStatus()}
        />
        <AgentBox
          label="パフォーマンスAgent"
          isActive={phase.startsWith("perf") || phase === "spawn-perf"}
          color="border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
          status={getPerfStatus()}
        />
      </div>

      {/* Current step detail */}
      {currentStep ? (
        <div
          className={`rounded-lg border p-4 ${
            phase === "complete"
              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
              : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
          }`}
        >
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-500">
              Step {stepIdx + 1}/{FLOW_STEPS.length}
            </span>
          </div>
          <div className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {currentStep.label}
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            {currentStep.detail}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-center text-sm text-zinc-400 dark:border-zinc-600 dark:text-zinc-500">
          「再生」を押して、メインエージェントがサブエージェントに作業を委任する流れを見てみましょう
        </div>
      )}

      {/* Step progress bar */}
      {stepIdx >= 0 && (
        <div className="mt-4 flex gap-1">
          {FLOW_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= stepIdx
                  ? "bg-amber-400"
                  : "bg-zinc-200 dark:bg-zinc-700"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

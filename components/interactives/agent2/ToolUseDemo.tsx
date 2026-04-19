"use client";

import { useState } from "react";

interface Step {
  id: number;
  actor: "user" | "llm" | "tool" | "system";
  label: string;
  content: string;
}

interface Scenario {
  title: string;
  description: string;
  steps: Step[];
}

const SCENARIOS: Scenario[] = [
  {
    title: "計算タスク",
    description: "「東京からニューヨークまで9,500kmです。時速900kmの飛行機で何時間かかりますか？」",
    steps: [
      {
        id: 1,
        actor: "user",
        label: "ユーザー",
        content: "東京からニューヨークまで9,500km。時速900kmで何時間？",
      },
      {
        id: 2,
        actor: "llm",
        label: "LLM（判断）",
        content: "計算が必要だ。calculator ツールを使おう。\ncalculator({expression: \"9500 / 900\"})",
      },
      {
        id: 3,
        actor: "system",
        label: "システム",
        content: "LLMのリクエストを受け取り、calculatorツールを実行",
      },
      {
        id: 4,
        actor: "tool",
        label: "ツール結果",
        content: "10.555...",
      },
      {
        id: 5,
        actor: "llm",
        label: "LLM（回答）",
        content: "約10時間33分かかります。（9,500 / 900 = 10.56時間）",
      },
    ],
  },
  {
    title: "検索タスク",
    description: "「今日の東京の天気は？」",
    steps: [
      {
        id: 1,
        actor: "user",
        label: "ユーザー",
        content: "今日の東京の天気は？",
      },
      {
        id: 2,
        actor: "llm",
        label: "LLM（判断）",
        content: "最新の天気情報が必要。web_search ツールを使おう。\nweb_search({query: \"東京 天気 今日\"})",
      },
      {
        id: 3,
        actor: "system",
        label: "システム",
        content: "LLMのリクエストを受け取り、web_searchツールを実行",
      },
      {
        id: 4,
        actor: "tool",
        label: "ツール結果",
        content: "東京: 晴れ、最高気温22°C、最低気温14°C、降水確率10%",
      },
      {
        id: 5,
        actor: "llm",
        label: "LLM（回答）",
        content: "今日の東京は晴れで、最高気温22°C、最低気温14°Cです。降水確率は10%なので傘は不要でしょう。",
      },
    ],
  },
  {
    title: "外部操作タスク",
    description: "「明日の14時にミーティングをカレンダーに登録して」",
    steps: [
      {
        id: 1,
        actor: "user",
        label: "ユーザー",
        content: "明日の14時にミーティングをカレンダーに登録して",
      },
      {
        id: 2,
        actor: "llm",
        label: "LLM（判断）",
        content: "カレンダー操作が必要。calendar_create ツールを使おう。\ncalendar_create({title: \"ミーティング\", date: \"明日\", time: \"14:00\"})",
      },
      {
        id: 3,
        actor: "system",
        label: "システム",
        content: "LLMのリクエストを受け取り、calendar_createツールを実行",
      },
      {
        id: 4,
        actor: "tool",
        label: "ツール結果",
        content: "成功: イベント「ミーティング」を作成しました (ID: evt_123)",
      },
      {
        id: 5,
        actor: "llm",
        label: "LLM（回答）",
        content: "明日の14:00に「ミーティング」をカレンダーに登録しました。",
      },
    ],
  },
];

const ACTOR_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  user: {
    bg: "bg-blue-50 dark:bg-blue-900/10",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-400",
  },
  llm: {
    bg: "bg-amber-50 dark:bg-amber-900/10",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-400",
  },
  tool: {
    bg: "bg-green-50 dark:bg-green-900/10",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-700 dark:text-green-400",
  },
  system: {
    bg: "bg-zinc-50 dark:bg-zinc-800/50",
    border: "border-zinc-200 dark:border-zinc-700",
    text: "text-zinc-500 dark:text-zinc-400",
  },
};

export default function ToolUseDemo() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [visibleStep, setVisibleStep] = useState(0);

  const scenario = SCENARIOS[scenarioIdx];

  const handleScenarioChange = (idx: number) => {
    setScenarioIdx(idx);
    setVisibleStep(0);
  };

  const handleNext = () => {
    if (visibleStep < scenario.steps.length) {
      setVisibleStep(visibleStep + 1);
    }
  };

  const handleReset = () => {
    setVisibleStep(0);
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        LLMがツールを使って質問に答えるプロセス
      </h3>

      {/* Scenario selector */}
      <div className="mb-4 flex gap-2">
        {SCENARIOS.map((s, i) => (
          <button
            key={i}
            onClick={() => handleScenarioChange(i)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              i === scenarioIdx
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Scenario description */}
      <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
        {scenario.description}
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {scenario.steps.map((step, i) => {
          if (i >= visibleStep) return null;
          const style = ACTOR_STYLES[step.actor];
          return (
            <div
              key={step.id}
              className={`rounded-lg border p-3 ${style.bg} ${style.border}`}
            >
              <div className="mb-1 flex items-center gap-2">
                <span className={`text-xs font-semibold ${style.text}`}>
                  {step.label}
                </span>
                {step.actor === "system" && (
                  <span className="text-[10px] text-zinc-400">
                    (ユーザーからは見えない)
                  </span>
                )}
              </div>
              <p className="whitespace-pre-wrap font-mono text-xs text-zinc-700 dark:text-zinc-300">
                {step.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center gap-3">
        {visibleStep < scenario.steps.length ? (
          <button
            onClick={handleNext}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
          >
            次のステップ →
          </button>
        ) : (
          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            完了 — LLMがツールを活用して正確に回答しました
          </span>
        )}
        {visibleStep > 0 && (
          <button
            onClick={handleReset}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            リセット
          </button>
        )}
      </div>
    </div>
  );
}

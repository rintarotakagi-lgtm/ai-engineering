"use client";

import { useState } from "react";

type StepType = "think" | "act" | "observe" | "result";

interface TraceStep {
  id: number;
  type: StepType;
  label: string;
  summary: string;
  detail: string;
  toolName?: string;
  toolInput?: string;
  toolOutput?: string;
}

const TRACE_STEPS: TraceStep[] = [
  {
    id: 1,
    type: "think",
    label: "Think",
    summary: "README.mdを探す必要がある",
    detail:
      'ユーザーは「README.mdを見つけて要約して」と依頼しています。まずプロジェクト内でREADME.mdを検索する必要があります。Globツールを使ってファイルを探します。',
  },
  {
    id: 2,
    type: "act",
    label: "Act",
    summary: "Glob でファイルを検索",
    detail: "Globツールを使ってプロジェクトルート以下のREADME.mdを検索します。",
    toolName: "Glob",
    toolInput: '{ "pattern": "**/README.md" }',
    toolOutput: '["./README.md", "./packages/core/README.md"]',
  },
  {
    id: 3,
    type: "observe",
    label: "Observe",
    summary: "2つのREADME.mdが見つかった",
    detail:
      "プロジェクトルートとpackages/core/の2箇所にREADME.mdがあります。ルートのREADME.mdがメインのものと推測されるので、そちらを読みます。",
  },
  {
    id: 4,
    type: "think",
    label: "Think",
    summary: "ルートのREADME.mdを読む",
    detail:
      "ルートの./README.mdがプロジェクト全体の説明である可能性が高いので、Readツールで内容を読み取ります。",
  },
  {
    id: 5,
    type: "act",
    label: "Act",
    summary: "Read でファイル内容を取得",
    detail: "Readツールを使ってREADME.mdの全文を読み取ります。",
    toolName: "Read",
    toolInput: '{ "file_path": "./README.md" }',
    toolOutput:
      '"# AI Agent Framework\\n\\nTypeScript製のAIエージェント構築フレームワーク。\\n\\n## 特徴\\n- ReActループの自動管理\\n- 組み込みツール（Read, Write, Bash）\\n- フックによるカスタマイズ\\n- MCP対応\\n\\n## インストール\\nnpm install ai-agent-framework\\n\\n## 使い方\\nimport { Agent } from \'ai-agent-framework\'\\nconst agent = new Agent({ tools: [...] })\\nawait agent.run(\'タスクの説明\')"',
  },
  {
    id: 6,
    type: "observe",
    label: "Observe",
    summary: "ファイル内容を取得できた",
    detail:
      "README.mdの全文が取得できました。プロジェクト名、特徴、インストール方法、使い方が含まれています。これで要約を作成できます。",
  },
  {
    id: 7,
    type: "think",
    label: "Think",
    summary: "要約を作成して回答する",
    detail:
      "必要な情報は全て揃いました。これ以上ツールを使う必要はないので、README.mdの内容を要約してユーザーに回答します。",
  },
  {
    id: 8,
    type: "result",
    label: "完了",
    summary: "要約を回答",
    detail:
      "AI Agent Frameworkは、TypeScript製のAIエージェント構築フレームワークです。ReActループの自動管理、組み込みツール（Read/Write/Bash）、フックによるカスタマイズ、MCP対応が主な特徴です。npm installで導入でき、Agentクラスにツールを渡してrunメソッドで実行します。",
  },
];

const TYPE_CONFIG: Record<
  StepType,
  { icon: string; bg: string; border: string; text: string }
> = {
  think: {
    icon: "💭",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-600 dark:text-purple-400",
  },
  act: {
    icon: "⚡",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-600 dark:text-amber-400",
  },
  observe: {
    icon: "👁",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-600 dark:text-blue-400",
  },
  result: {
    icon: "✅",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-600 dark:text-green-400",
  },
};

export default function AgentTraceDemo() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        実行トレース: 「README.mdを見つけて要約して」
      </h3>
      <p className="mb-4 text-xs text-zinc-400 dark:text-zinc-500">
        各ステップをクリックして詳細を確認
      </p>

      <div className="space-y-2">
        {TRACE_STEPS.map((step) => {
          const config = TYPE_CONFIG[step.type];
          const isOpen = expanded === step.id;
          return (
            <div key={step.id}>
              <button
                onClick={() => setExpanded(isOpen ? null : step.id)}
                className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                  isOpen
                    ? `${config.border} ${config.bg}`
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                }`}
              >
                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <span className="text-base">{config.icon}</span>
                  <div className="mt-1 text-[10px] font-semibold text-zinc-400">
                    #{step.id}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${config.text} ${config.bg}`}
                    >
                      {step.label}
                    </span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-200">
                      {step.summary}
                    </span>
                  </div>
                </div>

                <svg
                  className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isOpen && (
                <div
                  className={`ml-8 mt-1 rounded-lg border ${config.border} ${config.bg} p-3`}
                >
                  <p className="text-sm text-zinc-700 dark:text-zinc-200">
                    {step.detail}
                  </p>
                  {step.toolName && (
                    <div className="mt-3 space-y-2">
                      <div>
                        <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                          ツール:
                        </span>
                        <code className="ml-2 rounded bg-zinc-200 px-1.5 py-0.5 text-xs dark:bg-zinc-700">
                          {step.toolName}
                        </code>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                          入力:
                        </span>
                        <pre className="mt-1 rounded bg-zinc-900 p-2 text-xs text-green-400 dark:bg-zinc-950">
                          {step.toolInput}
                        </pre>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                          出力:
                        </span>
                        <pre className="mt-1 max-h-32 overflow-auto rounded bg-zinc-900 p-2 text-xs text-amber-400 dark:bg-zinc-950">
                          {step.toolOutput}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

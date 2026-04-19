"use client";

import { useState } from "react";

interface SDKComponent {
  id: string;
  label: string;
  description: string;
  details: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const COMPONENTS: SDKComponent[] = [
  {
    id: "runtime",
    label: "Agent Runtime",
    description: "エージェントの実行エンジン。ReActループを管理する。",
    details: [
      "エージェントループの開始・停止・リトライ制御",
      "会話履歴（メッセージ）の管理",
      "最大反復回数・トークン上限の監視",
      "エラーハンドリングとグレースフルデグラデーション",
    ],
    x: 100,
    y: 10,
    width: 200,
    height: 50,
    color: "#f59e0b",
  },
  {
    id: "tools",
    label: "Built-in Tools",
    description: "すぐに使える組み込みツール群。",
    details: [
      "Read / Write / Edit — ファイル操作",
      "Bash — シェルコマンド実行",
      "Glob / Grep — ファイル検索",
      "WebSearch / WebFetch — Web操作",
    ],
    x: 20,
    y: 90,
    width: 160,
    height: 50,
    color: "#3b82f6",
  },
  {
    id: "hooks",
    label: "Hooks",
    description: "ツール実行前後にカスタムロジックを挿入する仕組み。",
    details: [
      "PreToolUse — 実行前のバリデーション・ブロック",
      "PostToolUse — 実行後のログ記録・結果加工",
      "Stop — エージェント停止時のクリーンアップ",
    ],
    x: 220,
    y: 90,
    width: 160,
    height: 50,
    color: "#8b5cf6",
  },
  {
    id: "permissions",
    label: "Permissions",
    description: "ツールの使用権限を管理する。",
    details: [
      "allowlist — 許可リスト方式（本番向き）",
      "blocklist — ブロックリスト方式（開発向き）",
      "prompt — ユーザー確認方式（テスト向き）",
    ],
    x: 20,
    y: 170,
    width: 160,
    height: 50,
    color: "#ef4444",
  },
  {
    id: "session",
    label: "Session",
    description: "会話のコンテキストを維持・永続化する。",
    details: [
      "メッセージ履歴の保存・復元",
      "中断からの再開（Resume）",
      "セッションIDによる一意管理",
    ],
    x: 220,
    y: 170,
    width: 160,
    height: 50,
    color: "#10b981",
  },
];

export default function SDKArchitecture() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedComponent = COMPONENTS.find((c) => c.id === selected);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        Claude Agent SDK アーキテクチャ
      </h3>
      <p className="mb-4 text-xs text-zinc-400 dark:text-zinc-500">
        各コンポーネントをクリックして詳細を確認
      </p>

      {/* Architecture diagram */}
      <div className="mb-4 flex justify-center">
        <svg
          viewBox="0 0 400 240"
          className="w-full max-w-md"
          style={{ minHeight: 200 }}
        >
          {/* Connection lines */}
          <line x1="200" y1="60" x2="100" y2="90" stroke="#71717a" strokeWidth="1.5" strokeDasharray="4" />
          <line x1="200" y1="60" x2="300" y2="90" stroke="#71717a" strokeWidth="1.5" strokeDasharray="4" />
          <line x1="100" y1="140" x2="100" y2="170" stroke="#71717a" strokeWidth="1.5" strokeDasharray="4" />
          <line x1="300" y1="140" x2="300" y2="170" stroke="#71717a" strokeWidth="1.5" strokeDasharray="4" />

          {COMPONENTS.map((comp) => {
            const isSelected = selected === comp.id;
            return (
              <g
                key={comp.id}
                onClick={() =>
                  setSelected(isSelected ? null : comp.id)
                }
                className="cursor-pointer"
              >
                <rect
                  x={comp.x}
                  y={comp.y}
                  width={comp.width}
                  height={comp.height}
                  rx="8"
                  fill={isSelected ? comp.color : "transparent"}
                  stroke={comp.color}
                  strokeWidth={isSelected ? "3" : "2"}
                  opacity={isSelected ? 1 : 0.8}
                />
                <text
                  x={comp.x + comp.width / 2}
                  y={comp.y + comp.height / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-semibold"
                  fill={isSelected ? "#fff" : comp.color}
                >
                  {comp.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail panel */}
      {selectedComponent ? (
        <div
          className="rounded-lg border p-4"
          style={{
            borderColor: selectedComponent.color + "66",
            backgroundColor: selectedComponent.color + "0a",
          }}
        >
          <div
            className="mb-1 text-sm font-bold"
            style={{ color: selectedComponent.color }}
          >
            {selectedComponent.label}
          </div>
          <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-300">
            {selectedComponent.description}
          </p>
          <ul className="space-y-1">
            {selectedComponent.details.map((d, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400"
              >
                <span
                  className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: selectedComponent.color }}
                />
                {d}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-400 dark:border-zinc-600 dark:text-zinc-500">
          上の図のコンポーネントをクリックして詳細を表示
        </div>
      )}
    </div>
  );
}

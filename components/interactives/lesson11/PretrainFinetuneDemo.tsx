"use client";

import { useState } from "react";

type TaskMode = "bert" | "gpt";

const BERT_TASKS = [
  {
    name: "感情分析",
    desc: "映画レビュー → ポジティブ / ネガティブ",
    icon: "📊",
  },
  {
    name: "固有表現抽出 (NER)",
    desc: "「東京タワーは港区にある」→ [東京タワー: 建造物, 港区: 地名]",
    icon: "🏷️",
  },
  {
    name: "質問応答",
    desc: "文脈 + 質問 → 回答の抽出",
    icon: "❓",
  },
];

const GPT_TASKS = [
  {
    name: "テキスト生成",
    desc: "プロンプト → 続きの文章を自動生成",
    icon: "✍️",
  },
  {
    name: "コード生成",
    desc: "「ソートする関数を書いて」→ コード出力",
    icon: "💻",
  },
  {
    name: "対話",
    desc: "ユーザーの入力 → 自然な返答を生成",
    icon: "💬",
  },
];

const SVG_W = 560;
const SVG_H = 330;

const BOX_W = 130;
const BOX_H = 44;
const RX = 10;

function FlowBox({
  x,
  y,
  label,
  sublabel,
  highlight,
}: {
  x: number;
  y: number;
  label: string;
  sublabel?: string;
  highlight?: boolean;
}) {
  return (
    <g>
      <rect
        x={x - BOX_W / 2}
        y={y - BOX_H / 2}
        width={BOX_W}
        height={BOX_H}
        rx={RX}
        fill={highlight ? "#92400e" : "#27272a"}
        stroke={highlight ? "#f59e0b" : "#52525b"}
        strokeWidth={highlight ? 2 : 1}
        className="transition-all duration-500"
      />
      <text
        x={x}
        y={sublabel ? y - 2 : y + 4}
        textAnchor="middle"
        className={`text-[11px] font-bold select-none ${
          highlight ? "fill-amber-300" : "fill-white"
        }`}
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={x}
          y={y + 12}
          textAnchor="middle"
          className="text-[9px] fill-zinc-400 select-none"
        >
          {sublabel}
        </text>
      )}
    </g>
  );
}

function FlowArrow({
  x1,
  y1,
  x2,
  y2,
  label,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
}) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2 - 6}
        stroke="#71717a"
        strokeWidth={1.5}
        markerEnd="url(#pfArrow)"
      />
      {label && (
        <text
          x={(x1 + x2) / 2 + 8}
          y={(y1 + y2) / 2}
          className="text-[9px] fill-zinc-500"
        >
          {label}
        </text>
      )}
    </g>
  );
}

export default function PretrainFinetuneDemo() {
  const [mode, setMode] = useState<TaskMode>("bert");

  const tasks = mode === "bert" ? BERT_TASKS : GPT_TASKS;

  const colLeft = SVG_W / 2;
  const row1 = 50;
  const row2 = 115;
  const row3 = 180;
  const row4 = 250;

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      {/* Mode toggle */}
      <div className="mb-3 flex items-center gap-3 text-xs">
        <span className="text-zinc-400">下流タスクを表示:</span>
        <button
          className={`rounded-md border px-4 py-1.5 transition ${
            mode === "bert"
              ? "border-amber-500 bg-amber-500/10 text-amber-400"
              : "border-zinc-600 text-zinc-300 hover:bg-zinc-800"
          }`}
          onClick={() => setMode("bert")}
        >
          BERT タスク
        </button>
        <button
          className={`rounded-md border px-4 py-1.5 transition ${
            mode === "gpt"
              ? "border-amber-500 bg-amber-500/10 text-amber-400"
              : "border-zinc-600 text-zinc-300 hover:bg-zinc-800"
          }`}
          onClick={() => setMode("gpt")}
        >
          GPT タスク
        </button>
      </div>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="pfArrow"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" fill="#71717a" />
          </marker>
        </defs>

        {/* Row 1: Corpus */}
        <FlowBox
          x={colLeft}
          y={row1}
          label="大規模コーパス"
          sublabel="Wikipedia, Web, 書籍"
        />

        {/* Arrow 1 → 2 */}
        <FlowArrow
          x1={colLeft}
          y1={row1 + BOX_H / 2}
          x2={colLeft}
          y2={row2 - BOX_H / 2}
          label="事前学習"
        />

        {/* Row 2: Pre-trained model */}
        <FlowBox
          x={colLeft}
          y={row2}
          label={mode === "bert" ? "BERT（事前学習済み）" : "GPT（事前学習済み）"}
          sublabel={mode === "bert" ? "MLM + NSP" : "次トークン予測"}
          highlight
        />

        {/* Arrow 2 → 3 */}
        <FlowArrow
          x1={colLeft}
          y1={row2 + BOX_H / 2}
          x2={colLeft}
          y2={row3 - BOX_H / 2}
          label="Fine-tuning"
        />

        {/* Row 3: Fine-tuned */}
        <FlowBox
          x={colLeft}
          y={row3}
          label="タスク特化モデル"
          sublabel="少量ラベルデータで微調整"
        />

        {/* Arrows to tasks */}
        {tasks.map((_, i) => {
          const taskX = 100 + i * ((SVG_W - 200) / (tasks.length - 1 || 1));
          return (
            <FlowArrow
              key={i}
              x1={colLeft}
              y1={row3 + BOX_H / 2}
              x2={taskX}
              y2={row4 - 18}
            />
          );
        })}

        {/* Row 4: Tasks */}
        {tasks.map((task, i) => {
          const taskX = 100 + i * ((SVG_W - 200) / (tasks.length - 1 || 1));
          return (
            <g key={i}>
              <rect
                x={taskX - 70}
                y={row4 - 18}
                width={140}
                height={56}
                rx={8}
                fill="#18181b"
                stroke={mode === "bert" ? "#3b82f6" : "#10b981"}
                strokeWidth={1}
              />
              <text
                x={taskX}
                y={row4 + 2}
                textAnchor="middle"
                className="text-[11px] fill-white font-bold"
              >
                {task.icon} {task.name}
              </text>
              <text
                x={taskX}
                y={row4 + 18}
                textAnchor="middle"
                className="text-[8px] fill-zinc-400"
              >
                {task.desc}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <text
          x={SVG_W / 2}
          y={SVG_H - 8}
          textAnchor="middle"
          className="text-[10px] fill-zinc-600"
        >
          {mode === "bert"
            ? "BERT: 文の理解・分類・抽出に強い"
            : "GPT: テキストの生成・補完・対話に強い"}
        </text>
      </svg>
    </div>
  );
}

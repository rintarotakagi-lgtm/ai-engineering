"use client";

import { useState } from "react";

interface ToolSpec {
  name: string;
  description: string;
  parameters: { name: string; type: string; required: boolean; desc: string }[];
}

const BAD_SPEC: ToolSpec = {
  name: "do_stuff",
  description: "Does things with data",
  parameters: [
    { name: "data", type: "any", required: true, desc: "The data" },
  ],
};

const GOOD_SPEC: ToolSpec = {
  name: "search_files",
  description:
    "指定ディレクトリ以下のファイルを正規表現パターンで検索し、マッチした行とコンテキストを返す。大きなコードベースでの調査に最適。最大1000件まで返却。",
  parameters: [
    {
      name: "pattern",
      type: "string",
      required: true,
      desc: "検索する正規表現パターン（例: 'function\\s+\\w+'）",
    },
    {
      name: "directory",
      type: "string",
      required: false,
      desc: '検索開始ディレクトリ。デフォルト: "."（カレント）',
    },
    {
      name: "file_type",
      type: "string",
      required: false,
      desc: 'ファイル種別フィルタ（例: "ts", "py", "rs"）',
    },
    {
      name: "context_lines",
      type: "number",
      required: false,
      desc: "前後に表示するコンテキスト行数。デフォルト: 2",
    },
  ],
};

const ANNOTATIONS: { bad: string[]; good: string[] } = {
  bad: [
    "名前が曖昧 — 何をするか分からない",
    "説明が不十分 — いつ使うかの情報がない",
    "パラメータの型が any — 何を渡せばいいか不明",
    "パラメータの説明がない",
  ],
  good: [
    "名前が動詞+名詞 — 目的が明確",
    "説明が詳細 — 使いどころ・制限事項まで記載",
    "型が明確 — string / number で指定",
    "必須/任意が明示 — デフォルト値も記載",
  ],
};

function SpecCard({
  spec,
  label,
  annotations,
  borderColor,
  labelColor,
  badgeColor,
}: {
  spec: ToolSpec;
  label: string;
  annotations: string[];
  borderColor: string;
  labelColor: string;
  badgeColor: string;
}) {
  return (
    <div className={`rounded-lg border ${borderColor} p-4`}>
      <div className={`mb-3 text-xs font-bold ${labelColor}`}>{label}</div>

      {/* Tool name */}
      <div className="mb-2">
        <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
          name:
        </span>
        <code className="ml-2 rounded bg-zinc-100 px-2 py-0.5 text-sm font-bold dark:bg-zinc-800">
          {spec.name}
        </code>
      </div>

      {/* Description */}
      <div className="mb-3">
        <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
          description:
        </span>
        <p className="mt-1 rounded bg-zinc-50 p-2 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {spec.description}
        </p>
      </div>

      {/* Parameters */}
      <div className="mb-3">
        <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
          parameters:
        </span>
        <div className="mt-1 space-y-1">
          {spec.parameters.map((p) => (
            <div
              key={p.name}
              className="rounded bg-zinc-50 p-2 text-xs dark:bg-zinc-800"
            >
              <code className="font-bold text-zinc-700 dark:text-zinc-200">
                {p.name}
              </code>
              <span className="ml-1 text-zinc-400">({p.type})</span>
              {p.required && (
                <span className="ml-1 rounded bg-red-100 px-1 text-[10px] text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  必須
                </span>
              )}
              {!p.required && (
                <span className="ml-1 rounded bg-zinc-200 px-1 text-[10px] text-zinc-500 dark:bg-zinc-700">
                  任意
                </span>
              )}
              <p className="mt-1 text-zinc-500 dark:text-zinc-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Annotations */}
      <div className="space-y-1">
        {annotations.map((a, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 rounded px-2 py-1 text-[11px] ${badgeColor}`}
          >
            <span className="mt-0.5 shrink-0">
              {label.includes("Bad") ? "✗" : "✓"}
            </span>
            <span>{a}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ToolSpecDemo() {
  const [showAnnotations, setShowAnnotations] = useState(true);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          ツール仕様書の比較
        </h3>
        <button
          onClick={() => setShowAnnotations((p) => !p)}
          className="rounded-lg border border-zinc-300 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {showAnnotations ? "注釈を隠す" : "注釈を表示"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SpecCard
          spec={BAD_SPEC}
          label="Bad: 曖昧なツール仕様"
          annotations={showAnnotations ? ANNOTATIONS.bad : []}
          borderColor="border-red-200 dark:border-red-800"
          labelColor="text-red-500"
          badgeColor="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
        />
        <SpecCard
          spec={GOOD_SPEC}
          label="Good: 明確なツール仕様"
          annotations={showAnnotations ? ANNOTATIONS.good : []}
          borderColor="border-green-200 dark:border-green-800"
          labelColor="text-green-500"
          badgeColor="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
        />
      </div>
    </div>
  );
}

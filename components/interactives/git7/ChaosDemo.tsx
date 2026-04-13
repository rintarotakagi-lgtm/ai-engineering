"use client";

import { useState } from "react";

interface Event {
  person: string;
  action: string;
  result: "ok" | "conflict" | "broken";
}

const chaosEvents: Event[] = [
  { person: "田中", action: "mainに直接pushした（ヘッダー変更）", result: "ok" },
  { person: "佐藤", action: "mainに直接pushした（フッター変更）", result: "ok" },
  { person: "鈴木", action: "mainに直接pushした（ヘッダー変更）", result: "conflict" },
  { person: "田中", action: "テストせずにpushした（バグ入り）", result: "broken" },
  { person: "佐藤", action: "本番が壊れた！ どの変更が原因？", result: "broken" },
];

const resultStyles = {
  ok: "border-emerald-200 bg-emerald-50 text-emerald-800",
  conflict: "border-amber-200 bg-amber-50 text-amber-800",
  broken: "border-red-200 bg-red-50 text-red-800",
};

const resultIcon = {
  ok: "○",
  conflict: "△",
  broken: "✕",
};

export default function ChaosDemo(): React.ReactElement {
  const [visibleCount, setVisibleCount] = useState(0);

  function advance(): void {
    setVisibleCount(Math.min(chaosEvents.length, visibleCount + 1));
  }

  function reset(): void {
    setVisibleCount(0);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      <div className="text-sm text-zinc-500">
        ルールなしでmainに直接pushすると何が起きるか見てみましょう。
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        {chaosEvents.slice(0, visibleCount).map((event, i) => (
          <div
            key={i}
            className={`border rounded-lg p-3 flex items-start gap-3 ${resultStyles[event.result]}`}
          >
            <span className="text-lg font-bold">{resultIcon[event.result]}</span>
            <div>
              <span className="font-bold">{event.person}:</span>{" "}
              <span className="text-sm">{event.action}</span>
            </div>
          </div>
        ))}

        {visibleCount === 0 && (
          <div className="text-center text-zinc-400 py-8 text-sm">
            「次へ」を押して、ルールなし開発のシミュレーションを開始
          </div>
        )}
      </div>

      {visibleCount === chaosEvents.length && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <div className="font-bold text-red-800 mb-1">結論: カオスです</div>
          <div className="text-sm text-red-700 space-y-1">
            <p>- コンフリクトが頻発し、作業が止まる</p>
            <p>- レビューなしでバグが入り込む</p>
            <p>- 誰の変更が問題か特定できない</p>
            <p className="font-bold mt-2">
              だから「ワークフロー」というルールが必要です。
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {visibleCount < chaosEvents.length ? (
          <button
            onClick={advance}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
          >
            次へ
          </button>
        ) : (
          <button
            onClick={reset}
            className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-lg text-sm hover:bg-zinc-200"
          >
            最初から
          </button>
        )}
      </div>
    </div>
  );
}

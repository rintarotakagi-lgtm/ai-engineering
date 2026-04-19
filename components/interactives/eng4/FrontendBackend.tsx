"use client";

import { useState } from "react";

const scenarios = [
  { label: "ログインフォーム表示", layer: "front", description: "HTMLでフォームをレンダリング → フロントエンド" },
  { label: "パスワードのハッシュ照合", layer: "back", description: "セキュリティに関わる処理はサーバー側 → バックエンド" },
  { label: "ボタンクリックのアニメーション", layer: "front", description: "ブラウザ上のUI変更 → フロントエンド" },
  { label: "クレジットカード決済処理", layer: "back", description: "外部決済APIとの通信・金額計算 → バックエンド" },
  { label: "入力値のリアルタイム検証", layer: "front", description: "メール形式チェックなどUI上の検証 → フロントエンド（重要な検証はバックでも行う）" },
  { label: "データベースへの保存", layer: "back", description: "DBとのやりとりはサーバー側 → バックエンド" },
];

const renderingModes = [
  {
    name: "SPA",
    subtitle: "Single Page Application",
    icon: "⚡",
    where: "ブラウザ",
    example: "Gmail, Notion",
    pros: "操作が速い、ページ遷移なし",
    cons: "初回ロード遅い、SEO苦手",
    color: "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20",
  },
  {
    name: "SSR",
    subtitle: "Server-Side Rendering",
    icon: "🖥️",
    where: "サーバー（毎回）",
    example: "ECサイト商品ページ",
    pros: "最新データ表示、SEO強い",
    cons: "サーバー負荷大",
    color: "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20",
  },
  {
    name: "SSG",
    subtitle: "Static Site Generation",
    icon: "📄",
    where: "ビルド時（事前）",
    example: "ブログ、このサイト",
    pros: "超高速、SEO最強、サーバー不要",
    cons: "リアルタイム更新苦手",
    color: "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/20",
  },
];

export default function FrontendBackend() {
  const [tab, setTab] = useState<"roles" | "rendering">("roles");
  const [answers, setAnswers] = useState<Record<number, string>>({});

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-700">
        {(["roles", "rendering"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === t ? "border-amber-500 text-amber-700 dark:text-amber-400" : "border-transparent text-zinc-400"
            }`}
          >
            {t === "roles" ? "フロント vs バック" : "SPA / SSR / SSG"}
          </button>
        ))}
      </div>

      {tab === "roles" ? (
        <div className="space-y-2">
          <p className="text-sm text-zinc-500">各処理はフロント・バック、どちらで行う？クリックして答えを確認</p>
          {scenarios.map((s, i) => (
            <div
              key={i}
              onClick={() => setAnswers((prev) => ({ ...prev, [i]: s.layer }))}
              className="cursor-pointer rounded-lg border border-zinc-200 p-3 transition hover:border-amber-300 dark:border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{s.label}</span>
                {answers[i] ? (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${answers[i] === "front" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                    {answers[i] === "front" ? "🎨 フロント" : "⚙️ バック"}
                  </span>
                ) : (
                  <span className="text-xs text-zinc-400">クリックして確認</span>
                )}
              </div>
              {answers[i] && <p className="mt-1 text-xs text-zinc-400">{s.description}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          {renderingModes.map((m) => (
            <div key={m.name} className={`rounded-xl border p-4 ${m.color}`}>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xl">{m.icon}</span>
                <div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">{m.name}</p>
                  <p className="text-xs text-zinc-500">{m.subtitle}</p>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <p><span className="text-zinc-400">HTMLを生成:</span> <span className="font-medium text-zinc-700 dark:text-zinc-300">{m.where}</span></p>
                <p><span className="text-zinc-400">例:</span> {m.example}</p>
                <p className="text-green-600">✓ {m.pros}</p>
                <p className="text-red-500">✗ {m.cons}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

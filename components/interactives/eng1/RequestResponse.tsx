"use client";

import { useState } from "react";

const steps = [
  { id: 1, from: "browser", to: "dns", label: "DNS解決", detail: "example.com → 203.0.113.1", color: "bg-blue-100 text-blue-800" },
  { id: 2, from: "browser", to: "server", label: "HTTPリクエスト", detail: "GET /index.html HTTP/1.1", color: "bg-amber-100 text-amber-800" },
  { id: 3, from: "server", to: "db", label: "DB問い合わせ", detail: "SELECT * FROM pages WHERE id=1", color: "bg-purple-100 text-purple-800" },
  { id: 4, from: "server", to: "browser", label: "HTTPレスポンス", detail: "200 OK + HTML", color: "bg-green-100 text-green-800" },
  { id: 5, from: "browser", to: "render", label: "レンダリング", detail: "HTMLをパース → 画面表示", color: "bg-pink-100 text-pink-800" },
];

export default function RequestResponse() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const playAnimation = async () => {
    setPlaying(true);
    for (let i = 0; i < steps.length; i++) {
      setActiveStep(steps[i].id);
      await new Promise((r) => setTimeout(r, 1200));
    }
    setPlaying(false);
  };

  const nodes = [
    { id: "browser", label: "ブラウザ", icon: "🌐", x: "5%" },
    { id: "dns", label: "DNS", icon: "📖", x: "27%" },
    { id: "server", label: "Webサーバー", icon: "🖥️", x: "53%" },
    { id: "db", label: "DB", icon: "🗄️", x: "78%" },
    { id: "render", label: "画面表示", icon: "📱", x: "5%" },
  ];

  return (
    <div className="space-y-5">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">URLを入力してEnterを押したとき、裏側で何が起きるか</p>

      <div className="relative flex justify-between px-2">
        {nodes.slice(0, 4).map((node) => (
          <div key={node.id} className="flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-xl dark:bg-zinc-800">
              {node.icon}
            </div>
            <span className="text-center text-xs text-zinc-500">{node.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-start gap-3 rounded-lg border p-3 transition-all duration-300 ${
              activeStep === step.id
                ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          >
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${step.color}`}>
              {step.id}
            </span>
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{step.label}</p>
              <code className="text-xs text-zinc-500">{step.detail}</code>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={playAnimation}
        disabled={playing}
        className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
      >
        {playing ? "アニメーション再生中..." : "▶ ステップを順番に見る"}
      </button>
    </div>
  );
}

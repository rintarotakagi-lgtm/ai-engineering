"use client";

import { useState } from "react";

interface Inquiry {
  id: number;
  text: string;
  category: "billing" | "technical" | "general";
}

interface RouteInfo {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  prompt: string;
  response: string;
}

const INQUIRIES: Inquiry[] = [
  {
    id: 1,
    text: "先月の請求が二重になっているようです。返金していただけますか？",
    category: "billing",
  },
  {
    id: 2,
    text: "APIのレート制限に引っかかっています。上限を上げる方法はありますか？",
    category: "technical",
  },
  {
    id: 3,
    text: "サービスの利用規約について質問があります。",
    category: "general",
  },
  {
    id: 4,
    text: "クレジットカードの変更方法を教えてください。",
    category: "billing",
  },
  {
    id: 5,
    text: "Webhookが404エラーを返します。設定を確認していただけますか？",
    category: "technical",
  },
];

const ROUTES: Record<string, RouteInfo> = {
  billing: {
    label: "請求チーム",
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/10",
    borderColor: "border-blue-200 dark:border-blue-800",
    prompt:
      "あなたは請求・支払いの専門エージェントです。返金・課金・支払い方法の問題に対応してください。",
    response: "",
  },
  technical: {
    label: "技術チーム",
    color: "text-amber-700 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/10",
    borderColor: "border-amber-200 dark:border-amber-800",
    prompt:
      "あなたは技術サポートの専門エージェントです。API、設定、エラーの問題に対応してください。",
    response: "",
  },
  general: {
    label: "一般チーム",
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/10",
    borderColor: "border-green-200 dark:border-green-800",
    prompt:
      "あなたは一般的な問い合わせ対応エージェントです。利用規約、アカウント、その他の質問に対応してください。",
    response: "",
  },
};

const RESPONSES: Record<number, string> = {
  1: "請求履歴を確認いたしました。4月分が二重に計上されております。返金処理を開始しました。3〜5営業日以内にカードに返金されます。",
  2: "現在のプランではAPIレート制限が100リクエスト/分です。Proプランにアップグレードすると1,000リクエスト/分に増加します。アップグレードをご希望ですか？",
  3: "利用規約についてのご質問ですね。具体的にどの項目についてお聞きになりたいですか？よくある質問としては、データの取り扱い、解約条件、商用利用の範囲などがあります。",
  4: "クレジットカードの変更は「設定 → 支払い方法」から可能です。新しいカード情報を入力し、「更新」をクリックしてください。次回の請求から新しいカードが使われます。",
  5: "Webhook URLとエンドポイントの設定を確認しましょう。まず、URLが正しいか、サーバーが稼働中か、ファイアウォールがポート443を許可しているかを確認してください。",
};

export default function RoutingDemo() {
  const [selectedInquiry, setSelectedInquiry] = useState<number | null>(null);
  const [step, setStep] = useState<"select" | "classify" | "route" | "respond">("select");

  const inquiry = selectedInquiry !== null ? INQUIRIES.find((i) => i.id === selectedInquiry) : null;
  const route = inquiry ? ROUTES[inquiry.category] : null;

  const handleSelect = (id: number) => {
    setSelectedInquiry(id);
    setStep("classify");
  };

  const handleNext = () => {
    if (step === "classify") setStep("route");
    else if (step === "route") setStep("respond");
  };

  const handleReset = () => {
    setSelectedInquiry(null);
    setStep("select");
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        カスタマーサポートのルーティング: 問い合わせを分類→専門チームに振り分け
      </h3>

      {/* Inquiry selector */}
      {step === "select" && (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            問い合わせを選んでください：
          </p>
          {INQUIRIES.map((inq) => (
            <button
              key={inq.id}
              onClick={() => handleSelect(inq.id)}
              className="block w-full rounded-lg border border-zinc-200 p-3 text-left text-sm text-zinc-700 transition-all hover:border-amber-300 hover:bg-amber-50/50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-amber-700 dark:hover:bg-amber-900/10"
            >
              {inq.text}
            </button>
          ))}
        </div>
      )}

      {/* Classification step */}
      {step === "classify" && inquiry && (
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
            <span className="text-[10px] font-semibold text-zinc-400">問い合わせ</span>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{inquiry.text}</p>
          </div>

          <div className="flex items-center justify-center">
            <svg className="h-6 w-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800/50 dark:bg-amber-900/10">
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
              LLM分類器
            </span>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              分類結果:{" "}
              <span className={`font-semibold ${route!.color}`}>
                {route!.label}
              </span>
            </p>
          </div>

          <button
            onClick={handleNext}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
          >
            専門チームにルーティング →
          </button>
        </div>
      )}

      {/* Routing step */}
      {step === "route" && inquiry && route && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(ROUTES).map(([key, r]) => (
              <div
                key={key}
                className={`rounded-lg border p-3 text-center transition-all ${
                  key === inquiry.category
                    ? `${r.bgColor} ${r.borderColor} ring-2 ring-amber-300 dark:ring-amber-600`
                    : "border-zinc-200 bg-zinc-50 opacity-40 dark:border-zinc-700 dark:bg-zinc-800"
                }`}
              >
                <span className={`text-xs font-semibold ${key === inquiry.category ? r.color : "text-zinc-400"}`}>
                  {r.label}
                </span>
              </div>
            ))}
          </div>

          <div className={`rounded-lg border p-3 ${route.bgColor} ${route.borderColor}`}>
            <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
              専門プロンプト
            </span>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              {route.prompt}
            </p>
          </div>

          <button
            onClick={handleNext}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
          >
            応答を生成 →
          </button>
        </div>
      )}

      {/* Response step */}
      {step === "respond" && inquiry && route && (
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
            <span className="text-[10px] font-semibold text-zinc-400">問い合わせ</span>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{inquiry.text}</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className={`rounded-full px-2 py-0.5 font-semibold ${route.color} ${route.bgColor}`}>
              {route.label}
            </span>
            <span className="text-zinc-400">が対応</span>
          </div>

          <div className={`rounded-lg border p-3 ${route.bgColor} ${route.borderColor}`}>
            <span className={`text-[10px] font-semibold ${route.color}`}>回答</span>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
              {RESPONSES[inquiry.id]}
            </p>
          </div>

          <button
            onClick={handleReset}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            別の問い合わせを試す
          </button>
        </div>
      )}
    </div>
  );
}

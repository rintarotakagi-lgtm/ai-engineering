"use client";

import { useState } from "react";

interface PRForm {
  title: string;
  description: string;
  reviewer: string;
}

const reviewers = ["田中さん", "佐藤さん", "鈴木さん"];

export default function PRCreator(): React.ReactElement {
  const [form, setForm] = useState<PRForm>({
    title: "",
    description: "",
    reviewer: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);

  function evaluate(): string[] {
    const issues: string[] = [];
    if (form.title.length < 5) issues.push("タイトルが短すぎます。何を変更したか分かるように書きましょう。");
    if (form.title.length > 60) issues.push("タイトルが長すぎます。簡潔にまとめましょう。");
    if (form.description.length < 10) issues.push("説明が不十分です。なぜ変更したか、どうテストしたかを書きましょう。");
    if (!form.reviewer) issues.push("レビュアーを選択してください。");
    return issues;
  }

  function handleSubmit(): void {
    const issues = evaluate();
    setFeedback(issues);
    if (issues.length === 0) {
      setSubmitted(true);
    }
  }

  function reset(): void {
    setForm({ title: "", description: "", reviewer: "" });
    setSubmitted(false);
    setFeedback([]);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4">
          <div className="font-bold text-emerald-800 text-lg mb-2">PR作成完了！</div>
          <div className="bg-white rounded-lg border p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
              <span className="font-bold text-zinc-800">Open</span>
            </div>
            <div className="text-lg font-bold text-zinc-900">{form.title}</div>
            <div className="text-sm text-zinc-600 whitespace-pre-line">{form.description}</div>
            <div className="text-xs text-zinc-400">レビュアー: {form.reviewer}</div>
          </div>
        </div>
        <button
          onClick={reset}
          className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-lg text-sm hover:bg-zinc-200"
        >
          もう一度やる
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      <div className="text-sm text-zinc-500">
        GitHub風のPR作成フォームです。良いPRを作ってみましょう。
      </div>

      {/* Simulated GitHub PR form */}
      <div className="border border-zinc-300 rounded-lg overflow-hidden">
        <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700">
          New Pull Request
        </div>
        <div className="p-4 space-y-4">
          {/* Branch indicator */}
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-mono">main</span>
            <span>&#8592;</span>
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-mono">feature/new-login</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">タイトル</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="例: ログイン画面にパスワードリセット機能を追加"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">説明</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder={"## 変更内容\n- 何を変更したか\n\n## 理由\n- なぜ変更したか\n\n## テスト\n- どうやって動作確認したか"}
              rows={5}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">レビュアー</label>
            <div className="flex flex-wrap gap-2">
              {reviewers.map((r) => (
                <button
                  key={r}
                  onClick={() => setForm({ ...form, reviewer: r })}
                  className={`px-3 py-1.5 rounded-lg text-sm transition ${
                    form.reviewer === r
                      ? "bg-amber-500 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {feedback.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="font-bold text-red-700 text-sm mb-1">改善ポイント：</div>
          <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
            {feedback.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600"
      >
        Create Pull Request
      </button>
    </div>
  );
}

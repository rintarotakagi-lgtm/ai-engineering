"use client";

import { useState } from "react";

const services = [
  { name: "EC2", category: "コンピューティング", icon: "🖥️", desc: "仮想サーバー。何でも動かせるクラウド上のPC", cost: "~$10/月（t3.micro）", useCase: "Webサーバー、バッチ処理" },
  { name: "Lambda", category: "コンピューティング", icon: "⚡", desc: "サーバーレス関数実行。動いた時間だけ課金", cost: "100万回まで無料", useCase: "イベント駆動処理、バッチ" },
  { name: "S3", category: "ストレージ", icon: "🗂️", desc: "ファイル置き場。画像・動画・バックアップを無制限保存", cost: "$0.023/GB/月", useCase: "画像アップロード、静的配信" },
  { name: "RDS", category: "データベース", icon: "🗄️", desc: "マネージドRDB。PostgreSQL/MySQLをAWSが管理", cost: "~$15/月（最小構成）", useCase: "アプリのメインDB" },
  { name: "DynamoDB", category: "データベース", icon: "📊", desc: "NoSQL。無限スケールでミリ秒レスポンス", cost: "従量課金", useCase: "セッション管理、リアルタイム" },
  { name: "CloudFront", category: "ネットワーク", icon: "🌍", desc: "CDN。世界中のサーバーから高速コンテンツ配信", cost: "$0.085/GB（最初の10TB）", useCase: "静的ファイル配信、高速化" },
  { name: "Route 53", category: "ネットワーク", icon: "📖", desc: "DNS。ドメイン名をIPアドレスに変換する", cost: "$0.50/ホストゾーン/月", useCase: "ドメイン管理" },
  { name: "Bedrock", category: "AI/ML", icon: "🤖", desc: "Claude等のLLM APIをAWS経由で利用", cost: "APIと同料金体系", useCase: "AIアプリ開発" },
  { name: "Cognito", category: "認証", icon: "🔐", desc: "ユーザー認証・ソーシャルログイン機能を提供", cost: "MAU 50,000まで無料", useCase: "ログイン機能" },
  { name: "IAM", category: "セキュリティ", icon: "🛡️", desc: "誰がどのリソースにアクセスできるか管理", cost: "無料", useCase: "アクセス権限管理" },
];

const categories = ["すべて", "コンピューティング", "ストレージ", "データベース", "ネットワーク", "AI/ML", "認証", "セキュリティ"];

export default function CloudMap() {
  const [filter, setFilter] = useState("すべて");
  const [selected, setSelected] = useState<typeof services[0] | null>(null);

  const filtered = filter === "すべて" ? services : services.filter((s) => s.category === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === cat ? "bg-amber-500 text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {filtered.map((s) => (
          <button
            key={s.name}
            onClick={() => setSelected(selected?.name === s.name ? null : s)}
            className={`rounded-xl border p-3 text-left transition ${
              selected?.name === s.name
                ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/20"
                : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="font-bold text-zinc-800 dark:text-zinc-200">{s.name}</p>
                <p className="text-xs text-zinc-400">{s.category}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{selected.icon}</span>
            <div>
              <p className="font-bold text-zinc-800 dark:text-zinc-200">{selected.name}</p>
              <p className="text-xs text-amber-600">{selected.category}</p>
            </div>
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">{selected.desc}</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-zinc-400">コスト: </span>
              <span className="font-medium text-green-600">{selected.cost}</span>
            </div>
            <div>
              <span className="text-zinc-400">用途: </span>
              <span className="text-zinc-600 dark:text-zinc-300">{selected.useCase}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

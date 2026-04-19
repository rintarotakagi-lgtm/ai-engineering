"use client";

import { useState } from "react";

const tables = {
  rdb: {
    users: {
      columns: ["id", "name", "email"],
      rows: [
        ["1", "田中太郎", "tanaka@example.com"],
        ["2", "鈴木花子", "suzuki@example.com"],
      ],
    },
    orders: {
      columns: ["id", "user_id", "total", "created_at"],
      rows: [
        ["1", "1", "¥3,200", "2024-01-15"],
        ["2", "1", "¥1,800", "2024-02-03"],
        ["3", "2", "¥950", "2024-02-10"],
      ],
    },
  },
  nosql: {
    document: {
      _id: "user_001",
      name: "田中太郎",
      email: "tanaka@example.com",
      orders: [
        { total: 3200, date: "2024-01-15" },
        { total: 1800, date: "2024-02-03" },
      ],
      tags: ["premium", "repeat"],
    },
  },
};

export default function TableBuilder() {
  const [mode, setMode] = useState<"rdb" | "nosql">("rdb");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("rdb")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            mode === "rdb" ? "bg-amber-500 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          RDB（テーブル型）
        </button>
        <button
          onClick={() => setMode("nosql")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            mode === "nosql" ? "bg-amber-500 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          NoSQL（ドキュメント型）
        </button>
      </div>

      {mode === "rdb" ? (
        <div className="space-y-4">
          {Object.entries(tables.rdb).map(([tableName, table]) => (
            <div key={tableName}>
              <p className="mb-1 text-xs font-bold uppercase text-zinc-400">{tableName}テーブル</p>
              <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 dark:bg-zinc-800">
                    <tr>
                      {table.columns.map((col) => (
                        <th key={col} className={`px-3 py-2 text-left text-xs font-bold ${col === "user_id" ? "text-amber-600" : "text-zinc-500"}`}>
                          {col}{col === "id" ? " (PK)" : col === "user_id" ? " (FK→users)" : ""}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, i) => (
                      <tr key={i} className="border-t border-zinc-100 dark:border-zinc-800">
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2 text-zinc-700 dark:text-zinc-300">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          <p className="text-xs text-zinc-400">ordersのuser_idがusersのidを参照 → これが「リレーション」</p>
        </div>
      ) : (
        <div>
          <p className="mb-1 text-xs font-bold uppercase text-zinc-400">ドキュメント（MongoDB風）</p>
          <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-xs text-green-400">
{JSON.stringify(tables.nosql.document, null, 2)}
          </pre>
          <p className="mt-2 text-xs text-zinc-400">ユーザー情報と注文履歴が1ドキュメントにまとまっている</p>
        </div>
      )}
    </div>
  );
}

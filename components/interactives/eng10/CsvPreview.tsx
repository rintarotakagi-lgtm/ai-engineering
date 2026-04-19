"use client";

import { useState } from "react";

const sampleData = [
  { id: 1, product: "ノートPC", price: 128000, qty: 3, category: "電子機器" },
  { id: 2, product: "マウス", price: 3200, qty: 15, category: "周辺機器" },
  { id: 3, product: "モニター", price: 45000, qty: 7, category: "電子機器" },
  { id: 4, product: "キーボード", price: 8500, qty: 12, category: "周辺機器" },
  { id: 5, product: "USBハブ", price: 2800, qty: 20, category: "周辺機器" },
];

export default function CsvPreview() {
  const [filterCat, setFilterCat] = useState("全て");
  const [sortBy, setSortBy] = useState<"price" | "qty" | null>(null);

  const categories = ["全て", "電子機器", "周辺機器"];

  let data = filterCat === "全て" ? sampleData : sampleData.filter((d) => d.category === filterCat);
  if (sortBy) data = [...data].sort((a, b) => b[sortBy] - a[sortBy]);

  const total = data.reduce((sum, d) => sum + d.price * d.qty, 0);

  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-500">pandasのDataFrameをシミュレート</p>
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`rounded px-2 py-1 text-xs font-medium transition ${filterCat === cat ? "bg-amber-500 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-700"}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setSortBy(sortBy === "price" ? null : "price")}
            className={`rounded px-2 py-1 text-xs font-medium transition ${sortBy === "price" ? "bg-blue-500 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-700"}`}
          >
            価格順↓
          </button>
          <button
            onClick={() => setSortBy(sortBy === "qty" ? null : "qty")}
            className={`rounded px-2 py-1 text-xs font-medium transition ${sortBy === "qty" ? "bg-blue-500 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-700"}`}
          >
            数量順↓
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              {["id", "product", "price", "qty", "category"].map((col) => (
                <th key={col} className="px-3 py-2 text-left text-xs font-bold text-zinc-500">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t border-zinc-100 dark:border-zinc-800">
                <td className="px-3 py-2 text-zinc-400">{row.id}</td>
                <td className="px-3 py-2 font-medium text-zinc-700 dark:text-zinc-300">{row.product}</td>
                <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">¥{row.price.toLocaleString()}</td>
                <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">{row.qty}</td>
                <td className="px-3 py-2"><span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-700">{row.category}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
        <span className="text-xs text-zinc-500">{data.length}行 × 5列</span>
        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">合計売上: ¥{total.toLocaleString()}</span>
      </div>

      <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
        <p className="text-xs font-mono text-zinc-500">
          df[df[&quot;category&quot;] == &quot;{filterCat}&quot;]{sortBy ? `.sort_values("${sortBy}", ascending=False)` : ""}
        </p>
      </div>
    </div>
  );
}

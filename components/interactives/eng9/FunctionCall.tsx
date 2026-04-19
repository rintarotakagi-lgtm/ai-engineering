"use client";

import { useState } from "react";

export default function FunctionCall() {
  const [name, setName] = useState("田中太郎");
  const [greeting, setGreeting] = useState("こんにちは");
  const [result, setResult] = useState("");
  const [called, setCalled] = useState(false);

  const call = () => {
    const out = `${greeting}、${name}さん！`;
    setResult(out);
    setCalled(true);
    setTimeout(() => setCalled(false), 2000);
  };

  const formatPrice = (price: number) => `¥${price.toLocaleString()}`;

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-zinc-900 p-4">
        <p className="mb-2 text-xs text-zinc-500">関数の定義</p>
        <pre className="text-sm text-green-400">{`def greet(name: str, greeting: str = "こんにちは") -> str:
    message = f"{greeting}、{name}さん！"
    return message`}</pre>
      </div>

      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
        <p className="mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">引数を変えて呼び出す</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="w-16 text-xs text-zinc-500">name:</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded border border-zinc-200 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-16 text-xs text-zinc-500">greeting:</label>
            <input
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              className="flex-1 rounded border border-zinc-200 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
        </div>
        <button
          onClick={call}
          className="mt-3 w-full rounded-lg bg-amber-500 py-2 text-sm font-semibold text-white hover:bg-amber-600"
        >
          greet({name && `"${name}"`}, {greeting && `"${greeting}"`})
        </button>
        {result && (
          <div className={`mt-3 rounded-lg border border-green-300 bg-green-50 p-3 dark:border-green-700 dark:bg-green-950/20 transition-all duration-300`}>
            <p className="text-xs text-green-600">戻り値:</p>
            <p className="font-medium text-green-700 dark:text-green-400">&ldquo;{result}&rdquo;</p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
        <p className="mb-2 text-xs font-medium text-zinc-500">format_price関数の例</p>
        <pre className="text-xs text-zinc-600 dark:text-zinc-400">{`def format_price(price: int) -> str:
    return f"¥{price:,}"

format_price(12800)  → "${formatPrice(12800)}"
format_price(980)    → "${formatPrice(980)}"
format_price(1500000)→ "${formatPrice(1500000)}"`}</pre>
      </div>
    </div>
  );
}

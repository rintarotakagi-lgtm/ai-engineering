"use client";

import React, { useState } from "react";

/* ---------- tokenizer helpers ---------- */

function tokenizeWord(text: string): string[] {
  // Simple word tokenization: split on spaces, punctuation, and Japanese particles
  const tokens: string[] = [];
  // For Japanese-ish: try to split on known particles / characters
  const re =
    /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF]+|[a-zA-Z]+|[0-9]+|[^\s]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const w = m[0];
    // Further split Japanese into rough morphemes (simple heuristic)
    if (/[\u4E00-\u9FFF]/.test(w)) {
      // Kanji: split each character as a "word"
      for (const c of w) tokens.push(c);
    } else if (/[\u3040-\u309F\u30A0-\u30FF]/.test(w)) {
      // Hiragana/katakana: split each
      for (const c of w) tokens.push(c);
    } else {
      tokens.push(w);
    }
  }
  // Try to recombine known Japanese word patterns
  return recombineJapanese(tokens);
}

function recombineJapanese(chars: string[]): string[] {
  // Known multi-char tokens
  const known = [
    "食べ",
    "猫",
    "東京",
    "日本",
    "首都",
    "自然",
    "言語",
    "処理",
    "人工",
    "知能",
    "機械",
    "学習",
  ];
  const result: string[] = [];
  let i = 0;
  while (i < chars.length) {
    let matched = false;
    for (const k of known) {
      const slice = chars.slice(i, i + k.length).join("");
      if (slice === k) {
        result.push(k);
        i += k.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result.push(chars[i]);
      i++;
    }
  }
  return result;
}

function tokenizeChar(text: string): string[] {
  return [...text].filter((c) => c.trim().length > 0);
}

function tokenizeSubword(text: string): string[] {
  // BPE-like: split English into common subwords, Japanese into 1-2 char units
  const tokens: string[] = [];
  const re =
    /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF]+|[a-zA-Z]+|[0-9]+|[^\s]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const w = m[0];
    if (/^[a-zA-Z]+$/.test(w)) {
      // English: split into subword-like pieces
      tokens.push(...splitEnglishSubword(w));
    } else if (/[\u4E00-\u9FFF]/.test(w) || /[\u3040-\u309F\u30A0-\u30FF]/.test(w)) {
      // Japanese: 1-2 char subword units
      const chars = [...w];
      let i = 0;
      while (i < chars.length) {
        if (i + 1 < chars.length) {
          tokens.push(chars[i] + chars[i + 1]);
          i += 2;
        } else {
          tokens.push(chars[i]);
          i++;
        }
      }
    } else {
      tokens.push(w);
    }
  }
  return tokens;
}

function splitEnglishSubword(word: string): string[] {
  const prefixes = ["un", "re", "pre", "dis", "over", "under", "out", "mis"];
  const suffixes = [
    "tion",
    "ation",
    "ness",
    "ment",
    "ing",
    "ize",
    "ise",
    "able",
    "ible",
    "ful",
    "less",
    "ous",
    "ive",
    "ed",
    "er",
    "est",
    "ly",
    "al",
    "ity",
  ];
  const parts: string[] = [];
  let rest = word.toLowerCase();

  // Check prefix
  for (const p of prefixes) {
    if (rest.startsWith(p) && rest.length > p.length + 1) {
      parts.push(p);
      rest = rest.slice(p.length);
      break;
    }
  }

  // Check suffix
  let suf = "";
  for (const s of suffixes) {
    if (rest.endsWith(s) && rest.length > s.length + 1) {
      suf = s;
      rest = rest.slice(0, -s.length);
      break;
    }
  }

  if (rest.length > 0) parts.push(rest);
  if (suf) parts.push(suf);

  if (parts.length === 0) return [word];
  return parts;
}

/* ---------- colors ---------- */
const COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
  "#14b8a6",
  "#a855f7",
  "#6366f1",
  "#d946ef",
];

function TokenRow({
  label,
  tokens,
}: {
  label: string;
  tokens: string[];
}) {
  return (
    <div className="mb-3">
      <div className="mb-1 text-[11px] text-zinc-500 font-bold">{label}</div>
      <div className="flex flex-wrap gap-1">
        {tokens.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-md border px-2 py-0.5 text-[12px] font-mono"
            style={{
              borderColor: COLORS[i % COLORS.length] + "66",
              backgroundColor: COLORS[i % COLORS.length] + "18",
              color: COLORS[i % COLORS.length],
            }}
          >
            {t}
          </span>
        ))}
        <span className="text-[10px] text-zinc-600 self-center ml-1">
          ({tokens.length} tokens)
        </span>
      </div>
    </div>
  );
}

const PRESETS = [
  "猫が魚を食べた",
  "自然言語処理は人工知能の一分野です",
  "I love natural language processing",
  "unhappiness",
  "tokenization",
];

export default function TokenizerDemo(): React.ReactElement {
  const [input, setInput] = useState("猫が魚を食べた");

  const wordTokens = input.trim() ? tokenizeWord(input) : [];
  const charTokens = input.trim() ? tokenizeChar(input) : [];
  const subwordTokens = input.trim() ? tokenizeSubword(input) : [];

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      <div className="mb-3 text-[13px] font-bold text-zinc-300">
        トークナイザー比較デモ
      </div>

      {/* Presets */}
      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setInput(p)}
            className={`rounded-md border px-2 py-0.5 text-[11px] transition ${
              input === p
                ? "border-amber-500 bg-amber-500/10 text-amber-400"
                : "border-zinc-600 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="mb-4 w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
        placeholder="テキストを入力..."
      />

      {/* Results */}
      {input.trim() && (
        <div className="space-y-1">
          <TokenRow label="単語分割（Word）" tokens={wordTokens} />
          <TokenRow label="文字分割（Character）" tokens={charTokens} />
          <TokenRow label="サブワード分割（BPE-like）" tokens={subwordTokens} />
        </div>
      )}

      {!input.trim() && (
        <div className="py-8 text-center text-sm text-zinc-600">
          テキストを入力すると分割結果が表示されます
        </div>
      )}
    </div>
  );
}

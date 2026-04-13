"use client";

import React, { useState, useMemo } from "react";

/* ---------- BPE algorithm ---------- */

interface BPEState {
  corpus: string[][]; // each word as array of tokens
  vocab: string[];
  mergeHistory: { pair: [string, string]; freq: number; newToken: string }[];
  pairFreqs: Map<string, number>;
}

function initBPE(words: string[]): BPEState {
  const corpus = words.map((w) => [...w]);
  const chars = new Set<string>();
  for (const w of corpus) for (const c of w) chars.add(c);
  const vocab = [...chars].sort();
  const pairFreqs = countPairs(corpus);
  return { corpus, vocab, mergeHistory: [], pairFreqs };
}

function countPairs(corpus: string[][]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const word of corpus) {
    for (let i = 0; i < word.length - 1; i++) {
      const key = word[i] + "|" + word[i + 1];
      freq.set(key, (freq.get(key) || 0) + 1);
    }
  }
  return freq;
}

function bpeStep(state: BPEState): BPEState | null {
  const { corpus, vocab, mergeHistory, pairFreqs } = state;
  if (pairFreqs.size === 0) return null;

  // Find most frequent pair
  let bestPair = "";
  let bestFreq = 0;
  for (const [pair, freq] of pairFreqs) {
    if (freq > bestFreq) {
      bestFreq = freq;
      bestPair = pair;
    }
  }

  const [a, b] = bestPair.split("|");
  const newToken = a + b;

  // Merge in corpus
  const newCorpus = corpus.map((word) => {
    const result: string[] = [];
    let i = 0;
    while (i < word.length) {
      if (i < word.length - 1 && word[i] === a && word[i + 1] === b) {
        result.push(newToken);
        i += 2;
      } else {
        result.push(word[i]);
        i++;
      }
    }
    return result;
  });

  const newVocab = [...vocab, newToken];
  const newPairFreqs = countPairs(newCorpus);
  const newHistory = [
    ...mergeHistory,
    { pair: [a, b] as [string, string], freq: bestFreq, newToken },
  ];

  return {
    corpus: newCorpus,
    vocab: newVocab,
    mergeHistory: newHistory,
    pairFreqs: newPairFreqs,
  };
}

/* ---------- Component ---------- */

const INITIAL_WORDS = ["low", "low", "lower", "newest", "newest", "newest", "widest", "widest"];

const COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

export default function BPEDemo(): React.ReactElement {
  const initial = useMemo(() => initBPE(INITIAL_WORDS), []);
  const [state, setState] = useState<BPEState>(initial);
  const [canStep, setCanStep] = useState(true);

  function handleStep() {
    const next = bpeStep(state);
    if (next) {
      setState(next);
      if (next.pairFreqs.size === 0) setCanStep(false);
    } else {
      setCanStep(false);
    }
  }

  function handleReset() {
    setState(initial);
    setCanStep(true);
  }

  // Sort pair frequencies for display
  const sortedPairs = [...state.pairFreqs.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Deduplicate corpus for display
  const corpusDisplay = useMemo(() => {
    const map = new Map<string, { tokens: string[]; count: number }>();
    for (const word of state.corpus) {
      const key = word.join("|");
      const existing = map.get(key);
      if (existing) {
        existing.count++;
      } else {
        map.set(key, { tokens: [...word], count: 1 });
      }
    }
    return [...map.values()];
  }, [state.corpus]);

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[13px] font-bold text-zinc-300">
          BPE マージ操作デモ
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="rounded-md border border-zinc-600 px-3 py-1 text-[11px] text-zinc-400 hover:bg-zinc-800 transition"
          >
            リセット
          </button>
          <button
            onClick={handleStep}
            disabled={!canStep}
            className={`rounded-md border px-3 py-1 text-[11px] transition ${
              canStep
                ? "border-amber-500 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                : "border-zinc-700 text-zinc-600 cursor-not-allowed"
            }`}
          >
            次のマージ →
          </button>
        </div>
      </div>

      <div className="mb-2 text-[10px] text-zinc-500">
        コーパス: {INITIAL_WORDS.join(", ")} | ステップ: {state.mergeHistory.length}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Corpus state */}
        <div>
          <div className="mb-2 text-[11px] font-bold text-zinc-400">
            現在のコーパス
          </div>
          <div className="space-y-1">
            {corpusDisplay.map((item, i) => (
              <div key={i} className="flex items-center gap-1 flex-wrap">
                <span className="text-[10px] text-zinc-600 w-5 shrink-0">
                  x{item.count}
                </span>
                {item.tokens.map((t, j) => (
                  <span
                    key={j}
                    className="inline-flex rounded border px-1.5 py-0.5 text-[11px] font-mono"
                    style={{
                      borderColor:
                        t.length > 1
                          ? COLORS[
                              state.vocab.indexOf(t) % COLORS.length
                            ] + "66"
                          : "#52525b",
                      backgroundColor:
                        t.length > 1
                          ? COLORS[
                              state.vocab.indexOf(t) % COLORS.length
                            ] + "18"
                          : "transparent",
                      color:
                        t.length > 1
                          ? COLORS[
                              state.vocab.indexOf(t) % COLORS.length
                            ]
                          : "#a1a1aa",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Pair frequencies */}
          <div className="mt-3 mb-2 text-[11px] font-bold text-zinc-400">
            隣接ペア頻度（上位）
          </div>
          {sortedPairs.length > 0 ? (
            <div className="space-y-0.5">
              {sortedPairs.map(([pair, freq], i) => {
                const [a, b] = pair.split("|");
                const isTop = i === 0;
                return (
                  <div key={pair} className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-mono ${
                        isTop ? "text-amber-400 font-bold" : "text-zinc-400"
                      }`}
                    >
                      ({a}, {b})
                    </span>
                    <div
                      className="h-3 rounded-sm"
                      style={{
                        width: `${(freq / sortedPairs[0][1]) * 80}px`,
                        backgroundColor: isTop ? "#f59e0b" : "#52525b",
                      }}
                    />
                    <span
                      className={`text-[10px] ${
                        isTop ? "text-amber-400" : "text-zinc-500"
                      }`}
                    >
                      {freq}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-[10px] text-zinc-600">
              マージ可能なペアがありません
            </div>
          )}
        </div>

        {/* Right: Merge history & Vocabulary */}
        <div>
          <div className="mb-2 text-[11px] font-bold text-zinc-400">
            マージ履歴
          </div>
          {state.mergeHistory.length > 0 ? (
            <div className="space-y-1 mb-4">
              {state.mergeHistory.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-[11px]"
                >
                  <span className="text-zinc-600 w-4 shrink-0">
                    {i + 1}.
                  </span>
                  <span className="font-mono text-zinc-400">
                    {m.pair[0]} + {m.pair[1]}
                  </span>
                  <span className="text-zinc-600">→</span>
                  <span
                    className="font-mono font-bold"
                    style={{
                      color:
                        COLORS[
                          state.vocab.indexOf(m.newToken) % COLORS.length
                        ],
                    }}
                  >
                    {m.newToken}
                  </span>
                  <span className="text-zinc-600 text-[10px]">
                    (頻度: {m.freq})
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-4 text-[10px] text-zinc-600">
              「次のマージ」でステップを進めてください
            </div>
          )}

          <div className="mb-2 text-[11px] font-bold text-zinc-400">
            語彙（{state.vocab.length} tokens）
          </div>
          <div className="flex flex-wrap gap-1">
            {state.vocab.map((v, i) => (
              <span
                key={v}
                className="inline-flex rounded border px-1.5 py-0.5 text-[10px] font-mono"
                style={{
                  borderColor:
                    v.length > 1
                      ? COLORS[i % COLORS.length] + "66"
                      : "#3f3f46",
                  backgroundColor:
                    v.length > 1
                      ? COLORS[i % COLORS.length] + "18"
                      : "transparent",
                  color:
                    v.length > 1
                      ? COLORS[i % COLORS.length]
                      : "#71717a",
                }}
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";

// Small matrices for demonstration (3 queries, 4 keys, dim=2)
const Q_DATA = [
  [1.0, 0.5],
  [0.3, 1.2],
  [0.8, 0.2],
];
const K_DATA = [
  [0.9, 0.4],
  [0.2, 1.1],
  [0.7, 0.3],
  [0.1, 0.8],
];
const V_DATA = [
  [1.0, 0.0],
  [0.0, 1.0],
  [0.5, 0.5],
  [0.3, 0.7],
];

const D_K = 2;

function matmul(a: number[][], b: number[][]): number[][] {
  const rows = a.length;
  const cols = b[0].length;
  const inner = b.length;
  const result: number[][] = [];
  for (let i = 0; i < rows; i++) {
    result[i] = [];
    for (let j = 0; j < cols; j++) {
      let sum = 0;
      for (let k = 0; k < inner; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function transpose(m: number[][]): number[][] {
  const rows = m.length;
  const cols = m[0].length;
  const result: number[][] = [];
  for (let j = 0; j < cols; j++) {
    result[j] = [];
    for (let i = 0; i < rows; i++) {
      result[j][i] = m[i][j];
    }
  }
  return result;
}

function scaleMatrix(m: number[][], s: number): number[][] {
  return m.map((row) => row.map((v) => v / s));
}

function softmaxRows(m: number[][]): number[][] {
  return m.map((row) => {
    const maxVal = Math.max(...row);
    const exps = row.map((v) => Math.exp(v - maxVal));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
  });
}

const STEPS = [
  { label: "Q × K^T", desc: "QueryとKeyのドット積 → スコア行列" },
  { label: "/ √d_k", desc: "√d_k で割ってスケーリング" },
  { label: "softmax", desc: "行ごとにSoftmax → Attention重み" },
  { label: "× V", desc: "重み付き平均 → 最終出力" },
];

function MatrixDisplay({
  data,
  title,
  highlight,
  colorFn,
}: {
  data: number[][];
  title: string;
  highlight?: boolean;
  colorFn?: (v: number) => string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-[10px] text-zinc-500 mb-1 font-medium">{title}</div>
      <div
        className={`border rounded-lg p-1.5 ${
          highlight
            ? "border-amber-500/60 bg-amber-500/5"
            : "border-zinc-700 bg-zinc-800/40"
        } transition-all duration-300`}
      >
        <table className="border-collapse">
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {row.map((v, j) => (
                  <td
                    key={j}
                    className="px-1.5 py-0.5 text-center font-mono text-[11px] transition-colors duration-300"
                    style={{
                      color: colorFn ? colorFn(v) : "#d4d4d8",
                    }}
                  >
                    {v.toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AttentionCalc() {
  const [step, setStep] = useState(0);

  const kT = useMemo(() => transpose(K_DATA), []);
  const qkT = useMemo(() => matmul(Q_DATA, kT), [kT]);
  const scaled = useMemo(() => scaleMatrix(qkT, Math.sqrt(D_K)), [qkT]);
  const weights = useMemo(() => softmaxRows(scaled), [scaled]);
  const output = useMemo(() => matmul(weights, V_DATA), [weights]);

  const heatColor = (v: number) => {
    const t = Math.min(Math.max(v, 0), 1);
    const r = Math.round(251 * t + 113 * (1 - t));
    const g = Math.round(191 * t + 113 * (1 - t));
    const b = Math.round(36 * t + 122 * (1 - t));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const scoreColor = (v: number) => {
    if (v > 1) return "#fbbf24";
    if (v > 0.5) return "#d4d4d8";
    return "#a1a1aa";
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Step navigation */}
      <div className="flex justify-center gap-2">
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`px-3 py-1.5 text-[11px] font-medium rounded-md border transition-colors ${
              step === i
                ? "bg-amber-500/20 border-amber-500 text-amber-400"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      {/* Step description */}
      <div className="text-center text-sm text-zinc-300">
        <span className="text-amber-400 font-medium">
          ステップ {step + 1}:
        </span>{" "}
        {STEPS[step].desc}
      </div>

      {/* Matrices */}
      <div className="flex flex-wrap justify-center items-start gap-4">
        {/* Input matrices - always show */}
        <MatrixDisplay data={Q_DATA} title="Q (3×2)" highlight={step === 0} />

        {step === 0 && (
          <>
            <div className="self-center text-zinc-500 text-lg">×</div>
            <MatrixDisplay data={kT} title="K^T (2×4)" highlight />
            <div className="self-center text-zinc-500 text-lg">=</div>
            <MatrixDisplay
              data={qkT}
              title="QK^T (3×4)"
              highlight
              colorFn={scoreColor}
            />
          </>
        )}

        {step === 1 && (
          <>
            <MatrixDisplay data={qkT} title="QK^T (3×4)" />
            <div className="self-center text-zinc-500 text-lg">
              / √{D_K}
            </div>
            <div className="self-center text-zinc-500 text-lg">=</div>
            <MatrixDisplay
              data={scaled}
              title="Scaled (3×4)"
              highlight
              colorFn={scoreColor}
            />
          </>
        )}

        {step === 2 && (
          <>
            <MatrixDisplay data={scaled} title="Scaled (3×4)" />
            <div className="self-center text-zinc-500 text-sm font-medium">
              softmax→
            </div>
            <MatrixDisplay
              data={weights}
              title="Weights (3×4)"
              highlight
              colorFn={heatColor}
            />
          </>
        )}

        {step === 3 && (
          <>
            <MatrixDisplay
              data={weights}
              title="Weights (3×4)"
              colorFn={heatColor}
            />
            <div className="self-center text-zinc-500 text-lg">×</div>
            <MatrixDisplay data={V_DATA} title="V (4×2)" highlight />
            <div className="self-center text-zinc-500 text-lg">=</div>
            <MatrixDisplay
              data={output}
              title="Output (3×2)"
              highlight
              colorFn={scoreColor}
            />
          </>
        )}
      </div>

      {/* Step insight */}
      <div className="text-center text-sm text-zinc-300 bg-zinc-800/60 rounded-lg py-3 px-4">
        {step === 0 && (
          <span>
            各Queryと全Keyのドット積を計算。
            <span className="text-amber-400">
              値が大きいほど「関連が強い」
            </span>
            ペア
          </span>
        )}
        {step === 1 && (
          <span>
            $\sqrt{"{d_k}"}$ = {Math.sqrt(D_K).toFixed(2)} で割って
            <span className="text-amber-400">スコアの大きさを調整</span>
            。Softmaxが極端にならないように
          </span>
        )}
        {step === 2 && (
          <span>
            各行が合計1の確率分布に。
            <span className="text-amber-400">
              明るいセルほど強くAttend
            </span>
            している
          </span>
        )}
        {step === 3 && (
          <span>
            Attention重みでValueを重み付け平均。
            <span className="text-amber-400">
              注目した情報を集約した最終出力
            </span>
          </span>
        )}
      </div>

      {/* Formula reminder */}
      <div className="text-center text-xs text-zinc-500 font-mono">
        Attention(Q, K, V) = softmax(QK<sup>T</sup> / √d<sub>k</sub>) · V
      </div>
    </div>
  );
}

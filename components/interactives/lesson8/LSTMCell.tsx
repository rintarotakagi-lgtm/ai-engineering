"use client";

import { useState, useMemo } from "react";

const SVG_W = 620;
const SVG_H = 400;

// LSTM gate computations
function sig(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function tanhFn(x: number) {
  return Math.tanh(x);
}

type GateState = {
  forgetGate: number;
  inputGate: number;
  candidateCell: number;
  outputGate: number;
  cellState: number;
  hiddenState: number;
};

function computeLSTM(
  x: number,
  hPrev: number,
  cPrev: number,
  wf: number,
  wi: number,
  wc: number,
  wo: number
): GateState {
  const combined = x + hPrev;
  const forgetGate = sig(wf * combined);
  const inputGate = sig(wi * combined);
  const candidateCell = tanhFn(wc * combined);
  const outputGate = sig(wo * combined);
  const cellState = forgetGate * cPrev + inputGate * candidateCell;
  const hiddenState = outputGate * tanhFn(cellState);
  return { forgetGate, inputGate, candidateCell, outputGate, cellState, hiddenState };
}

const SAMPLE_SEQUENCE = [0.5, -0.3, 0.8, -0.1, 0.6];

export default function LSTMCell() {
  const [step, setStep] = useState(0);
  const [showDiagram, setShowDiagram] = useState(true);

  // Simple weights
  const wf = 1.2;
  const wi = 1.0;
  const wc = 0.8;
  const wo = 1.1;

  // Run through sequence up to current step
  const history = useMemo(() => {
    const states: (GateState & { x: number; cPrev: number; hPrev: number })[] = [];
    let h = 0;
    let c = 0;
    for (let t = 0; t < SAMPLE_SEQUENCE.length; t++) {
      const x = SAMPLE_SEQUENCE[t];
      const result = computeLSTM(x, h, c, wf, wi, wc, wo);
      states.push({ ...result, x, cPrev: c, hPrev: h });
      h = result.hiddenState;
      c = result.cellState;
    }
    return states;
  }, []);

  const current = history[step];

  // Gate visualization positions
  const gateY = 200;
  const gateR = 26;
  const gatePositions = [
    { x: 120, label: "忘却", key: "forgetGate" as const, color: "#ef4444" },
    { x: 240, label: "入力", key: "inputGate" as const, color: "#22c55e" },
    { x: 360, label: "候補", key: "candidateCell" as const, color: "#3b82f6" },
    { x: 500, label: "出力", key: "outputGate" as const, color: "#a855f7" },
  ];

  const getGateValue = (key: string): number => {
    if (key === "forgetGate") return current.forgetGate;
    if (key === "inputGate") return current.inputGate;
    if (key === "candidateCell") return current.candidateCell;
    if (key === "outputGate") return current.outputGate;
    return 0;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Controls */}
      <div className="flex gap-2 justify-center flex-wrap items-center">
        <div className="flex gap-1">
          {SAMPLE_SEQUENCE.map((x, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`px-2 py-1 text-xs font-mono rounded-md border transition-colors ${
                step === i
                  ? "bg-amber-500/20 border-amber-500 text-amber-400"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              t={i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowDiagram((d) => !d)}
          className="px-3 py-1 text-xs font-medium rounded-md border bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500 transition-colors"
        >
          {showDiagram ? "数値表示" : "図表示"}
        </button>
      </div>

      {showDiagram ? (
        /* ---------- DIAGRAM VIEW ---------- */
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Cell state line (top) */}
          <line
            x1={30}
            y1={70}
            x2={SVG_W - 30}
            y2={70}
            stroke="#fbbf24"
            strokeWidth={3}
            opacity={0.6}
          />
          <text
            x={SVG_W / 2}
            y={50}
            textAnchor="middle"
            className="text-[11px] fill-amber-400 font-bold"
          >
            セル状態 C_t = {current.cellState.toFixed(3)}
          </text>

          {/* Forget gate influence on cell state */}
          <line
            x1={120}
            y1={70}
            x2={120}
            y2={gateY - gateR - 4}
            stroke="#ef4444"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            opacity={0.5}
          />
          <text
            x={100}
            y={86}
            textAnchor="middle"
            className="text-[8px] fill-zinc-500"
          >
            ×
          </text>

          {/* Input gate influence */}
          <line
            x1={240}
            y1={70}
            x2={240}
            y2={gateY - gateR - 4}
            stroke="#22c55e"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            opacity={0.5}
          />
          <text
            x={270}
            y={86}
            textAnchor="middle"
            className="text-[8px] fill-zinc-500"
          >
            +
          </text>

          {/* Candidate contribution */}
          <line
            x1={360}
            y1={gateY - gateR - 4}
            x2={290}
            y2={100}
            stroke="#3b82f6"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            opacity={0.4}
          />

          {/* Output gate to hidden */}
          <line
            x1={500}
            y1={gateY + gateR + 4}
            x2={500}
            y2={340}
            stroke="#a855f7"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            opacity={0.5}
          />

          {/* Gates */}
          {gatePositions.map(({ x, label, key, color }) => {
            const val = getGateValue(key);
            const fillOpacity = Math.abs(val) * 0.7 + 0.15;
            return (
              <g key={key}>
                <circle
                  cx={x}
                  cy={gateY}
                  r={gateR}
                  fill={color}
                  opacity={fillOpacity}
                  stroke={color}
                  strokeWidth={2}
                  className="transition-all duration-300"
                />
                <text
                  x={x}
                  y={gateY - 4}
                  textAnchor="middle"
                  className="text-[10px] fill-white font-bold"
                >
                  {label}
                </text>
                <text
                  x={x}
                  y={gateY + 10}
                  textAnchor="middle"
                  className="text-[9px] fill-white/80 font-mono"
                >
                  {val.toFixed(3)}
                </text>
                {/* Gate function label */}
                <text
                  x={x}
                  y={gateY + gateR + 16}
                  textAnchor="middle"
                  className="text-[8px] fill-zinc-500"
                >
                  {key === "candidateCell" ? "tanh" : "sigmoid"}
                </text>
              </g>
            );
          })}

          {/* Input */}
          <g>
            <rect
              x={SVG_W / 2 - 50}
              y={290}
              width={100}
              height={30}
              rx={6}
              fill="#3f3f46"
              stroke="#71717a"
              strokeWidth={1.5}
            />
            <text
              x={SVG_W / 2}
              y={309}
              textAnchor="middle"
              className="text-[10px] fill-zinc-300 font-medium"
            >
              入力: x={current.x.toFixed(1)}, h={current.hPrev.toFixed(3)}
            </text>
            {/* Arrows from input to gates */}
            {gatePositions.map(({ x, key }) => (
              <line
                key={`in-${key}`}
                x1={SVG_W / 2}
                y1={290}
                x2={x}
                y2={gateY + gateR + 22}
                stroke="#52525b"
                strokeWidth={0.8}
                opacity={0.4}
              />
            ))}
          </g>

          {/* Hidden state output */}
          <g>
            <rect
              x={430}
              y={340}
              width={140}
              height={30}
              rx={6}
              fill="#f59e0b"
              opacity={0.2}
              stroke="#f59e0b"
              strokeWidth={1.5}
            />
            <text
              x={500}
              y={359}
              textAnchor="middle"
              className="text-[10px] fill-amber-400 font-bold"
            >
              h_t = {current.hiddenState.toFixed(3)}
            </text>
          </g>

          {/* Previous cell state label */}
          <text
            x={40}
            y={65}
            textAnchor="start"
            className="text-[9px] fill-zinc-500"
          >
            C_{"{t-1}"} = {current.cPrev.toFixed(3)}
          </text>
        </svg>
      ) : (
        /* ---------- NUMERIC TABLE VIEW ---------- */
        <div className="bg-zinc-900 rounded-xl border border-zinc-700/50 p-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-zinc-400 border-b border-zinc-700">
                <th className="py-2 text-left">項目</th>
                <th className="py-2 text-right">値</th>
                <th className="py-2 text-left pl-4">説明</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-1.5 font-medium">入力 x_t</td>
                <td className="py-1.5 text-right font-mono text-amber-400">
                  {current.x.toFixed(3)}
                </td>
                <td className="py-1.5 pl-4 text-zinc-500">
                  現在のタイムステップの入力
                </td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-1.5 font-medium text-red-400">忘却ゲート f_t</td>
                <td className="py-1.5 text-right font-mono">
                  {current.forgetGate.toFixed(3)}
                </td>
                <td className="py-1.5 pl-4 text-zinc-500">
                  前のセル状態をどれだけ保持するか
                </td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-1.5 font-medium text-green-400">入力ゲート i_t</td>
                <td className="py-1.5 text-right font-mono">
                  {current.inputGate.toFixed(3)}
                </td>
                <td className="py-1.5 pl-4 text-zinc-500">
                  新しい情報をどれだけ書き込むか
                </td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-1.5 font-medium text-blue-400">候補セル C~_t</td>
                <td className="py-1.5 text-right font-mono">
                  {current.candidateCell.toFixed(3)}
                </td>
                <td className="py-1.5 pl-4 text-zinc-500">書き込む候補の値</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-1.5 font-medium text-purple-400">出力ゲート o_t</td>
                <td className="py-1.5 text-right font-mono">
                  {current.outputGate.toFixed(3)}
                </td>
                <td className="py-1.5 pl-4 text-zinc-500">
                  セル状態のどれだけを出力するか
                </td>
              </tr>
              <tr className="border-b border-zinc-800 bg-zinc-800/40">
                <td className="py-1.5 font-bold text-amber-400">セル状態 C_t</td>
                <td className="py-1.5 text-right font-mono text-amber-400">
                  {current.cellState.toFixed(3)}
                </td>
                <td className="py-1.5 pl-4 text-zinc-500">
                  f_t × C_{"{t-1}"} + i_t × C~_t
                </td>
              </tr>
              <tr className="bg-zinc-800/40">
                <td className="py-1.5 font-bold text-amber-400">隠れ状態 h_t</td>
                <td className="py-1.5 text-right font-mono text-amber-400">
                  {current.hiddenState.toFixed(3)}
                </td>
                <td className="py-1.5 pl-4 text-zinc-500">
                  o_t × tanh(C_t)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Step indicator + mini chart */}
      <div className="flex items-center gap-3 justify-center">
        <div className="flex gap-1 items-end h-12">
          {history.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div
                className={`w-5 rounded-sm transition-all duration-300 ${
                  i <= step ? "bg-amber-500/70" : "bg-zinc-700"
                }`}
                style={{
                  height: `${Math.max(4, Math.abs(s.cellState) * 30)}px`,
                }}
              />
              <span className="text-[7px] text-zinc-500">{i + 1}</span>
            </div>
          ))}
        </div>
        <div className="text-xs text-zinc-400">
          <div>
            C: <span className="text-amber-400 font-mono">{current.cellState.toFixed(3)}</span>
          </div>
          <div>
            h: <span className="text-amber-400 font-mono">{current.hiddenState.toFixed(3)}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-500 text-center">
        各タイムステップのボタンをクリックして、ゲートの値がどう変化するか確認しましょう。
        セル状態 C_t が長期記憶、隠れ状態 h_t が短期出力に対応します。
      </p>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";

const TOKENS = ["今日", "の", "天気", "は", "晴れ", "です"];
const SVG_W = 560;
const SVG_H = 340;
const CELL = 44;
const MASK_START_X = 130;
const MASK_START_Y = 100;

export default function AutoregressiveDemo() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const n = TOKENS.length;

  const advance = useCallback(() => {
    setStep((prev) => {
      if (prev >= n) {
        setIsPlaying(false);
        return n;
      }
      return prev + 1;
    });
  }, [n]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(advance, 900);
    return () => clearInterval(timer);
  }, [isPlaying, advance]);

  function handlePlay() {
    if (step >= n) {
      setStep(0);
      setTimeout(() => setIsPlaying(true), 100);
    } else {
      setIsPlaying(true);
    }
  }

  function handleReset() {
    setIsPlaying(false);
    setStep(0);
  }

  /* Causal mask matrix */
  function maskValue(row: number, col: number): boolean {
    return col <= row;
  }

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      {/* Controls */}
      <div className="mb-3 flex items-center gap-3 text-xs">
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className="rounded-md border border-amber-600 bg-amber-500/10 px-4 py-1.5 text-amber-400 hover:bg-amber-500/20 transition disabled:opacity-40"
        >
          {step >= n ? "最初から" : "生成開始"}
        </button>
        <button
          onClick={() => setIsPlaying(false)}
          disabled={!isPlaying}
          className="rounded-md border border-zinc-600 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800 transition disabled:opacity-40"
        >
          停止
        </button>
        <button
          onClick={handleReset}
          className="rounded-md border border-zinc-600 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800 transition"
        >
          リセット
        </button>
        <span className="ml-auto text-zinc-500">
          ステップ: {step} / {n}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Generated tokens */}
        <text x={20} y={36} className="text-[12px] fill-zinc-400 font-bold">
          生成されたテキスト:
        </text>
        <g>
          {TOKENS.map((t, i) => {
            const x = 20 + i * 70;
            const visible = i < step;
            const isCurrent = i === step - 1;
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={46}
                  width={60}
                  height={28}
                  rx={6}
                  fill={
                    isCurrent
                      ? "#f59e0b"
                      : visible
                      ? "#3f3f46"
                      : "#1c1c1e"
                  }
                  stroke={
                    isCurrent
                      ? "#fbbf24"
                      : visible
                      ? "#52525b"
                      : "#27272a"
                  }
                  strokeWidth={isCurrent ? 2 : 1}
                  className="transition-all duration-300"
                />
                <text
                  x={x + 30}
                  y={64}
                  textAnchor="middle"
                  className={`text-[11px] font-bold select-none transition-all duration-300 ${
                    visible ? "fill-white" : "fill-zinc-700"
                  }`}
                >
                  {visible ? t : "?"}
                </text>
              </g>
            );
          })}
        </g>

        {/* Causal mask matrix */}
        <text
          x={MASK_START_X + (n * CELL) / 2}
          y={MASK_START_Y - 8}
          textAnchor="middle"
          className="text-[11px] fill-zinc-400 font-bold"
        >
          因果マスク（Causal Mask）
        </text>

        {/* Column headers (Key) */}
        {TOKENS.map((t, col) => (
          <text
            key={`col-${col}`}
            x={MASK_START_X + col * CELL + CELL / 2}
            y={MASK_START_Y + 10}
            textAnchor="middle"
            className="text-[9px] fill-zinc-500 select-none"
          >
            {t}
          </text>
        ))}

        {/* Row headers (Query) */}
        {TOKENS.map((t, row) => (
          <text
            key={`row-${row}`}
            x={MASK_START_X - 6}
            y={MASK_START_Y + 20 + row * CELL + CELL / 2 + 3}
            textAnchor="end"
            className="text-[9px] fill-zinc-500 select-none"
          >
            {t}
          </text>
        ))}

        {/* Mask cells */}
        {TOKENS.map((_, row) =>
          TOKENS.map((_, col) => {
            const allowed = maskValue(row, col);
            const isActiveRow = row === step - 1;
            const isActiveCell = isActiveRow && allowed;
            const x = MASK_START_X + col * CELL;
            const y = MASK_START_Y + 20 + row * CELL;
            return (
              <g key={`${row}-${col}`}>
                <rect
                  x={x + 1}
                  y={y + 1}
                  width={CELL - 2}
                  height={CELL - 2}
                  rx={4}
                  fill={
                    isActiveCell
                      ? "#f59e0b"
                      : allowed
                      ? "#3f3f46"
                      : "#18181b"
                  }
                  stroke={
                    isActiveCell
                      ? "#fbbf24"
                      : allowed
                      ? "#52525b"
                      : "#27272a"
                  }
                  strokeWidth={1}
                  className="transition-all duration-300"
                />
                <text
                  x={x + CELL / 2}
                  y={y + CELL / 2 + 4}
                  textAnchor="middle"
                  className={`text-[10px] select-none ${
                    isActiveCell
                      ? "fill-black font-bold"
                      : allowed
                      ? "fill-zinc-300"
                      : "fill-zinc-700"
                  }`}
                >
                  {allowed ? "✓" : "✗"}
                </text>
              </g>
            );
          })
        )}

        {/* Labels */}
        <text
          x={MASK_START_X + (n * CELL) / 2}
          y={MASK_START_Y + 20 + n * CELL + 18}
          textAnchor="middle"
          className="text-[9px] fill-zinc-600"
        >
          Key（参照先）
        </text>
        <text
          x={MASK_START_X - 24}
          y={MASK_START_Y + 20 + (n * CELL) / 2}
          textAnchor="middle"
          className="text-[9px] fill-zinc-600"
          transform={`rotate(-90, ${MASK_START_X - 24}, ${
            MASK_START_Y + 20 + (n * CELL) / 2
          })`}
        >
          Query（予測元）
        </text>

        {/* Explanation */}
        {step > 0 && step <= n && (
          <text
            x={SVG_W / 2}
            y={SVG_H - 12}
            textAnchor="middle"
            className="text-[11px] fill-amber-400"
          >
            「{TOKENS.slice(0, step - 1).join("")}」→ 次のトークン「
            {TOKENS[step - 1]}」を予測
          </text>
        )}
        {step === 0 && (
          <text
            x={SVG_W / 2}
            y={SVG_H - 12}
            textAnchor="middle"
            className="text-[11px] fill-zinc-600"
          >
            「生成開始」を押すと、GPTが1トークンずつ生成します
          </text>
        )}
      </svg>
    </div>
  );
}

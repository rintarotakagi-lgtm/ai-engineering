"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";

// --- SVG constants ---
const SVG_W = 480;
const SVG_H = 300;
const PAD = 40;

const X_MIN = -3;
const X_MAX = 3;
const Y_MIN = -2;
const Y_MAX = 2;

function toSx(x: number) {
  return PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (SVG_W - 2 * PAD);
}
function toSy(y: number) {
  return SVG_H - PAD - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (SVG_H - 2 * PAD);
}

// --- Target functions ---
type TargetName = "sine" | "step" | "complex";

const TARGETS: { name: TargetName; label: string; fn: (x: number) => number }[] = [
  { name: "sine", label: "sin(x)", fn: (x) => Math.sin(x) },
  {
    name: "step",
    label: "矩形波",
    fn: (x) => (Math.sin(x) > 0 ? 1 : -1) * 0.8,
  },
  {
    name: "complex",
    label: "複雑な関数",
    fn: (x) => 0.5 * Math.sin(2 * x) + 0.3 * Math.cos(3 * x) + 0.2 * Math.sin(5 * x),
  },
];

const NUM_POINTS = 200;

// --- Seeded random ---
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Simple 1-hidden-layer network for 1D regression ---
type Weights = {
  wH: number[]; // hidden weights (1 input per neuron)
  bH: number[]; // hidden biases
  wO: number[]; // output weights
  bO: number; // output bias
};

function initWeights(neurons: number, seed: number): Weights {
  const rng = mulberry32(seed);
  const wH: number[] = [];
  const bH: number[] = [];
  const wO: number[] = [];

  for (let i = 0; i < neurons; i++) {
    wH.push((rng() * 2 - 1) * 2);
    bH.push((rng() * 2 - 1) * 2);
    wO.push((rng() * 2 - 1) * 0.5);
  }

  return { wH, bH, wO, bO: (rng() - 0.5) * 0.1 };
}

function relu(x: number) {
  return Math.max(0, x);
}

function predict(x: number, w: Weights): number {
  let sum = w.bO;
  for (let i = 0; i < w.wH.length; i++) {
    sum += w.wO[i] * relu(w.wH[i] * x + w.bH[i]);
  }
  return sum;
}

// Generate training data from target function
function genTrainData(fn: (x: number) => number, n: number): { x: number; y: number }[] {
  const data: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = X_MIN + (i / (n - 1)) * (X_MAX - X_MIN);
    data.push({ x, y: fn(x) });
  }
  return data;
}

// Train one step using numerical gradient
function trainStep(w: Weights, data: { x: number; y: number }[], lr: number): Weights {
  const eps = 0.001;
  const n = w.wH.length;

  function mse(weights: Weights): number {
    let total = 0;
    for (const d of data) {
      const diff = predict(d.x, weights) - d.y;
      total += diff * diff;
    }
    return total / data.length;
  }

  const newW: Weights = {
    wH: [...w.wH],
    bH: [...w.bH],
    wO: [...w.wO],
    bO: w.bO,
  };

  // Gradient for each parameter
  for (let i = 0; i < n; i++) {
    // wH[i]
    const origWH = newW.wH[i];
    newW.wH[i] = origWH + eps;
    const lp1 = mse(newW);
    newW.wH[i] = origWH - eps;
    const lm1 = mse(newW);
    newW.wH[i] = origWH - lr * (lp1 - lm1) / (2 * eps);

    // bH[i]
    const origBH = newW.bH[i];
    newW.bH[i] = origBH + eps;
    const lp2 = mse(newW);
    newW.bH[i] = origBH - eps;
    const lm2 = mse(newW);
    newW.bH[i] = origBH - lr * (lp2 - lm2) / (2 * eps);

    // wO[i]
    const origWO = newW.wO[i];
    newW.wO[i] = origWO + eps;
    const lp3 = mse(newW);
    newW.wO[i] = origWO - eps;
    const lm3 = mse(newW);
    newW.wO[i] = origWO - lr * (lp3 - lm3) / (2 * eps);
  }

  // bO
  const origBO = newW.bO;
  newW.bO = origBO + eps;
  const lp4 = mse(newW);
  newW.bO = origBO - eps;
  const lm4 = mse(newW);
  newW.bO = origBO - lr * (lp4 - lm4) / (2 * eps);

  return newW;
}

function buildPath(fn: (x: number) => number): string {
  const parts: string[] = [];
  for (let i = 0; i <= NUM_POINTS; i++) {
    const x = X_MIN + (i / NUM_POINTS) * (X_MAX - X_MIN);
    const y = Math.max(Y_MIN, Math.min(Y_MAX, fn(x)));
    parts.push(`${i === 0 ? "M" : "L"}${toSx(x).toFixed(1)},${toSy(y).toFixed(1)}`);
  }
  return parts.join(" ");
}

export default function UniversalApprox() {
  const [target, setTarget] = useState<TargetName>("sine");
  const [neurons, setNeurons] = useState(4);
  const [epoch, setEpoch] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [seed, setSeed] = useState(42);
  const weightsRef = useRef<Weights>(initWeights(neurons, seed));
  const animRef = useRef<number>(0);

  const targetFn = TARGETS.find((t) => t.name === target)!.fn;
  const trainData = useMemo(() => genTrainData(targetFn, 50), [targetFn]);

  // Reset when neurons or target changes
  useEffect(() => {
    cancelAnimationFrame(animRef.current);
    setIsTraining(false);
    weightsRef.current = initWeights(neurons, seed);
    setEpoch(0);
  }, [neurons, target, seed]);

  // Build predicted path
  const predPath = useMemo(() => {
    return buildPath((x) => predict(x, weightsRef.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epoch, neurons]);

  const targetPath = useMemo(() => buildPath(targetFn), [targetFn]);

  // MSE
  const mse = useMemo(() => {
    let total = 0;
    for (const d of trainData) {
      const diff = predict(d.x, weightsRef.current) - d.y;
      total += diff * diff;
    }
    return total / trainData.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epoch, trainData]);

  const train = useCallback(() => {
    let localEpoch = epoch;
    function step() {
      for (let i = 0; i < 5; i++) {
        weightsRef.current = trainStep(weightsRef.current, trainData, 0.01);
        localEpoch++;
      }
      setEpoch(localEpoch);
      if (localEpoch < 2000) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setIsTraining(false);
      }
    }
    setIsTraining(true);
    animRef.current = requestAnimationFrame(step);
  }, [epoch, trainData]);

  const reset = () => {
    cancelAnimationFrame(animRef.current);
    setIsTraining(false);
    setSeed((s) => s + 1);
  };

  const xTicks = [-3, -2, -1, 0, 1, 2, 3];
  const yTicks = [-2, -1, 0, 1, 2];

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Target selector */}
      <div className="flex gap-2 justify-center flex-wrap">
        {TARGETS.map((t) => (
          <button
            key={t.name}
            onClick={() => setTarget(t.name)}
            className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
              target === t.name
                ? "bg-amber-500/20 border-amber-500 text-amber-400"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid */}
        {xTicks.map((x) => (
          <line key={`gx-${x}`} x1={toSx(x)} y1={toSy(Y_MIN)} x2={toSx(x)} y2={toSy(Y_MAX)} stroke="#3f3f46" strokeWidth={x === 0 ? 1 : 0.5} />
        ))}
        {yTicks.map((y) => (
          <line key={`gy-${y}`} x1={toSx(X_MIN)} y1={toSy(y)} x2={toSx(X_MAX)} y2={toSy(y)} stroke="#3f3f46" strokeWidth={y === 0 ? 1 : 0.5} />
        ))}

        {/* Tick labels */}
        {xTicks.map((x) => (
          <text key={`lx-${x}`} x={toSx(x)} y={SVG_H - PAD + 14} textAnchor="middle" className="text-[10px] fill-zinc-500">{x}</text>
        ))}
        {yTicks.map((y) => (
          <text key={`ly-${y}`} x={PAD - 6} y={toSy(y) + 3} textAnchor="end" className="text-[10px] fill-zinc-500">{y}</text>
        ))}

        {/* Target function */}
        <path d={targetPath} fill="none" stroke="#71717a" strokeWidth={2} strokeDasharray="6 4" />

        {/* NN prediction */}
        <path d={predPath} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" />

        {/* Legend */}
        <line x1={SVG_W - 140} y1={18} x2={SVG_W - 120} y2={18} stroke="#71717a" strokeWidth={2} strokeDasharray="4 3" />
        <text x={SVG_W - 116} y={22} className="text-[10px] fill-zinc-500">目標関数</text>
        <line x1={SVG_W - 140} y1={34} x2={SVG_W - 120} y2={34} stroke="#f59e0b" strokeWidth={2} />
        <text x={SVG_W - 116} y={38} className="text-[10px] fill-amber-400">NN予測</text>
      </svg>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-400">
              隠れ層ニューロン数
            </label>
            <span className="text-xs font-mono text-amber-400">{neurons}</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={neurons}
            onChange={(e) => setNeurons(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={isTraining ? () => { cancelAnimationFrame(animRef.current); setIsTraining(false); } : train}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              isTraining
                ? "bg-red-500/20 border-red-500 text-red-400"
                : "bg-amber-500/20 border-amber-500 text-amber-400 hover:bg-amber-500/30"
            }`}
          >
            {isTraining ? "停止" : "学習開始"}
          </button>
          <button
            onClick={reset}
            className="px-3 py-1.5 text-xs font-medium rounded-md border bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
          >
            リセット
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6 text-xs">
        <span className="text-zinc-500">
          Epoch: <span className="text-zinc-300 font-mono">{epoch}</span>
        </span>
        <span className="text-zinc-500">
          MSE: <span className="text-amber-400 font-mono">{mse.toFixed(4)}</span>
        </span>
        <span className="text-zinc-500">
          パラメータ数: <span className="text-zinc-300 font-mono">{neurons * 3 + 1}</span>
        </span>
      </div>
    </div>
  );
}

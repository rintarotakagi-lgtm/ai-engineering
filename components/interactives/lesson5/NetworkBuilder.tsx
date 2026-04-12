"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";

// --- SVG constants ---
const PLOT_W = 280;
const PLOT_H = 280;
const PAD = 30;

const D_MIN = -3;
const D_MAX = 3;

function toSx(v: number) {
  return PAD + ((v - D_MIN) / (D_MAX - D_MIN)) * (PLOT_W - 2 * PAD);
}
function toSy(v: number) {
  return PLOT_H - PAD - ((v - D_MIN) / (D_MAX - D_MIN)) * (PLOT_H - 2 * PAD);
}

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

// --- Data generation ---
type DataPoint = { x1: number; x2: number; label: number };

type DatasetName = "circles" | "moons" | "spiral";

function generateData(name: DatasetName, n: number = 100, seed: number = 42): DataPoint[] {
  const rng = mulberry32(seed);
  const data: DataPoint[] = [];

  if (name === "circles") {
    for (let i = 0; i < n; i++) {
      const label = i < n / 2 ? 0 : 1;
      const r = label === 0 ? 1.0 + rng() * 0.4 : 2.2 + rng() * 0.4;
      const theta = rng() * 2 * Math.PI;
      data.push({ x1: r * Math.cos(theta), x2: r * Math.sin(theta), label });
    }
  } else if (name === "moons") {
    for (let i = 0; i < n; i++) {
      const label = i < n / 2 ? 0 : 1;
      const theta = (i / (n / 2)) * Math.PI;
      if (label === 0) {
        data.push({
          x1: Math.cos(theta) * 2 + (rng() - 0.5) * 0.4,
          x2: Math.sin(theta) * 2 + (rng() - 0.5) * 0.4,
          label: 0,
        });
      } else {
        data.push({
          x1: 1 - Math.cos(theta) * 2 + (rng() - 0.5) * 0.4,
          x2: -Math.sin(theta) * 2 + 0.5 + (rng() - 0.5) * 0.4,
          label: 1,
        });
      }
    }
  } else {
    // spiral
    for (let i = 0; i < n; i++) {
      const label = i < n / 2 ? 0 : 1;
      const idx = i % (n / 2);
      const r = (idx / (n / 2)) * 2.5 + 0.3;
      const theta = (idx / (n / 2)) * 3 * Math.PI + label * Math.PI;
      data.push({
        x1: r * Math.cos(theta) + (rng() - 0.5) * 0.3,
        x2: r * Math.sin(theta) + (rng() - 0.5) * 0.3,
        label,
      });
    }
  }
  return data;
}

// --- Simple neural network (forward pass with random weights) ---
function relu(x: number) {
  return Math.max(0, x);
}

function sigmoidFn(x: number) {
  return 1 / (1 + Math.exp(-x));
}

type NetworkWeights = {
  layers: { w: number[][]; b: number[] }[];
};

function initWeights(
  inputSize: number,
  hiddenSizes: number[],
  outputSize: number,
  seed: number
): NetworkWeights {
  const rng = mulberry32(seed);
  const layers: { w: number[][]; b: number[] }[] = [];
  let prevSize = inputSize;

  for (const size of hiddenSizes) {
    const scale = Math.sqrt(2 / prevSize);
    const w: number[][] = [];
    const b: number[] = [];
    for (let j = 0; j < size; j++) {
      const row: number[] = [];
      for (let i = 0; i < prevSize; i++) {
        row.push((rng() * 2 - 1) * scale);
      }
      w.push(row);
      b.push((rng() - 0.5) * 0.1);
    }
    layers.push({ w, b });
    prevSize = size;
  }

  // Output layer
  const scale = Math.sqrt(2 / prevSize);
  const w: number[][] = [];
  const bArr: number[] = [];
  for (let j = 0; j < outputSize; j++) {
    const row: number[] = [];
    for (let i = 0; i < prevSize; i++) {
      row.push((rng() * 2 - 1) * scale);
    }
    w.push(row);
    bArr.push((rng() - 0.5) * 0.1);
  }
  layers.push({ w, b: bArr });

  return { layers };
}

function forward(input: number[], net: NetworkWeights): number {
  let h = input;
  for (let l = 0; l < net.layers.length; l++) {
    const layer = net.layers[l];
    const isLast = l === net.layers.length - 1;
    const newH: number[] = [];
    for (let j = 0; j < layer.w.length; j++) {
      let sum = layer.b[j];
      for (let i = 0; i < h.length; i++) {
        sum += layer.w[j][i] * h[i];
      }
      newH.push(isLast ? sigmoidFn(sum) : relu(sum));
    }
    h = newH;
  }
  return h[0];
}

// --- Simple SGD training ---
function trainStep(
  net: NetworkWeights,
  data: DataPoint[],
  lr: number
): NetworkWeights {
  // Numerical gradient (simple but workable for demo)
  const eps = 0.001;
  const newLayers = net.layers.map((layer) => ({
    w: layer.w.map((row) => [...row]),
    b: [...layer.b],
  }));

  // Compute loss
  function loss(n: NetworkWeights): number {
    let total = 0;
    for (const d of data) {
      const pred = forward([d.x1, d.x2], n);
      const p = Math.max(1e-7, Math.min(1 - 1e-7, pred));
      total += -(d.label * Math.log(p) + (1 - d.label) * Math.log(1 - p));
    }
    return total / data.length;
  }

  for (let l = 0; l < newLayers.length; l++) {
    for (let j = 0; j < newLayers[l].w.length; j++) {
      for (let i = 0; i < newLayers[l].w[j].length; i++) {
        const orig = newLayers[l].w[j][i];
        newLayers[l].w[j][i] = orig + eps;
        const lp = loss({ layers: newLayers });
        newLayers[l].w[j][i] = orig - eps;
        const lm = loss({ layers: newLayers });
        newLayers[l].w[j][i] = orig - lr * (lp - lm) / (2 * eps);
      }
      // Bias
      const origB = newLayers[l].b[j];
      newLayers[l].b[j] = origB + eps;
      const lp = loss({ layers: newLayers });
      newLayers[l].b[j] = origB - eps;
      const lm = loss({ layers: newLayers });
      newLayers[l].b[j] = origB - lr * (lp - lm) / (2 * eps);
    }
  }

  return { layers: newLayers };
}

// --- Network diagram SVG ---
const DIAG_W = 400;
const DIAG_H = 160;

function NetworkDiagram({
  layers,
}: {
  layers: number[];
}) {
  const allLayers = [2, ...layers, 1];
  const maxN = Math.max(...allLayers);
  const layerX = allLayers.map(
    (_, i) => 40 + (i / (allLayers.length - 1)) * (DIAG_W - 80)
  );

  function neuronY(layerIdx: number, nIdx: number) {
    const n = allLayers[layerIdx];
    const spacing = Math.min(30, (DIAG_H - 40) / Math.max(n, 1));
    const startY = DIAG_H / 2 - ((n - 1) * spacing) / 2;
    return startY + nIdx * spacing;
  }

  return (
    <svg viewBox={`0 0 ${DIAG_W} ${DIAG_H}`} className="w-full max-w-sm mx-auto h-auto">
      {/* Connections */}
      {allLayers.map((_, li) => {
        if (li === 0) return null;
        const elems: React.ReactElement[] = [];
        for (let a = 0; a < allLayers[li - 1]; a++) {
          for (let b = 0; b < allLayers[li]; b++) {
            elems.push(
              <line
                key={`c-${li}-${a}-${b}`}
                x1={layerX[li - 1]}
                y1={neuronY(li - 1, a)}
                x2={layerX[li]}
                y2={neuronY(li, b)}
                stroke="#71717a"
                strokeWidth={0.6}
                opacity={0.4}
              />
            );
          }
        }
        return elems;
      })}

      {/* Neurons */}
      {allLayers.map((n, li) => {
        const isInput = li === 0;
        const isOutput = li === allLayers.length - 1;
        return Array.from({ length: n }, (_, ni) => (
          <circle
            key={`n-${li}-${ni}`}
            cx={layerX[li]}
            cy={neuronY(li, ni)}
            r={10}
            fill={isInput ? "#27272a" : "#422006"}
            stroke={isInput ? "#71717a" : isOutput ? "#fbbf24" : "#f59e0b"}
            strokeWidth={isOutput ? 2 : 1.5}
          />
        ));
      })}

      {/* Layer labels */}
      {allLayers.map((n, li) => {
        const isInput = li === 0;
        const isOutput = li === allLayers.length - 1;
        const label = isInput
          ? "入力(2)"
          : isOutput
          ? "出力(1)"
          : `隠れ${layers.length > 1 ? li : ""}(${n})`;
        return (
          <text
            key={`label-${li}`}
            x={layerX[li]}
            y={DIAG_H - 4}
            textAnchor="middle"
            className="text-[9px] fill-zinc-500"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export default function NetworkBuilder() {
  const [dataset, setDataset] = useState<DatasetName>("circles");
  const [layer1, setLayer1] = useState(4);
  const [layer2, setLayer2] = useState(0); // 0 = no second hidden layer
  const [weightSeed, setWeightSeed] = useState(42);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const netRef = useRef<NetworkWeights | null>(null);
  const animRef = useRef<number>(0);

  const data = useMemo(() => generateData(dataset, 80, 42), [dataset]);

  const hiddenLayers = useMemo(() => {
    const layers = [layer1];
    if (layer2 > 0) layers.push(layer2);
    return layers;
  }, [layer1, layer2]);

  // Initialize network
  useEffect(() => {
    netRef.current = initWeights(2, hiddenLayers, 1, weightSeed);
    setEpoch(0);
    setIsTraining(false);
    cancelAnimationFrame(animRef.current);
  }, [hiddenLayers, weightSeed, dataset]);

  // Heatmap computation
  const heatmap = useMemo(() => {
    if (!netRef.current) return [];
    const res = 30;
    const cells: { x: number; y: number; w: number; h: number; v: number }[] = [];
    const cellW = (D_MAX - D_MIN) / res;

    for (let i = 0; i < res; i++) {
      for (let j = 0; j < res; j++) {
        const x1 = D_MIN + (i + 0.5) * cellW;
        const x2 = D_MIN + (j + 0.5) * cellW;
        const v = forward([x1, x2], netRef.current!);
        cells.push({
          x: toSx(D_MIN + i * cellW),
          y: toSy(D_MIN + (j + 1) * cellW),
          w: (PLOT_W - 2 * PAD) / res + 1,
          h: (PLOT_H - 2 * PAD) / res + 1,
          v,
        });
      }
    }
    return cells;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [netRef.current, epoch]);

  // Training loop
  const train = useCallback(() => {
    if (!netRef.current) return;
    let localEpoch = epoch;

    function step() {
      if (!netRef.current) return;
      for (let i = 0; i < 5; i++) {
        netRef.current = trainStep(netRef.current, data, 0.5);
        localEpoch++;
      }
      setEpoch(localEpoch);

      if (localEpoch < 500) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setIsTraining(false);
      }
    }

    setIsTraining(true);
    animRef.current = requestAnimationFrame(step);
  }, [data, epoch]);

  const reset = () => {
    cancelAnimationFrame(animRef.current);
    setIsTraining(false);
    setWeightSeed((s) => s + 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Dataset selector */}
      <div className="flex gap-2 justify-center flex-wrap">
        {(["circles", "moons", "spiral"] as DatasetName[]).map((d) => (
          <button
            key={d}
            onClick={() => setDataset(d)}
            className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
              dataset === d
                ? "bg-amber-500/20 border-amber-500 text-amber-400"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            {d === "circles" ? "円形" : d === "moons" ? "半月" : "スパイラル"}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Plot */}
        <div className="flex-1">
          <svg
            viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
            className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Heatmap */}
            {heatmap.map((c, i) => (
              <rect
                key={i}
                x={c.x}
                y={c.y}
                width={c.w}
                height={c.h}
                fill={c.v >= 0.5 ? "#f59e0b" : "#3f3f46"}
                opacity={0.1 + Math.abs(c.v - 0.5) * 0.35}
              />
            ))}

            {/* Data points */}
            {data.map((d, i) => (
              <circle
                key={i}
                cx={toSx(d.x1)}
                cy={toSy(d.x2)}
                r={3.5}
                fill={d.label === 1 ? "#f59e0b" : "#71717a"}
                stroke={d.label === 1 ? "#fbbf24" : "#a1a1aa"}
                strokeWidth={0.8}
              />
            ))}
          </svg>
          <div className="text-center text-[10px] text-zinc-500 mt-1">
            Epoch: {epoch}
          </div>
        </div>

        {/* Controls */}
        <div className="sm:w-48 space-y-3">
          {/* Network diagram */}
          <NetworkDiagram layers={hiddenLayers} />

          {/* Layer controls */}
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-zinc-400">隠れ層1</label>
                <span className="text-xs font-mono text-amber-400">{layer1}</span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={layer1}
                onChange={(e) => setLayer1(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-zinc-400">隠れ層2</label>
                <span className="text-xs font-mono text-amber-400">{layer2 || "なし"}</span>
              </div>
              <input
                type="range"
                min={0}
                max={8}
                step={1}
                value={layer2}
                onChange={(e) => setLayer2(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* Train / Reset */}
          <div className="flex gap-2">
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
      </div>
    </div>
  );
}

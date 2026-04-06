"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// --- Types ---

interface DataPoint {
  x: number;
  y: number;
}

interface CanvasConfig {
  width: number;
  height: number;
  padding: number;
}

interface ParamRange {
  min: number;
  max: number;
}

interface MarkerState {
  w: number;
  b: number;
  loss: number;
  canvasX: number;
  canvasY: number;
}

// --- Constants ---

const DATA_POINTS: DataPoint[] = [
  { x: 1, y: 2.2 },
  { x: 2, y: 4.1 },
  { x: 3, y: 5.8 },
  { x: 4, y: 8.3 },
  { x: 5, y: 9.7 },
];

const W_RANGE: ParamRange = { min: -1, max: 4 };
const B_RANGE: ParamRange = { min: -3, max: 5 };

const CANVAS_CONFIG: CanvasConfig = {
  width: 500,
  height: 400,
  padding: 50,
};

// --- Loss calculation ---

function computeMSE(w: number, b: number, data: DataPoint[]): number {
  const sumSquaredError = data.reduce((acc, { x, y }) => {
    const predicted = w * x + b;
    return acc + (predicted - y) ** 2;
  }, 0);
  return sumSquaredError / data.length;
}

// --- Color mapping ---

function lossToColor(loss: number, maxLoss: number): string {
  const t = Math.min(loss / maxLoss, 1);

  // Cool (blue) → warm (red) gradient via green/yellow
  let r: number, g: number, b: number;

  if (t < 0.25) {
    // Deep blue → light blue
    r = 0;
    g = Math.round(t * 4 * 180);
    b = 200 + Math.round(t * 4 * 55);
  } else if (t < 0.5) {
    // Light blue → green/yellow
    const s = (t - 0.25) * 4;
    r = Math.round(s * 200);
    g = 180 + Math.round(s * 75);
    b = Math.round(255 * (1 - s));
  } else if (t < 0.75) {
    // Yellow → orange
    const s = (t - 0.5) * 4;
    r = 200 + Math.round(s * 55);
    g = 255 - Math.round(s * 100);
    b = 0;
  } else {
    // Orange → red
    const s = (t - 0.75) * 4;
    r = 255;
    g = 155 - Math.round(s * 155);
    b = 0;
  }

  return `rgb(${r},${g},${b})`;
}

// --- Coordinate conversions ---

function canvasToParam(
  canvasX: number,
  canvasY: number,
  config: CanvasConfig
): { w: number; b: number } {
  const plotW = config.width - 2 * config.padding;
  const plotH = config.height - 2 * config.padding;

  const w =
    W_RANGE.min +
    ((canvasX - config.padding) / plotW) * (W_RANGE.max - W_RANGE.min);
  // Y-axis is inverted: top of canvas = max b
  const b =
    B_RANGE.max -
    ((canvasY - config.padding) / plotH) * (B_RANGE.max - B_RANGE.min);

  return { w, b };
}

function paramToCanvas(
  w: number,
  b: number,
  config: CanvasConfig
): { x: number; y: number } {
  const plotW = config.width - 2 * config.padding;
  const plotH = config.height - 2 * config.padding;

  const x =
    config.padding +
    ((w - W_RANGE.min) / (W_RANGE.max - W_RANGE.min)) * plotW;
  const y =
    config.padding +
    ((B_RANGE.max - b) / (B_RANGE.max - B_RANGE.min)) * plotH;

  return { x, y };
}

// --- Drawing ---

function drawContourPlot(
  ctx: CanvasRenderingContext2D,
  config: CanvasConfig
): number {
  const { width, height, padding } = config;
  const plotW = width - 2 * padding;
  const plotH = height - 2 * padding;

  // Pre-compute max loss for normalization
  let maxLoss = 0;
  const resolution = 2; // pixel step size for performance
  for (let px = 0; px < plotW; px += resolution) {
    for (let py = 0; py < plotH; py += resolution) {
      const { w, b } = canvasToParam(px + padding, py + padding, config);
      const loss = computeMSE(w, b, DATA_POINTS);
      if (loss > maxLoss) maxLoss = loss;
    }
  }

  // Draw the heatmap
  for (let px = 0; px < plotW; px += resolution) {
    for (let py = 0; py < plotH; py += resolution) {
      const { w, b } = canvasToParam(px + padding, py + padding, config);
      const loss = computeMSE(w, b, DATA_POINTS);
      ctx.fillStyle = lossToColor(loss, maxLoss);
      ctx.fillRect(px + padding, py + padding, resolution, resolution);
    }
  }

  // Draw contour lines
  const numContours = 12;
  const contourLevels = Array.from(
    { length: numContours },
    (_, i) => ((i + 1) / (numContours + 1)) * maxLoss
  );

  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 0.8;

  for (const level of contourLevels) {
    ctx.beginPath();
    let started = false;
    // Sweep horizontally to find contour crossings
    for (let px = 0; px < plotW; px += 3) {
      for (let py = 0; py < plotH - 3; py += 3) {
        const { w, b } = canvasToParam(px + padding, py + padding, config);
        const { w: w2, b: b2 } = canvasToParam(
          px + padding,
          py + padding + 3,
          config
        );
        const loss1 = computeMSE(w, b, DATA_POINTS);
        const loss2 = computeMSE(w2, b2, DATA_POINTS);

        if ((loss1 - level) * (loss2 - level) < 0) {
          const frac = (level - loss1) / (loss2 - loss1);
          const cy = py + padding + frac * 3;
          if (!started) {
            ctx.moveTo(px + padding, cy);
            started = true;
          } else {
            ctx.lineTo(px + padding, cy);
          }
        }
      }
    }
    ctx.stroke();
  }

  return maxLoss;
}

function drawAxes(ctx: CanvasRenderingContext2D, config: CanvasConfig): void {
  const { width, height, padding } = config;

  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1.5;
  ctx.font = "13px system-ui, sans-serif";
  ctx.fillStyle = "#e2e8f0";
  ctx.textAlign = "center";

  // Border around the plot area
  ctx.strokeRect(padding, padding, width - 2 * padding, height - 2 * padding);

  // W-axis ticks and labels
  const wSteps = 5;
  for (let i = 0; i <= wSteps; i++) {
    const val = W_RANGE.min + (i / wSteps) * (W_RANGE.max - W_RANGE.min);
    const x =
      padding + (i / wSteps) * (width - 2 * padding);
    // Tick
    ctx.beginPath();
    ctx.moveTo(x, height - padding);
    ctx.lineTo(x, height - padding + 6);
    ctx.stroke();
    // Label
    ctx.fillText(val.toFixed(1), x, height - padding + 20);
  }

  // B-axis ticks and labels
  ctx.textAlign = "right";
  const bSteps = 4;
  for (let i = 0; i <= bSteps; i++) {
    const val = B_RANGE.max - (i / bSteps) * (B_RANGE.max - B_RANGE.min);
    const y = padding + (i / bSteps) * (height - 2 * padding);
    // Tick
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding - 6, y);
    ctx.stroke();
    // Label
    ctx.fillText(val.toFixed(1), padding - 10, y + 4);
  }

  // Axis titles
  ctx.textAlign = "center";
  ctx.font = "bold 14px system-ui, sans-serif";
  ctx.fillText("w (weight)", width / 2, height - 5);

  ctx.save();
  ctx.translate(14, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("b (bias)", 0, 0);
  ctx.restore();
}

function drawMarker(
  ctx: CanvasRenderingContext2D,
  marker: MarkerState
): void {
  const { canvasX, canvasY } = marker;

  // Crosshair
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(canvasX - 12, canvasY);
  ctx.lineTo(canvasX + 12, canvasY);
  ctx.moveTo(canvasX, canvasY - 12);
  ctx.lineTo(canvasX, canvasY + 12);
  ctx.stroke();
  ctx.setLineDash([]);

  // Dot
  ctx.beginPath();
  ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function drawOptimum(
  ctx: CanvasRenderingContext2D,
  config: CanvasConfig
): { w: number; b: number; loss: number } {
  // Find approximate optimum by grid search
  let bestW = 0;
  let bestB = 0;
  let bestLoss = Infinity;
  const steps = 200;

  for (let i = 0; i <= steps; i++) {
    for (let j = 0; j <= steps; j++) {
      const w =
        W_RANGE.min + (i / steps) * (W_RANGE.max - W_RANGE.min);
      const b =
        B_RANGE.min + (j / steps) * (B_RANGE.max - B_RANGE.min);
      const loss = computeMSE(w, b, DATA_POINTS);
      if (loss < bestLoss) {
        bestLoss = loss;
        bestW = w;
        bestB = b;
      }
    }
  }

  const { x, y } = paramToCanvas(bestW, bestB, config);

  // Star marker for optimum
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#fbbf24";
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Label
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = "#fbbf24";
  ctx.textAlign = "left";
  ctx.fillText("★ optimum", x + 8, y + 4);

  return { w: bestW, b: bestB, loss: bestLoss };
}

// --- Component ---

export default function LossLandscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [marker, setMarker] = useState<MarkerState | null>(null);
  const [optimum, setOptimum] = useState<{
    w: number;
    b: number;
    loss: number;
  } | null>(null);
  const [scale, setScale] = useState(1);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_CONFIG.width * dpr;
    canvas.height = CANVAS_CONFIG.height * dpr;
    canvas.style.width = `${CANVAS_CONFIG.width}px`;
    canvas.style.height = `${CANVAS_CONFIG.height}px`;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, CANVAS_CONFIG.width, CANVAS_CONFIG.height);

    // Draw layers
    drawContourPlot(ctx, CANVAS_CONFIG);
    drawAxes(ctx, CANVAS_CONFIG);
    const opt = drawOptimum(ctx, CANVAS_CONFIG);
    setOptimum(opt);

    if (marker) {
      drawMarker(ctx, marker);
    }
  }, [marker]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Responsive scaling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        const newScale = Math.min(containerWidth / CANVAS_CONFIG.width, 1);
        setScale(newScale);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_CONFIG.width / rect.width;
      const scaleY = CANVAS_CONFIG.height / rect.height;

      const canvasX = (e.clientX - rect.left) * scaleX;
      const canvasY = (e.clientY - rect.top) * scaleY;

      // Check if click is within the plot area
      const { padding } = CANVAS_CONFIG;
      if (
        canvasX < padding ||
        canvasX > CANVAS_CONFIG.width - padding ||
        canvasY < padding ||
        canvasY > CANVAS_CONFIG.height - padding
      ) {
        return;
      }

      const { w, b } = canvasToParam(canvasX, canvasY, CANVAS_CONFIG);
      const loss = computeMSE(w, b, DATA_POINTS);

      setMarker({ w, b, loss, canvasX, canvasY });
    },
    []
  );

  return (
    <div className="w-full max-w-xl mx-auto" ref={containerRef}>
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-slate-100">
          Loss Landscape — MSE for Linear Regression
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Click anywhere on the plot to see the loss at that (w, b) point.
          The model is <code className="text-sky-400">y = w·x + b</code>.
        </p>
      </div>

      <div
        className="relative inline-block"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: CANVAS_CONFIG.width,
          height: CANVAS_CONFIG.height,
        }}
      >
        <canvas
          ref={canvasRef}
          className="cursor-crosshair rounded-lg border border-slate-700"
          onClick={handleCanvasClick}
        />
      </div>

      {/* Spacer to account for scaled canvas */}
      <div
        style={{
          height: CANVAS_CONFIG.height * scale,
          marginTop: scale < 1 ? -(CANVAS_CONFIG.height * (1 - scale)) : 0,
        }}
      />

      {/* Info panel */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* Current selection */}
        <div className="rounded-lg bg-slate-800 border border-slate-700 p-3">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
            Your Selection
          </p>
          {marker ? (
            <div className="space-y-1 text-sm font-mono">
              <p className="text-slate-200">
                w ={" "}
                <span className="text-sky-400">{marker.w.toFixed(3)}</span>
              </p>
              <p className="text-slate-200">
                b ={" "}
                <span className="text-sky-400">{marker.b.toFixed(3)}</span>
              </p>
              <p className="text-slate-200">
                Loss ={" "}
                <span className="text-amber-400">
                  {marker.loss.toFixed(4)}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">
              Click the plot above
            </p>
          )}
        </div>

        {/* Optimum */}
        <div className="rounded-lg bg-slate-800 border border-slate-700 p-3">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
            Optimum
          </p>
          {optimum && (
            <div className="space-y-1 text-sm font-mono">
              <p className="text-slate-200">
                w ={" "}
                <span className="text-yellow-400">
                  {optimum.w.toFixed(3)}
                </span>
              </p>
              <p className="text-slate-200">
                b ={" "}
                <span className="text-yellow-400">
                  {optimum.b.toFixed(3)}
                </span>
              </p>
              <p className="text-slate-200">
                Loss ={" "}
                <span className="text-green-400">
                  {optimum.loss.toFixed(4)}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dataset reference */}
      <details className="mt-4 text-sm text-slate-400">
        <summary className="cursor-pointer hover:text-slate-300 transition-colors">
          Dataset used ({DATA_POINTS.length} points)
        </summary>
        <div className="mt-2 rounded-lg bg-slate-800 border border-slate-700 p-3 font-mono text-xs">
          {DATA_POINTS.map((p, i) => (
            <span key={i} className="inline-block mr-4">
              ({p.x}, {p.y})
            </span>
          ))}
        </div>
      </details>
    </div>
  );
}

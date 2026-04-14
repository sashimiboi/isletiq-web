"use client";

import { useEffect, useRef } from "react";

// Brand-blue palette. Four shades so the facade has visual variety
// without drifting off-brand. Weights favor the darker end so the
// idle field is subtle.
const PALETTE: Array<{ rgb: [number, number, number]; weight: number }> = [
  { rgb: [0, 51, 160], weight: 0.4 },    // #0033a0 deep brand navy
  { rgb: [30, 88, 180], weight: 0.28 },  // mid blue
  { rgb: [92, 179, 204], weight: 0.2 },  // #5cb3cc brand cyan
  { rgb: [180, 215, 230], weight: 0.12 },// pale ice
];

const COL_COUNT = 58;
const ROW_COUNT = 26;
const GAP_X = 2;
const GAP_Y = 2;
const CURSOR_RADIUS = 260;
const TRAIL_DECAY = 0.88;

interface Cell {
  color: [number, number, number];
  tint: number;
  trail: number;
}

function pickColor(random: number): [number, number, number] {
  let acc = 0;
  for (const entry of PALETTE) {
    acc += entry.weight;
    if (random < acc) return entry.rgb;
  }
  return PALETTE[0].rgb;
}

export default function DnaHelix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grid: Cell[] = [];
    for (let i = 0; i < COL_COUNT * ROW_COUNT; i++) {
      const seed = (i * 9301 + 49297) % 233280;
      const r1 = seed / 233280;
      const r2 = ((i * 2311 + 19717) % 233280) / 233280;
      grid.push({
        color: pickColor(r1),
        tint: r2 * 0.08 - 0.04,
        trail: 0,
      });
    }

    let width = 0;
    let height = 0;
    let cellW = 0;
    let cellH = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cellW = width / COL_COUNT;
      cellH = height / ROW_COUNT;
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;
    };
    window.addEventListener("pointermove", onPointerMove);

    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const radiusSq = CURSOR_RADIUS * CURSOR_RADIUS;

      for (let r = 0; r < ROW_COUNT; r++) {
        for (let c = 0; c < COL_COUNT; c++) {
          const idx = r * COL_COUNT + c;
          const cell = grid[idx];

          const x = c * cellW;
          const y = r * cellH;
          const cx = x + cellW / 2;
          const cy = y + cellH / 2;

          const dx = cx - px;
          const dy = cy - py;
          const distSq = dx * dx + dy * dy;
          let cursorBoost = 0;
          if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            const t01 = 1 - dist / CURSOR_RADIUS;
            cursorBoost = t01 * t01;
          }
          if (cursorBoost > cell.trail) cell.trail = cursorBoost;
          cell.trail *= TRAIL_DECAY;
          const boost = Math.max(cursorBoost, cell.trail);

          const baseAlpha = 0.18 + cell.tint * 0.3;
          const alpha = Math.min(0.95, baseAlpha + boost * 0.65);

          const [br, bg, bb] = cell.color;
          const light = 0.05 + cell.tint + boost * 0.5;
          const rr = Math.round(Math.min(255, br + (255 - br) * light));
          const gg = Math.round(Math.min(255, bg + (255 - bg) * light));
          const bbb = Math.round(Math.min(255, bb + (255 - bb) * light));

          ctx.fillStyle = `rgba(${rr}, ${gg}, ${bbb}, ${alpha})`;
          ctx.fillRect(
            x + GAP_X / 2,
            y + GAP_Y / 2,
            cellW - GAP_X,
            cellH - GAP_Y
          );
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

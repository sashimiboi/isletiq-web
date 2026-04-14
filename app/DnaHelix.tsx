"use client";

import { useEffect, useRef } from "react";

// Earth-tone palette sampled from the Cerner Innovations Campus
// facade. Each panel represents one nucleotide base, so the hero
// reads as a genomic sequence rendered in architectural cladding.
// Weights control how often each appears (bronze dominates).
const PALETTE: Array<{ rgb: [number, number, number]; weight: number }> = [
  { rgb: [176, 133, 86], weight: 0.38 },  // warm bronze
  { rgb: [224, 210, 183], weight: 0.24 }, // cream
  { rgb: [74, 59, 44], weight: 0.2 },     // dark bronze / charcoal
  { rgb: [86, 110, 128], weight: 0.18 },  // blue-steel window panel
];

const COL_COUNT = 34;
const ROW_COUNT = 18;
const GAP_X = 4;
const GAP_Y = 3;
const CURSOR_RADIUS = 280;
const TRAIL_DECAY = 0.88;

interface Cell {
  color: [number, number, number];
  // Small per-cell variation so the facade doesn't read as dead flat
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
      // Deterministic pseudo-random so the facade is stable across
      // renders but not obviously periodic
      const seed = (i * 9301 + 49297) % 233280;
      const r1 = seed / 233280;
      const r2 = ((i * 2311 + 19717) % 233280) / 233280;
      grid.push({
        color: pickColor(r1),
        tint: r2 * 0.08 - 0.04, // +/- 4% lightness
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

          // Base opacity is low so the facade sits as a subtle backdrop.
          // Cursor boost raises opacity AND lightens the panel color,
          // like sunlight hitting a specific tile.
          const baseAlpha = 0.22 + cell.tint * 0.3;
          const alpha = Math.min(0.95, baseAlpha + boost * 0.6);

          const [br, bg, bb] = cell.color;
          const light = 0.08 + cell.tint + boost * 0.45;
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

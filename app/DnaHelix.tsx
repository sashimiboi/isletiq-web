"use client";

import { useEffect, useRef } from "react";

// Brand-blue palette built around #0033a0 as the base. Shadow
// through highlight so vertical runs still read as distinct
// stripes like the glass curtain-wall reference.
const PALETTE: Array<[number, number, number]> = [
  [0, 18, 65],     // shadow navy (rare accent)
  [0, 35, 115],    // darker brand
  [0, 51, 160],    // #0033a0 brand navy (dominant)
  [92, 179, 204],  // #5cb3cc brand cyan
  [200, 225, 240], // pale ice highlight
];

// Per-column dominant distribution. Weighted so brand navy
// dominates the facade.
const COLUMN_DOMINANT_WEIGHTS = [0.06, 0.2, 0.42, 0.22, 0.1];

// Small chance that a given cell diverges from its column's
// dominant color, producing the occasional "base switch" visible
// in a real sequence facade.
const SWITCH_PROB = 0.22;

// Occasional very dark accent bars that jump out from the grid
const DARK_ACCENT_PROB = 0.03;

const COL_COUNT = 56;
const ROW_COUNT = 26;
const GAP_X = 1;
const GAP_Y = 1;
// Every FLOOR_EVERY rows the horizontal gap widens, simulating
// the mullion line between floors on a curtain wall
const FLOOR_EVERY = 6;
const FLOOR_EXTRA_GAP = 4;

const CURSOR_RADIUS = 260;
const TRAIL_DECAY = 0.88;
const IDLE_ALPHA = 0.1;

interface Cell {
  colorIdx: number;
  tint: number;
  trail: number;
}

function hash01(i: number): number {
  return ((i * 9301 + 49297) % 233280) / 233280;
}

function pickWeighted(weights: number[], random: number): number {
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i];
    if (random < acc) return i;
  }
  return weights.length - 1;
}

export default function DnaHelix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Column dominant colors
    const columnDominant: number[] = [];
    for (let c = 0; c < COL_COUNT; c++) {
      columnDominant.push(
        pickWeighted(COLUMN_DOMINANT_WEIGHTS, hash01(c * 131 + 7))
      );
    }

    // Build grid with vertical runs
    const grid: Cell[] = [];
    for (let r = 0; r < ROW_COUNT; r++) {
      for (let c = 0; c < COL_COUNT; c++) {
        const seed1 = hash01(r * COL_COUNT + c);
        const seed2 = hash01((r * 1021 + c * 31) * 17);
        const seed3 = hash01(r * 877 + c * 41 + 13);

        let colorIdx: number;
        if (seed3 < DARK_ACCENT_PROB) {
          // Rare very dark accent
          colorIdx = 0;
        } else if (seed1 > SWITCH_PROB) {
          colorIdx = columnDominant[c];
        } else {
          // Pick a neighboring tone (prefer adjacent lightness)
          const dom = columnDominant[c];
          const shift = seed2 < 0.5 ? -1 : 1;
          colorIdx = Math.max(0, Math.min(PALETTE.length - 1, dom + shift));
        }

        grid.push({
          colorIdx,
          tint: seed2 * 0.06 - 0.03,
          trail: 0,
        });
      }
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

      const centerX = width / 2;
      const centerY = height / 2;
      const maskRadiusX = width * 0.4;
      const maskRadiusY = height * 0.44;

      for (let r = 0; r < ROW_COUNT; r++) {
        // Floor line handling: every FLOOR_EVERY rows, shift this
        // row's Y by an extra gap so there's a visible mullion line
        const floorShift = Math.floor(r / FLOOR_EVERY) * FLOOR_EXTRA_GAP;

        for (let c = 0; c < COL_COUNT; c++) {
          const idx = r * COL_COUNT + c;
          const cell = grid[idx];

          const x = c * cellW;
          const y = r * cellH + floorShift;
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

          const ndx = (cx - centerX) / maskRadiusX;
          const ndy = (cy - centerY) / maskRadiusY;
          const centerDistSq = ndx * ndx + ndy * ndy;
          const edgeness = Math.min(1, centerDistSq);
          const mask = edgeness * edgeness * (3 - 2 * edgeness);

          const baseAlpha = (IDLE_ALPHA + cell.tint * 0.08) * mask;
          const alpha = Math.min(0.95, baseAlpha + boost * 0.65);

          if (alpha < 0.01) continue;

          const [br, bg, bb] = PALETTE[cell.colorIdx];
          const light = cell.tint + boost * 0.4;
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

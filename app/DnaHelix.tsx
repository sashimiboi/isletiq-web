"use client";

import { useEffect, useRef } from "react";

// Nucleotide colors drawn from the IsletIQ brand palette. Each DNA
// base gets its own channel so the hero reads as a genomic sequence
// rather than a uniform wash.
const BASE_COLORS: Record<"A" | "T" | "G" | "C", [number, number, number]> = {
  A: [0, 51, 160],    // adenine, brand blue
  T: [92, 179, 204],  // thymine, brand cyan
  G: [242, 166, 51],  // guanine, brand amber
  C: [33, 196, 94],   // cytosine, brand green
};
const BASES = ["A", "T", "G", "C"] as const;
type Base = (typeof BASES)[number];

const COL_COUNT = 42;
const ROW_COUNT = 16;
const BASE_HEIGHT = 14;
const CURSOR_RADIUS = 240;
const IDLE_OPACITY = 0.08;

interface Cell {
  base: Base;
  jitter: number;
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
      // LCG-style hash so each cell gets stable, not-obviously-periodic noise
      const seed = (i * 9301 + 49297) % 233280;
      grid.push({
        base: BASES[seed % 4],
        jitter: seed / 233280,
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
      const dpr = window.devicePixelRatio || 1;
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
    const start = performance.now();

    const draw = (t: number) => {
      const time = (t - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const radiusSq = CURSOR_RADIUS * CURSOR_RADIUS;

      ctx.lineCap = "round";

      for (let r = 0; r < ROW_COUNT; r++) {
        for (let c = 0; c < COL_COUNT; c++) {
          const idx = r * COL_COUNT + c;
          const cell = grid[idx];
          const x = (c + 0.5) * cellW;
          const y = (r + 0.5) * cellH;

          const dx = x - px;
          const dy = y - py;
          const distSq = dx * dx + dy * dy;

          let boost = 0;
          if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            const t01 = 1 - dist / CURSOR_RADIUS;
            boost = t01 * t01;
          }

          // Slow ambient breathing so the idle field is never dead
          const breath =
            0.5 + 0.5 * Math.sin(time * 1.4 + cell.jitter * 8 + c * 0.25);
          const opacity = Math.min(
            0.9,
            IDLE_OPACITY + boost * 0.78 + breath * 0.035
          );

          const segHeight = BASE_HEIGHT + boost * 14;
          const [cr, cg, cb] = BASE_COLORS[cell.base];

          ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${opacity})`;
          ctx.lineWidth = 1.3 + boost * 1.8;
          ctx.beginPath();
          ctx.moveTo(x, y - segHeight / 2);
          ctx.lineTo(x, y + segHeight / 2);
          ctx.stroke();

          // Near the cursor, draw a horizontal base-pair rung to the
          // next column. Creates the DNA ladder effect only where the
          // user is reading the genome.
          if (boost > 0.22 && c < COL_COUNT - 1) {
            const partner = grid[idx + 1];
            const [pr, pg, pb] = BASE_COLORS[partner.base];
            const mr = Math.round((cr + pr) / 2);
            const mg = Math.round((cg + pg) / 2);
            const mb = Math.round((cb + pb) / 2);
            const nx = (c + 1.5) * cellW;
            ctx.strokeStyle = `rgba(${mr}, ${mg}, ${mb}, ${boost * 0.4})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + 2, y);
            ctx.lineTo(nx - 2, y);
            ctx.stroke();
          }
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

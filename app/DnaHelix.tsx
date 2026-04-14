"use client";

import { useEffect, useRef } from "react";

// Nucleotide colors drawn from the IsletIQ brand palette with a
// slightly brighter pass so additive blending produces a neon bloom
// rather than a muddy wash. Think cyberpunk medical scanner.
const BASE_COLORS: Record<"A" | "T" | "G" | "C", [number, number, number]> = {
  A: [64, 120, 255],   // adenine, electric blue
  T: [120, 220, 255],  // thymine, bright cyan
  G: [255, 180, 70],   // guanine, hot amber
  C: [80, 255, 180],   // cytosine, acid green
};
const BASES = ["A", "T", "G", "C"] as const;
type Base = (typeof BASES)[number];

const COL_COUNT = 46;
const ROW_COUNT = 18;
const BASE_HEIGHT = 14;
const CURSOR_RADIUS = 260;
const IDLE_OPACITY = 0.07;
const TRAIL_DECAY = 0.92; // 0..1, higher = longer trail

interface Cell {
  base: Base;
  jitter: number;
  trail: number; // 0..1 decaying intensity from recent cursor pass
}

export default function DnaHelix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: -9999, y: -9999, moved: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grid: Cell[] = [];
    for (let i = 0; i < COL_COUNT * ROW_COUNT; i++) {
      const seed = (i * 9301 + 49297) % 233280;
      grid.push({
        base: BASES[seed % 4],
        jitter: seed / 233280,
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
      pointerRef.current.moved = true;
    };
    window.addEventListener("pointermove", onPointerMove);

    let raf = 0;
    const start = performance.now();

    const draw = (t: number) => {
      const time = (t - start) / 1000;
      // Semi-clear so trails leave a faint afterglow rather than
      // instantly snapping off. Pure clearRect also works but the
      // composite fade adds motion blur character.
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, width, height);

      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const radiusSq = CURSOR_RADIUS * CURSOR_RADIUS;

      // Horizontal genome scanline that sweeps top to bottom every
      // ~6s. Mimics a DNA sequencer reading head.
      const scanPeriod = 6;
      const scanPhase = (time % scanPeriod) / scanPeriod;
      const scanY = scanPhase * (height + 120) - 60;
      const scanThickness = 70;

      // Additive blend makes overlapping strokes bloom into neon.
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      for (let r = 0; r < ROW_COUNT; r++) {
        for (let c = 0; c < COL_COUNT; c++) {
          const idx = r * COL_COUNT + c;
          const cell = grid[idx];
          const x = (c + 0.5) * cellW;
          const y = (r + 0.5) * cellH;

          // Cursor proximity boost
          const dx = x - px;
          const dy = y - py;
          const distSq = dx * dx + dy * dy;
          let cursorBoost = 0;
          if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            const t01 = 1 - dist / CURSOR_RADIUS;
            cursorBoost = t01 * t01;
          }

          // Persistent trail: accumulate cursor brightness, then
          // decay each frame so cells glow for a moment after the
          // pointer passes.
          if (cursorBoost > cell.trail) cell.trail = cursorBoost;
          cell.trail *= TRAIL_DECAY;
          const trailBoost = cell.trail;
          const boost = Math.max(cursorBoost, trailBoost);

          // Scanline pass: cells within scanThickness of the current
          // scanY get a short-lived highlight.
          const scanDist = Math.abs(y - scanY);
          const scanBoost =
            scanDist < scanThickness
              ? Math.pow(1 - scanDist / scanThickness, 3) * 0.45
              : 0;

          // Slow breathing + high-frequency shimmer. The shimmer is
          // what sells the "cyber" vibe: a 6Hz sparkle on top of the
          // 1.4Hz ambient wave.
          const breath =
            0.5 + 0.5 * Math.sin(time * 1.4 + cell.jitter * 8 + c * 0.25);
          const sparkle =
            0.5 + 0.5 * Math.sin(time * 6.5 + cell.jitter * 22 + r * 1.1);
          const shimmer = breath * 0.04 + sparkle * 0.035;

          const opacity = Math.min(
            1.0,
            IDLE_OPACITY + boost * 0.85 + scanBoost + shimmer
          );

          const segHeight = BASE_HEIGHT + boost * 16 + scanBoost * 8;
          const [cr, cg, cb] = BASE_COLORS[cell.base];

          // Primary glow stroke with neon shadow halo. shadowBlur is
          // expensive, so we only apply it to cells that are actually
          // lit above a threshold.
          if (boost > 0.12 || scanBoost > 0.1) {
            ctx.shadowColor = `rgba(${cr}, ${cg}, ${cb}, ${opacity})`;
            ctx.shadowBlur = 8 + boost * 16;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${opacity})`;
          ctx.lineWidth = 1.1 + boost * 2.0 + scanBoost * 0.8;
          ctx.beginPath();
          ctx.moveTo(x, y - segHeight / 2);
          ctx.lineTo(x, y + segHeight / 2);
          ctx.stroke();

          // Chromatic aberration: when a cell is strongly lit, draw
          // two fainter offset copies in R and B so the line feels
          // like it's ghosting on a CRT.
          if (boost > 0.45) {
            const chroma = boost * 1.6;
            ctx.shadowBlur = 0;
            ctx.strokeStyle = `rgba(255, 80, 120, ${boost * 0.35})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(x - chroma, y - segHeight / 2);
            ctx.lineTo(x - chroma, y + segHeight / 2);
            ctx.stroke();
            ctx.strokeStyle = `rgba(80, 200, 255, ${boost * 0.35})`;
            ctx.beginPath();
            ctx.moveTo(x + chroma, y - segHeight / 2);
            ctx.lineTo(x + chroma, y + segHeight / 2);
            ctx.stroke();
          }

          // Near the cursor, connect to the next column with a DNA
          // base-pair rung. Now glowing too.
          if (boost > 0.22 && c < COL_COUNT - 1) {
            const partner = grid[idx + 1];
            const [pr, pg, pb] = BASE_COLORS[partner.base];
            const mr = Math.round((cr + pr) / 2);
            const mg = Math.round((cg + pg) / 2);
            const mb = Math.round((cb + pb) / 2);
            const nx = (c + 1.5) * cellW;
            ctx.shadowColor = `rgba(${mr}, ${mg}, ${mb}, ${boost * 0.5})`;
            ctx.shadowBlur = 6 + boost * 10;
            ctx.strokeStyle = `rgba(${mr}, ${mg}, ${mb}, ${boost * 0.55})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(x + 2, y);
            ctx.lineTo(nx - 2, y);
            ctx.stroke();
          }
        }
      }

      // Scanline highlight bar, very faint, adds a moving horizon
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "lighter";
      const scanGrad = ctx.createLinearGradient(0, scanY - 1, 0, scanY + 1);
      scanGrad.addColorStop(0, "rgba(120, 220, 255, 0)");
      scanGrad.addColorStop(0.5, "rgba(120, 220, 255, 0.18)");
      scanGrad.addColorStop(1, "rgba(120, 220, 255, 0)");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 1, width, 2);

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

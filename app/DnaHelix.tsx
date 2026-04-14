"use client";

import { useEffect, useRef } from "react";

// All bars are brand blue. Core = #0033a0, halo = #5cb3cc.
const CORE_RGB = "0, 51, 160";
const HALO_RGB = "92, 179, 204";
const WHITE_HOT = "200, 230, 255";

const COL_COUNT = 40;
const ROW_COUNT = 16;
const BASE_HEIGHT = 14;
const CURSOR_RADIUS = 240;
const IDLE_OPACITY = 0.1;
const TRAIL_DECAY = 0.9;

interface Cell {
  jitter: number;
  trail: number;
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
      grid.push({ jitter: seed / 233280, trail: 0 });
    }

    let width = 0;
    let height = 0;
    let cellW = 0;
    let cellH = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      // Cap DPR at 2 so 3x retina phones and 4K displays don't melt
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
    const start = performance.now();

    const draw = (t: number) => {
      const time = (t - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const radiusSq = CURSOR_RADIUS * CURSOR_RADIUS;

      // Scanline sweep: a soft horizontal bar crossing the hero every
      // 6 seconds, brightening bases it passes over
      const scanPeriod = 6;
      const scanPhase = (time % scanPeriod) / scanPeriod;
      const scanY = scanPhase * (height + 140) - 70;
      const scanThickness = 70;

      ctx.lineCap = "round";

      // Pass A: batch every idle bar into a single Path2D and stroke
      // once. This is the big perf win: 600 cells = 1 draw call.
      const dimPath = new Path2D();
      const boosted: Array<{
        x: number;
        y: number;
        boost: number;
        scanBoost: number;
      }> = [];

      for (let r = 0; r < ROW_COUNT; r++) {
        for (let c = 0; c < COL_COUNT; c++) {
          const idx = r * COL_COUNT + c;
          const cell = grid[idx];
          const x = (c + 0.5) * cellW;
          const y = (r + 0.5) * cellH;

          const dx = x - px;
          const dy = y - py;
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

          const scanDist = Math.abs(y - scanY);
          const scanBoost =
            scanDist < scanThickness
              ? Math.pow(1 - scanDist / scanThickness, 3) * 0.4
              : 0;

          if (boost > 0.04 || scanBoost > 0.05) {
            boosted.push({ x, y, boost, scanBoost });
          } else {
            dimPath.moveTo(x, y - BASE_HEIGHT / 2);
            dimPath.lineTo(x, y + BASE_HEIGHT / 2);
          }
        }
      }

      // Ambient breathing on the idle field
      const breath = 0.5 + 0.5 * Math.sin(time * 1.4);
      ctx.strokeStyle = `rgba(${CORE_RGB}, ${IDLE_OPACITY + breath * 0.04})`;
      ctx.lineWidth = 1.2;
      ctx.stroke(dimPath);

      // Pass B: per-cell manual bloom for the boosted set. Three
      // stacked strokes produce neon without the cost of shadowBlur:
      //   1. Wide faint cyan halo
      //   2. Core thin opaque brand blue
      //   3. White-hot centerline for the very brightest cells
      for (const bc of boosted) {
        const glow = Math.min(1, bc.boost + bc.scanBoost);
        const segHeight = BASE_HEIGHT + bc.boost * 18 + bc.scanBoost * 8;
        const halfH = segHeight / 2;
        const topY = bc.y - halfH;
        const botY = bc.y + halfH;

        // Halo
        ctx.strokeStyle = `rgba(${HALO_RGB}, ${glow * 0.35})`;
        ctx.lineWidth = 5 + bc.boost * 9;
        ctx.beginPath();
        ctx.moveTo(bc.x, topY);
        ctx.lineTo(bc.x, botY);
        ctx.stroke();

        // Core
        ctx.strokeStyle = `rgba(${CORE_RGB}, ${Math.min(1, 0.3 + glow * 0.8)})`;
        ctx.lineWidth = 1.6 + bc.boost * 1.4;
        ctx.beginPath();
        ctx.moveTo(bc.x, topY);
        ctx.lineTo(bc.x, botY);
        ctx.stroke();

        // Hot core for very bright cells
        if (bc.boost > 0.45) {
          ctx.strokeStyle = `rgba(${WHITE_HOT}, ${bc.boost * 0.85})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(bc.x, topY);
          ctx.lineTo(bc.x, botY);
          ctx.stroke();
        }
      }

      // Horizontal DNA rungs: only between adjacent strongly-boosted
      // cells. Tiny additional cost since most boosted cells still
      // fail the adjacency test.
      ctx.strokeStyle = `rgba(${HALO_RGB}, 0.55)`;
      ctx.lineWidth = 1.1;
      for (let i = 0; i < boosted.length; i++) {
        const a = boosted[i];
        if (a.boost < 0.3) continue;
        for (let j = i + 1; j < boosted.length; j++) {
          const b = boosted[j];
          if (b.boost < 0.3) continue;
          if (Math.abs(b.y - a.y) < 1 && Math.abs(b.x - a.x - cellW) < 1) {
            ctx.beginPath();
            ctx.moveTo(a.x + 2, a.y);
            ctx.lineTo(b.x - 2, b.y);
            ctx.stroke();
            break;
          }
        }
      }

      // Soft scanline bar
      const scanGrad = ctx.createLinearGradient(0, scanY - 1, 0, scanY + 1);
      scanGrad.addColorStop(0, `rgba(${HALO_RGB}, 0)`);
      scanGrad.addColorStop(0.5, `rgba(${HALO_RGB}, 0.22)`);
      scanGrad.addColorStop(1, `rgba(${HALO_RGB}, 0)`);
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

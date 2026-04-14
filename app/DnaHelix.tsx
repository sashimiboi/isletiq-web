"use client";

import { useEffect, useRef } from "react";

// Two-color lerp: idle is a barely-there cool gray tick,
// hover saturates to brand navy.
const IDLE_RGB: [number, number, number] = [170, 182, 196];
const HOT_RGB: [number, number, number] = [0, 51, 160];

const COL_COUNT = 160;
const ROW_COUNT = 18;

// Per-cell bar geometry is randomized at init and stays stable
// so the facade reads as an intentional layout, not noise.
// Bars can now extend beyond their cell so adjacent rows overlap
// and the grid meshes into one continuous field.
const MIN_BAR_W = 1;
const MAX_BAR_W = 3;
const MIN_HEIGHT_FRAC = 0.18;
const MAX_HEIGHT_FRAC = 1.0;

const CURSOR_RADIUS = 240;
// Eased rise and fall rates (per frame) so bars ease into and out
// of the hover state gracefully rather than snapping
const RISE_LERP = 0.16;
const FALL_LERP = 0.05;
const IDLE_ALPHA = 0.11;
const HOT_ALPHA = 1;

interface Bar {
  wPx: number;
  hFrac: number;
  // Jitter offsets break the strict grid so rows and columns don't
  // read as aligned stripes. Combined with bar heights that can
  // exceed cellH, this meshes adjacent rows together.
  xOffset: number;
  yOffset: number;
  trail: number;
  phase: number;
}

function hash01(i: number): number {
  return ((i * 9301 + 49297) % 233280) / 233280;
}

export default function DnaHelix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bars: Bar[] = [];
    for (let i = 0; i < COL_COUNT * ROW_COUNT; i++) {
      const r1 = hash01(i);
      const r2 = hash01(i * 17 + 3);
      const r3 = hash01(i * 31 + 7);
      const r4 = hash01(i * 53 + 11);
      const r5 = hash01(i * 71 + 19);
      bars.push({
        wPx: MIN_BAR_W + r1 * (MAX_BAR_W - MIN_BAR_W),
        hFrac: MIN_HEIGHT_FRAC + r2 * (MAX_HEIGHT_FRAC - MIN_HEIGHT_FRAC),
        xOffset: (r3 - 0.5) * 0.4, // +/- 20% of cell width
        yOffset: (r5 - 0.5) * 0.7, // +/- 35% of cell height
        trail: 0,
        phase: r4 * Math.PI * 2,
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
    const start = performance.now();

    const draw = (t: number) => {
      const time = (t - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const radiusSq = CURSOR_RADIUS * CURSOR_RADIUS;

      for (let r = 0; r < ROW_COUNT; r++) {
        for (let c = 0; c < COL_COUNT; c++) {
          const idx = r * COL_COUNT + c;
          const bar = bars[idx];

          const cx = (c + 0.5 + bar.xOffset) * cellW;
          const cy = (r + 0.5 + bar.yOffset) * cellH;

          // Cursor proximity with smoothstep falloff
          const dx = cx - px;
          const dy = cy - py;
          const distSq = dx * dx + dy * dy;
          let target = 0;
          if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            const t01 = 1 - dist / CURSOR_RADIUS;
            // Smoothstep gives a softer ring than quadratic
            target = t01 * t01 * (3 - 2 * t01);
          }
          // Ease toward target at different rates for rise and fall,
          // so bars smoothly ramp up as the cursor enters their
          // radius and gracefully fade out after it leaves
          if (target > bar.trail) {
            bar.trail += (target - bar.trail) * RISE_LERP;
          } else {
            bar.trail += (target - bar.trail) * FALL_LERP;
          }
          // Hover pulse: hovered bars oscillate between 82 percent and
          // 100 percent of their peak brightness on a ~2.8 Hz cycle
          // with per-bar phase offset so nearby bars pulse slightly
          // out of sync, giving a gentle waving breath.
          const pulse = Math.sin(time * 2.8 + bar.phase * 0.6) * 0.5 + 0.5;
          const boost = bar.trail * (0.82 + 0.18 * pulse);

          // Ambient breath so idle bars faintly pulse
          const breath = Math.sin(time * 0.9 + bar.phase) * 0.5 + 0.5;
          const breathAlpha = breath * 0.03;

          // Lerp color from cool gray to brand navy
          const mix = boost;
          const rr = Math.round(
            IDLE_RGB[0] + (HOT_RGB[0] - IDLE_RGB[0]) * mix
          );
          const gg = Math.round(
            IDLE_RGB[1] + (HOT_RGB[1] - IDLE_RGB[1]) * mix
          );
          const bb = Math.round(
            IDLE_RGB[2] + (HOT_RGB[2] - IDLE_RGB[2]) * mix
          );

          // Lerp alpha from near-invisible to fully opaque
          const alpha = Math.min(
            1,
            IDLE_ALPHA + breathAlpha + (HOT_ALPHA - IDLE_ALPHA) * mix
          );

          if (alpha < 0.02) continue;

          // Scale height up slightly on hover so bars stretch
          const heightScale = 1 + boost * 0.18;
          const barH = cellH * bar.hFrac * heightScale;

          ctx.fillStyle = `rgba(${rr}, ${gg}, ${bb}, ${alpha})`;
          ctx.fillRect(
            cx - bar.wPx / 2,
            cy - barH / 2,
            bar.wPx,
            barH
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

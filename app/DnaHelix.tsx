"use client";

import { useEffect, useRef, useState } from "react";

// Brand palette
const STRAND_A = "#0033a0";
const STRAND_B = "#5cb3cc";
const BASE_PAIR = "#0033a0";

// Helix geometry
const BASE_PAIRS = 28;
const AMPLITUDE = 34;
const VERTICAL_SPACING = 18;

export default function DnaHelix() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;
    let start = performance.now();
    const tick = (t: number) => {
      setTime((t - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      setTilt({ x: Math.max(-1, Math.min(1, dx)), y: Math.max(-1, Math.min(1, dy)) });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const height = BASE_PAIRS * VERTICAL_SPACING;
  const width = AMPLITUDE * 2 + 40;
  const centerX = width / 2;

  // Generate points for both strands
  const strandA: { x: number; y: number; z: number }[] = [];
  const strandB: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i < BASE_PAIRS; i++) {
    const y = 20 + i * VERTICAL_SPACING;
    const phase = (i / BASE_PAIRS) * Math.PI * 4 + time * 0.8;
    strandA.push({
      x: centerX + Math.cos(phase) * AMPLITUDE,
      y,
      z: Math.sin(phase),
    });
    strandB.push({
      x: centerX + Math.cos(phase + Math.PI) * AMPLITUDE,
      y,
      z: Math.sin(phase + Math.PI),
    });
  }

  const pathFromPoints = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const cur = pts[i];
      const midY = (prev.y + cur.y) / 2;
      d += ` C ${prev.x.toFixed(2)} ${midY.toFixed(2)}, ${cur.x.toFixed(2)} ${midY.toFixed(2)}, ${cur.x.toFixed(2)} ${cur.y.toFixed(2)}`;
    }
    return d;
  };

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
      style={{
        perspective: "1200px",
      }}
    >
      <div
        style={{
          transform: `rotateY(${tilt.x * 14}deg) rotateX(${-tilt.y * 10}deg)`,
          transition: "transform 200ms ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        <svg
          width={width * 3.2}
          height={height * 0.9}
          viewBox={`${-width * 1.1} 0 ${width * 3.2} ${height}`}
          style={{ opacity: 0.55 }}
        >
          <defs>
            <linearGradient id="strandA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={STRAND_A} stopOpacity="0" />
              <stop offset="15%" stopColor={STRAND_A} stopOpacity="0.85" />
              <stop offset="85%" stopColor={STRAND_A} stopOpacity="0.85" />
              <stop offset="100%" stopColor={STRAND_A} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="strandB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={STRAND_B} stopOpacity="0" />
              <stop offset="15%" stopColor={STRAND_B} stopOpacity="0.9" />
              <stop offset="85%" stopColor={STRAND_B} stopOpacity="0.9" />
              <stop offset="100%" stopColor={STRAND_B} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Left helix */}
          <g transform={`translate(${-width * 0.85}, 0)`}>
            <HelixGroup
              strandA={strandA}
              strandB={strandB}
              pathFromPoints={pathFromPoints}
              time={time}
            />
          </g>

          {/* Right helix */}
          <g transform={`translate(${width * 1.05}, 0)`}>
            <HelixGroup
              strandA={strandA}
              strandB={strandB}
              pathFromPoints={pathFromPoints}
              time={time}
              phaseOffset={Math.PI}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function HelixGroup({
  strandA,
  strandB,
  pathFromPoints,
  time,
  phaseOffset = 0,
}: {
  strandA: { x: number; y: number; z: number }[];
  strandB: { x: number; y: number; z: number }[];
  pathFromPoints: (pts: { x: number; y: number }[]) => string;
  time: number;
  phaseOffset?: number;
}) {
  // Recompute with optional phase offset so the two helices aren't
  // identical mirror images
  const a = strandA.map((p, i) => ({
    ...p,
    x: p.x + Math.cos(i * 0.3 + time + phaseOffset) * 0.5,
  }));
  const b = strandB.map((p, i) => ({
    ...p,
    x: p.x + Math.cos(i * 0.3 + time + phaseOffset + Math.PI) * 0.5,
  }));

  return (
    <>
      {/* Strand paths */}
      <path d={pathFromPoints(a)} stroke="url(#strandA)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d={pathFromPoints(b)} stroke="url(#strandB)" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Base pairs (rungs) — only draw when strand A is in front (z > 0) */}
      {a.map((pa, i) => {
        const pb = b[i];
        const inFront = pa.z > 0;
        const edgeFade = Math.min(1, Math.min(i, BASE_PAIRS - 1 - i) / 4);
        const shimmer = 0.35 + Math.sin(time * 2 + i * 0.6) * 0.15;
        const opacity = inFront ? shimmer * edgeFade : shimmer * 0.35 * edgeFade;
        return (
          <line
            key={i}
            x1={pa.x}
            y1={pa.y}
            x2={pb.x}
            y2={pb.y}
            stroke={BASE_PAIR}
            strokeWidth={inFront ? 1.4 : 0.9}
            strokeLinecap="round"
            opacity={opacity}
          />
        );
      })}

      {/* Nucleotide nodes on each strand */}
      {a.map((p, i) => {
        const edgeFade = Math.min(1, Math.min(i, BASE_PAIRS - 1 - i) / 4);
        const r = 1.8 + Math.max(0, p.z) * 1.6;
        return (
          <circle
            key={`a-${i}`}
            cx={p.x}
            cy={p.y}
            r={r}
            fill={STRAND_A}
            opacity={(0.45 + Math.max(0, p.z) * 0.4) * edgeFade}
          />
        );
      })}
      {b.map((p, i) => {
        const edgeFade = Math.min(1, Math.min(i, BASE_PAIRS - 1 - i) / 4);
        const r = 1.8 + Math.max(0, p.z) * 1.6;
        return (
          <circle
            key={`b-${i}`}
            cx={p.x}
            cy={p.y}
            r={r}
            fill={STRAND_B}
            opacity={(0.5 + Math.max(0, p.z) * 0.4) * edgeFade}
          />
        );
      })}
    </>
  );
}

"use client";

import { useState } from "react";
import {
  IconActivityHeartbeat,
  IconHeartbeat,
  IconSparkles,
  IconPackage,
  IconDotsCircleHorizontal,
  IconHeart,
  IconMoon,
  IconCircle,
  IconCircleDot,
  IconBrain,
  IconArrowRight,
  IconAlertCircle,
  IconCircleCheck,
  IconChevronRight,
  IconUser,
  IconBell,
  IconLock,
  IconHeartRateMonitor,
  IconToolsKitchen2,
  IconRun,
  IconPill,
  type Icon,
} from "@tabler/icons-react";

type TabId = "cgm" | "health" | "agent" | "supplies" | "more";

interface TabDef {
  id: TabId;
  label: string;
  Icon: Icon;
}

const TABS: TabDef[] = [
  { id: "cgm", label: "CGM", Icon: IconActivityHeartbeat },
  { id: "health", label: "Health", Icon: IconHeartbeat },
  { id: "agent", label: "Agent", Icon: IconSparkles },
  { id: "supplies", label: "Supplies", Icon: IconPackage },
  { id: "more", label: "More", Icon: IconDotsCircleHorizontal },
];

export default function PhoneMockup() {
  const [active, setActive] = useState<TabId>("cgm");

  return (
    <div className="relative aspect-[9/19.5] rounded-[3rem] bg-[#14171f] p-2.5 shadow-2xl shadow-[#0033a0]/15">
      <div className="w-full h-full rounded-[2.5rem] bg-[#f6f7fa] overflow-hidden flex flex-col">
        {/* Status bar */}
        <div className="h-9 flex items-center justify-between px-7 text-[10px] font-semibold text-[#14171f]">
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <span>●●●</span>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-hidden">
          {active === "cgm" && <CGMTab />}
          {active === "health" && <HealthTab />}
          {active === "agent" && <AgentTab />}
          {active === "supplies" && <SuppliesTab />}
          {active === "more" && <MoreTab />}
        </div>

        {/* Tab bar */}
        <div className="border-t border-black/[0.06] bg-white/95 backdrop-blur-sm pt-1 pb-1.5 px-1">
          <div className="flex items-center justify-around">
            {TABS.map((tab) => {
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActive(tab.id)}
                  className="flex flex-col items-center gap-0.5 px-2 py-1 transition cursor-pointer"
                  aria-label={`${tab.label} tab`}
                  aria-pressed={isActive}
                >
                  <tab.Icon
                    size={20}
                    stroke={isActive ? 2 : 1.75}
                    color={isActive ? "#0033a0" : "#94989e"}
                  />
                  <span
                    className="text-[8px] font-medium tabular-nums"
                    style={{ color: isActive ? "#0033a0" : "#94989e" }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CGM tab, main glucose dashboard
// ─────────────────────────────────────────────────────────────────────────────

function CGMTab() {
  return (
    <div className="px-4 pt-2 pb-3 h-full overflow-y-auto">
      <Header title="Today" subtitle="Tuesday, April 14" />

      {/* Glucose hero */}
      <div className="card p-3.5 mb-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[8px] font-semibold text-[#94989e] uppercase tracking-wider">
            Glucose
          </span>
          <span className="text-[7px] text-[#21c45e] font-semibold flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#21c45e]" />
            IN RANGE
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-[#14171f] tabular-nums tracking-tight leading-none">
            112
          </span>
          <span className="text-[10px] text-[#666b78] font-medium">mg/dL</span>
          <span className="text-[10px] text-[#21c45e]">→</span>
        </div>
        <svg viewBox="0 0 240 40" className="w-full h-7 mt-1.5">
          <defs>
            <linearGradient id="cgmFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#0033a0" stopOpacity="0.18" />
              <stop offset="1" stopColor="#0033a0" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,28 L24,24 L48,26 L72,18 L96,14 L120,20 L144,16 L168,11 L192,14 L216,9 L240,12 L240,40 L0,40 Z"
            fill="url(#cgmFill)"
          />
          <path
            d="M0,28 L24,24 L48,26 L72,18 L96,14 L120,20 L144,16 L168,11 L192,14 L216,9 L240,12"
            fill="none"
            stroke="#0033a0"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-black/[0.05]">
          <Stat label="TIR" value="82%" color="#21c45e" />
          <Stat label="Avg" value="124" color="#0033a0" />
          <Stat label="Rdgs" value="288" color="#5cb3cc" />
        </div>
      </div>

      {/* Vitals */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <VitalCard Icon={IconHeart} label="Heart Rate" value="72" unit="bpm" tint="#e8506e" />
        <VitalCard Icon={IconMoon} label="Sleep" value="7.2h" unit="quality: good" tint="#7c5cf2" />
        <VitalCard Icon={IconCircleDot} label="SpO₂" value="98%" unit="" tint="#5cb3cc" />
        <VitalCard Icon={IconCircle} label="HRV" value="48" unit="ms" tint="#0033a0" />
      </div>

      {/* AGP (Ambulatory Glucose Profile), last 14 days */}
      <AGPChart />
    </div>
  );
}

function AGPChart() {
  // 24 hourly data points: [hour, median, p25, p75, p5, p95]
  // Modeled on a realistic T1D day: dawn phenomenon ~6am,
  // post-breakfast spike ~9am, post-lunch ~2pm, post-dinner ~7pm.
  const data: [number, number, number, number, number, number][] = [
    [0, 108, 95, 122, 82, 138],
    [1, 102, 90, 118, 78, 134],
    [2, 98, 86, 114, 74, 128],
    [3, 96, 84, 112, 72, 128],
    [4, 100, 88, 116, 75, 134],
    [5, 108, 96, 126, 82, 148],
    [6, 118, 105, 140, 90, 165],
    [7, 132, 115, 158, 98, 185],
    [8, 148, 128, 175, 108, 205],
    [9, 156, 135, 182, 112, 215],
    [10, 138, 118, 162, 100, 190],
    [11, 120, 105, 142, 90, 168],
    [12, 128, 110, 150, 95, 180],
    [13, 152, 130, 178, 108, 208],
    [14, 158, 135, 184, 112, 218],
    [15, 140, 120, 165, 100, 192],
    [16, 122, 105, 145, 92, 170],
    [17, 118, 102, 140, 88, 164],
    [18, 135, 115, 160, 100, 188],
    [19, 148, 128, 172, 108, 200],
    [20, 132, 115, 155, 98, 180],
    [21, 122, 108, 142, 92, 168],
    [22, 115, 100, 132, 86, 155],
    [23, 110, 96, 125, 82, 142],
    [24, 108, 95, 122, 82, 138],
  ];

  // Chart geometry
  const w = 280;
  const h = 100;
  const padL = 24; // room for y labels
  const padR = 8;
  const padT = 6;
  const padB = 14; // room for x labels
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  // Y range covers all data plus a little headroom
  const yMin = 40;
  const yMax = 240;
  const yScale = (v: number) =>
    padT + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
  const xScale = (hr: number) => padL + (hr / 24) * innerW;

  // Build path strings
  const medianPath = data
    .map(([hr, med], i) => `${i === 0 ? "M" : "L"}${xScale(hr)},${yScale(med)}`)
    .join(" ");

  const iqrTop = data
    .map(([hr, , , p75], i) => `${i === 0 ? "M" : "L"}${xScale(hr)},${yScale(p75)}`)
    .join(" ");
  const iqrBottom = [...data]
    .reverse()
    .map(([hr, , p25]) => `L${xScale(hr)},${yScale(p25)}`)
    .join(" ");
  const iqrPath = `${iqrTop} ${iqrBottom} Z`;

  const outerTop = data
    .map(([hr, , , , , p95], i) => `${i === 0 ? "M" : "L"}${xScale(hr)},${yScale(p95)}`)
    .join(" ");
  const outerBottom = [...data]
    .reverse()
    .map(([hr, , , , p5]) => `L${xScale(hr)},${yScale(p5)}`)
    .join(" ");
  const outerPath = `${outerTop} ${outerBottom} Z`;

  const y70 = yScale(70);
  const y180 = yScale(180);
  const yRight = padL + innerW;

  return (
    <div className="card p-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <IconActivityHeartbeat size={11} stroke={2} color="#0033a0" />
          <span className="text-[9px] font-semibold text-[#666b78] uppercase tracking-wider">
            AGP
          </span>
          <span className="text-[8px] text-[#94989e]">Last 14 days</span>
        </div>
        <span className="text-[8px] text-[#21c45e] font-semibold">
          82% in range
        </span>
      </div>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full"
        preserveAspectRatio="none"
        aria-label="Ambulatory glucose profile, 24 hour median with variability bands"
      >
        {/* Target range band shading */}
        <rect
          x={padL}
          y={y180}
          width={innerW}
          height={y70 - y180}
          fill="#21c45e"
          fillOpacity="0.04"
        />

        {/* 5-95 percentile band */}
        <path d={outerPath} fill="#0033a0" fillOpacity="0.08" />
        {/* 25-75 IQR band */}
        <path d={iqrPath} fill="#0033a0" fillOpacity="0.18" />

        {/* Target range lines */}
        <line
          x1={padL}
          x2={yRight}
          y1={y180}
          y2={y180}
          stroke="#21c45e"
          strokeWidth="0.75"
          strokeDasharray="2,2"
          opacity="0.6"
        />
        <line
          x1={padL}
          x2={yRight}
          y1={y70}
          y2={y70}
          stroke="#21c45e"
          strokeWidth="0.75"
          strokeDasharray="2,2"
          opacity="0.6"
        />

        {/* Median line */}
        <path
          d={medianPath}
          fill="none"
          stroke="#0033a0"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Y-axis labels */}
        <text x={4} y={yScale(180) + 3} fontSize="7" fill="#94989e" fontFamily="inherit">
          180
        </text>
        <text x={4} y={yScale(70) + 3} fontSize="7" fill="#94989e" fontFamily="inherit">
          70
        </text>

        {/* X-axis labels */}
        {[0, 6, 12, 18, 24].map((hr) => {
          const label = hr === 0 || hr === 24 ? "12a" : hr === 12 ? "12p" : hr < 12 ? `${hr}a` : `${hr - 12}p`;
          const x = xScale(hr);
          const anchor = hr === 0 ? "start" : hr === 24 ? "end" : "middle";
          return (
            <text
              key={hr}
              x={x}
              y={h - 3}
              fontSize="7"
              fill="#94989e"
              fontFamily="inherit"
              textAnchor={anchor}
            >
              {label}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-0.5">
        <LegendItem color="#0033a0" label="Median" solid />
        <LegendItem color="#0033a0" label="25-75%" opacity={0.18} />
        <LegendItem color="#0033a0" label="5-95%" opacity={0.08} />
      </div>
    </div>
  );
}

function LegendItem({
  color,
  label,
  solid,
  opacity,
}: {
  color: string;
  label: string;
  solid?: boolean;
  opacity?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {solid ? (
        <div
          className="w-2.5 h-[1.5px]"
          style={{ backgroundColor: color }}
        />
      ) : (
        <div
          className="w-2.5 h-1.5 rounded-sm"
          style={{ backgroundColor: color, opacity }}
        />
      )}
      <span className="text-[7px] text-[#94989e]">{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Health tab, sleep, activity, meals, medications
// ─────────────────────────────────────────────────────────────────────────────

function HealthTab() {
  return (
    <div className="px-4 pt-2 pb-3 h-full overflow-y-auto">
      <Header title="Health" subtitle="Sleep, vitals, meals, meds" />

      {/* Sleep */}
      <div className="card p-2.5 mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <IconMoon size={11} stroke={2} color="#7c5cf2" />
            <span className="text-[9px] font-semibold text-[#666b78] uppercase tracking-wider">
              Sleep
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#7c5cf2] tabular-nums">
            7h 12m
          </span>
        </div>
        {/* Sleep stages bar */}
        <div className="flex h-3 rounded overflow-hidden mb-1.5">
          <div className="bg-[#7c5cf2]/30" style={{ width: "12%" }} />
          <div className="bg-[#5cb3cc]" style={{ width: "22%" }} />
          <div className="bg-[#0033a0]" style={{ width: "48%" }} />
          <div className="bg-[#7c5cf2]" style={{ width: "18%" }} />
        </div>
        <div className="grid grid-cols-4 gap-1 text-center">
          <SleepStage label="Awake" mins="14" color="#7c5cf2aa" />
          <SleepStage label="REM" mins="1h 35m" color="#5cb3cc" />
          <SleepStage label="Core" mins="3h 28m" color="#0033a0" />
          <SleepStage label="Deep" mins="1h 17m" color="#7c5cf2" />
        </div>
      </div>

      {/* Activity row */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <VitalCard Icon={IconRun} label="Steps" value="8,432" unit="3.4 mi" tint="#21c45e" />
        <VitalCard Icon={IconHeart} label="Active Cal" value="412" unit="kcal" tint="#f2a633" />
      </div>

      {/* Medications */}
      <div className="card p-2.5 mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <IconPill size={11} stroke={2} color="#0033a0" />
            <span className="text-[9px] font-semibold text-[#666b78] uppercase tracking-wider">
              Medications
            </span>
          </div>
          <span className="text-[8px] text-[#21c45e] font-semibold tabular-nums">
            2/3 taken
          </span>
        </div>
        <MedRow name="Lispro" dose="6 u" time="8:00a" taken />
        <MedRow name="Lisinopril" dose="10 mg" time="8:00a" taken />
        <MedRow name="Vitamin D" dose="2000 IU" time="8:00p" />
      </div>

      {/* Recent meals */}
      <div className="card p-2.5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <IconToolsKitchen2 size={11} stroke={2} color="#f2a633" />
          <span className="text-[9px] font-semibold text-[#666b78] uppercase tracking-wider">
            Today&apos;s meals
          </span>
        </div>
        <MealRow name="Greek yogurt" carbs="18g" time="8:14a" />
        <MealRow name="Turkey wrap" carbs="42g" time="12:30p" />
        <MealRow name="Apple" carbs="22g" time="3:05p" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Agent tab, Agentic Sync mini chat
// ─────────────────────────────────────────────────────────────────────────────

function AgentTab() {
  return (
    <div className="px-4 pt-2 pb-3 h-full overflow-hidden flex flex-col">
      <Header title="Islet-A1" subtitle="Agentic Sync" />

      <div className="card p-2 mb-1.5 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-[#0033a0]/[0.08] flex items-center justify-center shrink-0">
          <IconBrain size={12} stroke={2} color="#0033a0" />
        </div>
        <div className="text-[9px] text-[#666b78] flex-1">
          6 specialist agents · 20 tools
        </div>
        <span className="w-1 h-1 rounded-full bg-[#21c45e] gentle-pulse" />
      </div>

      {/* Chat preview */}
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-xl rounded-tr-sm bg-[#0033a0] text-white px-2.5 py-1.5 text-[10px] leading-snug">
            Why did I spike after lunch?
          </div>
        </div>
        <div className="text-[8px] text-[#94989e] italic px-1">
          Looking at your CGM data...
        </div>
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-[#0033a0]/15 rounded-md">
          <IconActivityHeartbeat size={9} stroke={2} color="#0033a0" />
          <span className="text-[8px] font-mono text-[#0033a0]">
            analyze_meal_impact
          </span>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[88%] rounded-xl rounded-tl-sm bg-white border border-black/[0.05] px-2.5 py-1.5 text-[9px] text-[#14171f] leading-snug">
            <div className="font-semibold mb-0.5">75 mg/dL spike from pasta.</div>
            <div className="text-[#666b78] text-[8.5px]">
              Try pre-bolusing 15 min earlier next time.
            </div>
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-1.5 mt-1.5">
        <div className="flex-1 px-2.5 py-1.5 bg-white border border-black/[0.05] rounded-lg text-[8px] text-[#94989e]">
          Ask anything...
        </div>
        <div className="w-6 h-6 rounded-md bg-[#0033a0] flex items-center justify-center">
          <IconArrowRight size={11} stroke={2.5} color="white" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Supplies tab
// ─────────────────────────────────────────────────────────────────────────────

function SuppliesTab() {
  return (
    <div className="px-4 pt-2 pb-3 h-full overflow-hidden">
      <Header title="Supplies" subtitle="3 items, 1 needs reorder" />

      {/* Alert */}
      <div className="rounded-lg bg-[#f2a633]/[0.08] border border-[#f2a633]/30 p-2 mb-2 flex items-center gap-1.5">
        <IconAlertCircle size={12} stroke={2} color="#f2a633" />
        <span className="text-[9px] text-[#7a5a14] font-medium">
          G7 sensors: 2 left, ~6 days
        </span>
      </div>

      <div className="space-y-1.5">
        <SupplyRow
          name="Dexcom G7 Sensors"
          qty="2"
          days="~6 days left"
          urgent
        />
        <SupplyRow
          name="Omnipod 5 Pods"
          qty="8"
          days="~24 days left"
        />
        <SupplyRow
          name="Humalog Vials"
          qty="4"
          days="~32 days left"
        />
        <SupplyRow
          name="Glucose Tabs"
          qty="48"
          days="Plenty"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// More tab, settings list
// ─────────────────────────────────────────────────────────────────────────────

function MoreTab() {
  return (
    <div className="px-4 pt-2 pb-3 h-full overflow-hidden">
      <Header title="More" subtitle="Settings & connected services" />

      {/* Profile pill */}
      <div className="card p-3 mb-2 flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0033a0] to-[#5cb3cc] flex items-center justify-center">
          <IconUser size={18} stroke={2} color="white" />
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-semibold text-[#14171f]">
            Anthony L.
          </div>
          <div className="text-[8px] text-[#94989e]">
            Type 1 · Dexcom G7 · Omnipod 5
          </div>
        </div>
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        <SettingRow Icon={IconHeartRateMonitor} label="Connected devices" tint="#0033a0" />
        <SettingRow Icon={IconBell} label="Notifications" tint="#f2a633" />
        <SettingRow Icon={IconLock} label="Privacy & data" tint="#21c45e" />
        <SettingRow Icon={IconCircleCheck} label="HealthKit access" tint="#7c5cf2" last />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared mini-components
// ─────────────────────────────────────────────────────────────────────────────

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-2.5">
      <div className="text-[16px] font-bold text-[#14171f] tracking-tight leading-tight">
        {title}
      </div>
      <div className="text-[9px] text-[#94989e]">{subtitle}</div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <div className="text-xs font-bold tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="text-[7px] text-[#94989e] uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function VitalCard({
  Icon,
  label,
  value,
  unit,
  tint,
}: {
  Icon: Icon;
  label: string;
  value: string;
  unit: string;
  tint: string;
}) {
  return (
    <div className="card p-2">
      <div className="flex items-center gap-1 mb-0.5">
        <Icon size={10} stroke={2} color={tint} />
        <span className="text-[7.5px] font-semibold text-[#666b78]">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[14px] font-bold text-[#14171f] tabular-nums leading-none">
          {value}
        </span>
        {unit && <span className="text-[7px] text-[#94989e]">{unit}</span>}
      </div>
    </div>
  );
}

function SleepStage({
  label,
  mins,
  color,
}: {
  label: string;
  mins: string;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-center gap-1">
        <span
          className="w-1 h-1 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-[7px] text-[#666b78] font-medium">{label}</span>
      </div>
      <div className="text-[7.5px] text-[#94989e] tabular-nums">{mins}</div>
    </div>
  );
}

function MealRow({
  name,
  carbs,
  time,
}: {
  name: string;
  carbs: string;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between py-1 border-t border-black/[0.04] first:border-t-0">
      <span className="text-[9px] text-[#14171f] font-medium">{name}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-[8px] text-[#f2a633] font-semibold tabular-nums">
          {carbs}
        </span>
        <span className="text-[7px] text-[#94989e] tabular-nums">{time}</span>
      </div>
    </div>
  );
}

function MedRow({
  name,
  dose,
  time,
  taken,
}: {
  name: string;
  dose: string;
  time: string;
  taken?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 py-1 border-t border-black/[0.04] first:border-t-0">
      <IconCircleCheck
        size={10}
        stroke={2}
        color={taken ? "#21c45e" : "#94989e"}
      />
      <span
        className={`text-[9px] font-medium ${
          taken ? "text-[#94989e] line-through" : "text-[#14171f]"
        }`}
      >
        {name}
      </span>
      <span className="text-[8px] text-[#94989e] tabular-nums">{dose}</span>
      <div className="flex-1" />
      <span className="text-[7px] text-[#94989e] tabular-nums">{time}</span>
    </div>
  );
}

function SupplyRow({
  name,
  qty,
  days,
  urgent,
}: {
  name: string;
  qty: string;
  days: string;
  urgent?: boolean;
}) {
  return (
    <div className="card p-2 flex items-center gap-2">
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center"
        style={{
          backgroundColor: urgent ? "#f2a633" + "14" : "#5cb3cc" + "14",
        }}
      >
        <IconPackage
          size={11}
          stroke={2}
          color={urgent ? "#f2a633" : "#5cb3cc"}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[9px] font-semibold text-[#14171f] truncate">
          {name}
        </div>
        <div className="text-[7.5px] text-[#94989e]">{days}</div>
      </div>
      <div className="text-[11px] font-bold text-[#14171f] tabular-nums">
        {qty}
      </div>
    </div>
  );
}

function SettingRow({
  Icon,
  label,
  tint,
  last,
}: {
  Icon: Icon;
  label: string;
  tint: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 px-3 py-2 ${
        last ? "" : "border-b border-black/[0.05]"
      }`}
    >
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center"
        style={{ backgroundColor: tint + "14" }}
      >
        <Icon size={12} stroke={2} color={tint} />
      </div>
      <span className="flex-1 text-[10px] text-[#14171f] font-medium">
        {label}
      </span>
      <IconChevronRight size={11} stroke={2} color="#94989e" />
    </div>
  );
}

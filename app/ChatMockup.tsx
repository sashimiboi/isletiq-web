"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  IconBrain,
  IconChartLine,
  IconArrowRight,
  IconMicrophone,
} from "@tabler/icons-react";

// Stages of the animated conversation playback:
//   0 = idle (nothing shown yet)
//   1 = user message slides in
//   2 = thinking indicator appears
//   3 = tool call pill appears
//   4 = tool result appears
//   5 = typing dots (agent is generating)
//   6 = typing dots replaced by answer bubble
//   7 = quick action chips appear, full state held
//   then back to 0 to loop
const TIMELINE_MS = [
  500,  // -> stage 1
  1100, // -> stage 2
  800,  // -> stage 3
  900,  // -> stage 4
  700,  // -> stage 5 (typing)
  1200, // -> stage 6 (answer)
  1400, // -> stage 7 (chips)
  4800, // -> stage 0 (reset)
];

export default function ChatMockup() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const advance = (nextStage: number) => {
      if (cancelled) return;
      setStage(nextStage);
      const nextIdx = (nextStage + 1) % 8;
      const delay = TIMELINE_MS[nextStage];
      timer = setTimeout(() => advance(nextIdx), delay);
    };

    timer = setTimeout(() => advance(1), TIMELINE_MS[0]);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const show = (minStage: number) => stage >= minStage && stage < 8;

  return (
    <div className="card border border-black/[0.04] overflow-hidden shadow-xl shadow-[#0033a0]/[0.08]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-black/[0.05] bg-gradient-to-b from-white to-[#fafbfd]">
        <div className="w-9 h-9 rounded-xl bg-[#0033a0]/[0.08] flex items-center justify-center">
          <IconBrain size={20} stroke={1.75} color="#0033a0" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-[#14171f]">Islet-A1</div>
          <div className="text-[10px] text-[#94989e]">
            General-purpose CGM & pump assistant
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[#21c45e] font-medium">
          <div className="w-1.5 h-1.5 rounded-full bg-[#21c45e] gentle-pulse" />
          Online
        </div>
      </div>

      {/* Messages */}
      <div className="px-5 py-5 space-y-4 bg-[#fafbfd] min-h-[420px]">
        {/* User message */}
        <Appear visible={show(1)} className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-[#0033a0] text-white px-4 py-2.5 text-sm leading-relaxed shadow-sm">
            Why did I spike after lunch yesterday?
          </div>
        </Appear>

        {/* Assistant: thinking + tool call + answer */}
        <div className="space-y-2">
          <Appear visible={show(2)} className="flex items-start gap-2 px-1">
            <div className="w-1 h-1 rounded-full bg-[#0033a0]/40 mt-2" />
            <div className="text-[11px] text-[#94989e] italic">
              Looking at your CGM data from yesterday afternoon...
            </div>
          </Appear>

          <Appear
            visible={show(3)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-[#0033a0]/15 rounded-lg max-w-fit"
          >
            <div className="w-5 h-5 rounded bg-[#0033a0]/[0.08] flex items-center justify-center">
              <IconChartLine size={12} stroke={2} color="#0033a0" />
            </div>
            <span className="text-[11px] font-mono text-[#0033a0]">
              analyze_meal_impact
            </span>
            <span className="text-[10px] text-[#94989e]">
              meal: lunch · window: 3h
            </span>
          </Appear>

          <Appear
            visible={show(4)}
            className="flex items-center gap-2 px-3 py-1.5 max-w-fit"
          >
            <IconArrowRight size={12} stroke={2} color="#21c45e" />
            <span className="text-[10px] text-[#21c45e] font-medium">
              Pattern found across last 7 lunches
            </span>
          </Appear>

          {/* Response slot: typing dots then answer, stacked so only
              one is visible at a time but layout stays stable */}
          <div className="relative min-h-[170px]">
            <Appear
              visible={stage === 5}
              className="absolute inset-x-0 top-0 flex items-center gap-1.5 px-4 py-3 bg-white border border-black/[0.05] rounded-2xl rounded-tl-md max-w-fit shadow-sm"
            >
              <Dot delay={0} />
              <Dot delay={150} />
              <Dot delay={300} />
            </Appear>

            <Appear
              visible={stage >= 6 && stage < 8}
              className="absolute inset-x-0 top-0 flex justify-start"
            >
              <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white border border-black/[0.05] px-4 py-3 text-sm text-[#14171f] leading-relaxed shadow-sm">
                <div className="font-semibold mb-1.5">
                  Pasta caused a 75 mg/dL spike.
                </div>
                <div className="text-[#666b78] text-[13px]">
                  You went from 108 → 183 mg/dL in 45 min, peaking around 1:15
                  PM. Your insulin-to-carb ratio for lunch (1:12) handled the
                  fast carbs well, but the bolus timing was the issue, you
                  bolused at the first bite instead of pre-bolusing.
                </div>
                <div className="mt-2.5 pt-2.5 border-t border-black/[0.05] text-[12px] text-[#0033a0] font-medium">
                  Try pre-bolusing 15 min earlier next time?
                </div>
              </div>
            </Appear>
          </div>
        </div>

        {/* Quick action chips */}
        <Appear visible={show(7)} className="flex flex-wrap gap-1.5 pt-1">
          <Chip>Show me other meals like this</Chip>
          <Chip>Set a pre-bolus reminder</Chip>
          <Chip>Generate report for endo</Chip>
        </Appear>
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-black/[0.05] bg-white">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-[#f2f3f6] rounded-xl">
          <span className="text-xs text-[#94989e]">
            Ask anything about your data...
          </span>
        </div>
        <button
          type="button"
          className="w-9 h-9 rounded-xl bg-[#0033a0]/[0.08] flex items-center justify-center hover:bg-[#0033a0]/[0.12] transition"
          aria-label="Voice mode"
        >
          <IconMicrophone size={16} stroke={1.75} color="#0033a0" />
        </button>
        <button
          type="button"
          className="w-9 h-9 rounded-xl bg-[#0033a0] flex items-center justify-center hover:bg-[#002d8f] transition"
          aria-label="Send"
        >
          <IconArrowRight size={16} stroke={2.25} color="white" />
        </button>
      </div>
    </div>
  );
}

function Appear({
  visible,
  className = "",
  children,
}: {
  visible: boolean;
  className?: string;
  children: ReactNode;
}) {
  const base = "transition-all duration-500 ease-out";
  const state = visible
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-1 pointer-events-none";
  return (
    <div className={`${base} ${state} ${className}`} aria-hidden={!visible}>
      {children}
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="block w-1.5 h-1.5 rounded-full bg-[#0033a0]/60 animate-bounce"
      style={{ animationDelay: `${delay}ms`, animationDuration: "1s" }}
    />
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="text-[10px] px-2.5 py-1 rounded-full bg-white border border-[#0033a0]/15 text-[#0033a0] font-medium hover:bg-[#0033a0]/[0.04] transition"
    >
      {children}
    </button>
  );
}

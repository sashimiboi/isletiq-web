import Image from "next/image";
import Link from "next/link";
import PhoneMockup from "./PhoneMockup";
import {
  IconChartLine,
  IconChartAreaLine,
  IconDroplet,
  IconToolsKitchen2,
  IconHeartbeat,
  IconMoon,
  IconDeviceWatch,
  IconRobot,
  IconPackage,
  IconShieldCheck,
  IconShieldOff,
  IconLock,
  IconSparkles,
  IconMicrophone,
  IconCamera,
  IconPill,
  IconBrain,
  IconArrowRight,
  type Icon,
} from "@tabler/icons-react";

export default function Home() {
  return (
    <main className="flex-1">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <AgenticSync />
      <Privacy />
      <CTA />
      <Footer />
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Nav
// ─────────────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[#f6f7fa]/80 border-b border-black/[0.06]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/islet-logo.png"
            alt="IsletIQ logo"
            width={32}
            height={32}
            className="rounded-lg"
            priority
          />
          <span className="font-semibold tracking-tight text-lg text-[#14171f]">
            IsletIQ
          </span>
        </Link>
        <div className="hidden sm:flex items-center gap-8 text-sm text-[#666b78]">
          <a href="#features" className="hover:text-[#0033a0] transition">
            Features
          </a>
          <a href="#how" className="hover:text-[#0033a0] transition">
            How it works
          </a>
          <a href="#privacy" className="hover:text-[#0033a0] transition">
            Privacy
          </a>
        </div>
        <a
          href="#waitlist"
          className="text-sm px-4 py-2 rounded-xl bg-[#0033a0] text-white font-medium hover:bg-[#002d8f] transition shadow-sm"
        >
          Join waitlist
        </a>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Subtle gradient backdrop, soft blue radial */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] -z-10 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(92, 179, 204, 0.15) 0%, rgba(0, 51, 160, 0.08) 35%, transparent 65%)",
        }}
      />
      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <div className="float-in inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white border border-[#0033a0]/10 shadow-sm text-xs text-[#666b78] mb-8">
          <span className="w-1.5 h-1.5 rounded-xl bg-[#21c45e] gentle-pulse" />
          Built for people living with Type 1 Diabetes
        </div>
        <h1
          className="float-in text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 text-[#14171f]"
          style={{ animationDelay: "0.1s" }}
        >
          Your Type 1 Diabetes
          <br />
          <span className="text-[#0033a0]">co-pilot.</span>
        </h1>
        <p
          className="float-in text-lg sm:text-xl text-[#666b78] max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ animationDelay: "0.2s" }}
        >
          Glucose, insulin, sleep, vitals, and AI guidance, unified in one
          app. Built on Apple Health with Dexcom, LibreLink, and Apple Watch
          support.
        </p>
        <div
          className="float-in flex flex-col sm:flex-row gap-3 items-center justify-center"
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="#waitlist"
            className="px-8 py-3.5 rounded-xl bg-[#0033a0] text-white font-semibold hover:bg-[#002d8f] transition shadow-lg shadow-[#0033a0]/20"
          >
            Join the waitlist
          </a>
          <a
            href="#features"
            className="px-8 py-3.5 rounded-xl bg-white border border-black/[0.08] text-[#14171f] hover:bg-[#f2f3f6] transition"
          >
            See what it does
          </a>
        </div>
        <p
          className="float-in mt-6 text-xs text-[#94989e]"
          style={{ animationDelay: "0.4s" }}
        >
          Coming soon to the App Store · iPhone, iPad & Apple Watch
        </p>
      </div>

      {/* Phone mockup, mirrors actual app dashboard look */}
      <div
        className="float-in relative mt-20 max-w-[340px] mx-auto px-6"
        style={{ animationDelay: "0.5s" }}
      >
        <PhoneMockup />
      </div>
    </section>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Features
// ─────────────────────────────────────────────────────────────────────────────

type FeatureCard = {
  Icon: Icon;
  title: string;
  body: string;
  tint: string;
};

const FEATURES: FeatureCard[] = [
  {
    Icon: IconChartLine,
    title: "Live CGM streaming",
    body: "Connect Dexcom, LibreLink, or any HealthKit-compatible CGM. Glucose, trends, and time-in-range, always within a glance.",
    tint: "#0033a0",
  },
  {
    Icon: IconDroplet,
    title: "Insulin & pump tracking",
    body: "Log boluses or sync from your pump automatically. See basal rate, IOB, and dose history alongside your glucose curve.",
    tint: "#5cb3cc",
  },
  {
    Icon: IconToolsKitchen2,
    title: "Meals & carbs",
    body: "Quick log meals with macros. Photo input and AI carb estimation. Everything writes back to Apple Health.",
    tint: "#f2a633",
  },
  {
    Icon: IconHeartbeat,
    title: "Vitals & recovery",
    body: "Heart rate, HRV, VO₂ Max, blood pressure, body temperature, blood oxygen. Every signal that matters for diabetes management.",
    tint: "#e8506e",
  },
  {
    Icon: IconMoon,
    title: "Sleep insights",
    body: "Stage-by-stage sleep tracking with bedtime, wake, and quality scoring. See how sleep impacts your glucose.",
    tint: "#7c5cf2",
  },
  {
    Icon: IconDeviceWatch,
    title: "Apple Watch native",
    body: "Glucose, supplies, medications, and quick-log right on your wrist. Critical alerts when you need them.",
    tint: "#14171f",
  },
  {
    Icon: IconRobot,
    title: "Agentic Sync",
    body: "Voice and chat AI that knows your data. Ask about trends, dosing, meals, or get a daily summary.",
    tint: "#0033a0",
  },
  {
    Icon: IconPackage,
    title: "Supplies & meds",
    body: "Track pump supplies, sensors, and prescriptions. Get alerts before you run out, no more 2 AM surprises.",
    tint: "#5cb3cc",
  },
  {
    Icon: IconChartAreaLine,
    title: "Glycemic Impact",
    body: "See exactly how each meal hits you. Personal Glycemic Impact Score from your own CGM data, benchmarked against published GI.",
    tint: "#f2a633",
  },
];

function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold text-[#0033a0] uppercase tracking-widest mb-3">
            Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-[#14171f]">
            Everything in one place.
          </h2>
          <p className="text-[#666b78] text-lg max-w-2xl mx-auto">
            T1D management is fragmented across a dozen apps. IsletIQ unifies
            them.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="card card-hover p-6 border border-black/[0.04]"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${f.tint}14` }}
              >
                <f.Icon size={22} stroke={1.75} color={f.tint} />
              </div>
              <h3 className="font-semibold text-[#14171f] mb-2">{f.title}</h3>
              <p className="text-sm text-[#666b78] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// How it works
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: "01",
    title: "Connect your CGM",
    body: "Sign in to Dexcom or LibreLink. IsletIQ pulls your readings every minute and writes them to Apple Health.",
  },
  {
    n: "02",
    title: "Authorize Apple Health",
    body: "Grant read/write access for glucose, insulin, sleep, heart rate, and meals. Your data stays on-device or in your account, never sold.",
  },
  {
    n: "03",
    title: "Live your day",
    body: "Get a live dashboard, smart alerts, and AI insights. Log meals and meds in seconds from iPhone or Apple Watch.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold text-[#0033a0] uppercase tracking-widest mb-3">
            How it works
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-[#14171f]">
            Three steps to a simpler day.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-8 border border-black/[0.04]">
              <div className="text-5xl font-bold text-[#0033a0]/15 mb-4 tabular-nums">
                {s.n}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#14171f]">
                {s.title}
              </h3>
              <p className="text-[#666b78] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Agentic Sync (the agentic AI section)
// ─────────────────────────────────────────────────────────────────────────────

function AgenticSync() {
  return (
    <section className="relative py-24 sm:py-32 bg-white overflow-hidden">
      {/* Soft brand glow behind the section */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[700px] -z-10 opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0, 51, 160, 0.08) 0%, rgba(92, 179, 204, 0.05) 35%, transparent 65%)",
        }}
      />
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0033a0]/[0.06] text-[#0033a0] mb-4">
            <IconSparkles size={14} stroke={2} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Agentic Sync
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-[#14171f]">
            An agent that knows
            <br />
            <span className="text-[#0033a0]">your diabetes.</span>
          </h2>
          <p className="text-[#666b78] text-lg max-w-2xl mx-auto leading-relaxed">
            Seven specialist agents and twenty-four tools, working together.
            Ask questions in plain English. Get answers grounded in your
            actual CGM, insulin, sleep, and meal data.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: capabilities */}
          <div className="space-y-5">
            <Capability
              Icon={IconBrain}
              tint="#0033a0"
              title="Seven specialist agents"
              body="Islet-A1 is the orchestrator. CGM, Pump, Nutrition, Supplies, Medications, and Glycemic Impact agents handle their domains. They hand off to each other when a question crosses boundaries."
            />
            <Capability
              Icon={IconSparkles}
              tint="#5cb3cc"
              title="Tools, not just answers"
              body="The agent calls real tools like analyze_glucose_trends, calculate_bolus, log_meal_request, and search_clinical_trials. You see what it called and what it returned, every time."
            />
            <Capability
              Icon={IconMicrophone}
              tint="#7c5cf2"
              title="Voice or chat"
              body="Hands-free voice mode for cooking, driving, or workouts. Tap and talk. Full ElevenLabs natural voice synthesis on the way back."
            />
            <Capability
              Icon={IconCamera}
              tint="#f2a633"
              title="Snap your meal"
              body="Point your camera at a plate. The agent estimates carbs, protein, fat, and offers to log it to Apple Health."
            />
            <Capability
              Icon={IconPill}
              tint="#21c45e"
              title="Snap your meds"
              body="Point your camera at a pill bottle or prescription label. The agent reads the name, dose, and frequency, and adds it to your medication schedule."
            />
            <Capability
              Icon={IconPackage}
              tint="#5cb3cc"
              title="Snap your supplies"
              body="Point your camera at any diabetes supply box. The agent recognizes the product, adds it to your inventory, and tracks usage so you never run out."
            />
            <Capability
              Icon={IconChartAreaLine}
              tint="#f2a633"
              title="Glycemic Impact Score"
              body="Every meal gets a personal 0-100 score computed from your own CGM data, not a one-size-fits-all GI table. See which foods spike you harder than average and pre-bolus with confidence."
            />
          </div>

          {/* Right column. The inner wrapper is sticky on desktop so the
              chat stays in view while the user scrolls through the
              capability bullets, eliminating the empty gap below. */}
          <div>
            <div className="lg:sticky lg:top-24">
              <ChatMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Capability({
  Icon,
  tint,
  title,
  body,
}: {
  Icon: Icon;
  tint: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-4">
      <div
        className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${tint}14` }}
      >
        <Icon size={24} stroke={1.75} color={tint} />
      </div>
      <div>
        <h3 className="font-semibold text-[#14171f] mb-1">{title}</h3>
        <p className="text-sm text-[#666b78] leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function ChatMockup() {
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
      <div className="px-5 py-5 space-y-4 bg-[#fafbfd]">
        {/* User message */}
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-[#0033a0] text-white px-4 py-2.5 text-sm leading-relaxed shadow-sm">
            Why did I spike after lunch yesterday?
          </div>
        </div>

        {/* Assistant: thinking + tool call + answer */}
        <div className="space-y-2">
          {/* Thinking step */}
          <div className="flex items-start gap-2 px-1">
            <div className="w-1 h-1 rounded-full bg-[#0033a0]/40 mt-2" />
            <div className="text-[11px] text-[#94989e] italic">
              Looking at your CGM data from yesterday afternoon...
            </div>
          </div>
          {/* Tool call pill */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#0033a0]/15 rounded-lg max-w-fit">
            <div className="w-5 h-5 rounded bg-[#0033a0]/[0.08] flex items-center justify-center">
              <IconChartLine size={12} stroke={2} color="#0033a0" />
            </div>
            <span className="text-[11px] font-mono text-[#0033a0]">
              analyze_meal_impact
            </span>
            <span className="text-[10px] text-[#94989e]">
              meal: lunch · window: 3h
            </span>
          </div>
          {/* Tool result pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 max-w-fit">
            <IconArrowRight size={12} stroke={2} color="#21c45e" />
            <span className="text-[10px] text-[#21c45e] font-medium">
              Pattern found across last 7 lunches
            </span>
          </div>
          {/* Final answer bubble */}
          <div className="flex justify-start">
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
          </div>
        </div>

        {/* Quick action chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Chip>Show me other meals like this</Chip>
          <Chip>Set a pre-bolus reminder</Chip>
          <Chip>Generate report for endo</Chip>
        </div>
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

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="text-[10px] px-2.5 py-1 rounded-full bg-white border border-[#0033a0]/15 text-[#0033a0] font-medium hover:bg-[#0033a0]/[0.04] transition"
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Privacy
// ─────────────────────────────────────────────────────────────────────────────

function Privacy() {
  return (
    <section id="privacy" className="relative py-24 sm:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="text-xs font-semibold text-[#0033a0] uppercase tracking-widest mb-3">
          Privacy
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-[#14171f]">
          Your health data
          <br />
          <span className="text-[#0033a0]">stays yours.</span>
        </h2>
        <p className="text-[#666b78] text-lg max-w-2xl mx-auto leading-relaxed mb-12">
          IsletIQ is built on Apple HealthKit. We never sell your data, never
          use it for ads, and never train models on it. All traffic is
          encrypted end-to-end. You can export or delete everything, anytime.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <PrivacyBadge
            Icon={IconShieldCheck}
            tint="#0033a0"
            title="HealthKit native"
            body="Built on Apple's privacy framework"
          />
          <PrivacyBadge
            Icon={IconShieldOff}
            tint="#21c45e"
            title="No ad tracking"
            body="Zero third-party trackers"
          />
          <PrivacyBadge
            Icon={IconLock}
            tint="#5cb3cc"
            title="Encrypted"
            body="TLS 1.3 in transit, encrypted at rest"
          />
        </div>
      </div>
    </section>
  );
}

function PrivacyBadge({
  Icon,
  tint,
  title,
  body,
}: {
  Icon: Icon;
  tint: string;
  title: string;
  body: string;
}) {
  return (
    <div className="card p-6 border border-black/[0.04] text-left">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
        style={{ backgroundColor: `${tint}14` }}
      >
        <Icon size={22} stroke={1.75} color={tint} />
      </div>
      <div className="font-semibold text-[#14171f] mb-1">{title}</div>
      <div className="text-xs text-[#666b78]">{body}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section id="waitlist" className="relative py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <Image
          src="/app-icon-256.png"
          alt="IsletIQ app icon"
          width={88}
          height={88}
          className="mx-auto mb-6 rounded-2xl shadow-lg shadow-[#0033a0]/10"
        />
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-[#14171f]">
          Be first to know.
        </h2>
        <p className="text-[#666b78] text-lg mb-10">
          We&apos;re finalizing the App Store launch. Join the waitlist for
          early access and TestFlight invites.
        </p>
        <form
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          action="https://formsubmit.co/hello@isletiq.com"
          method="POST"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="flex-1 px-5 py-3.5 rounded-xl bg-white border border-black/[0.08] text-[#14171f] placeholder:text-[#94989e] focus:outline-none focus:border-[#0033a0]/40 focus:ring-2 focus:ring-[#0033a0]/10 transition"
          />
          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl bg-[#0033a0] text-white font-semibold hover:bg-[#002d8f] transition shadow-lg shadow-[#0033a0]/20"
          >
            Join waitlist
          </button>
        </form>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-black/[0.06] py-12 bg-white">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <Image
            src="/islet-logo.png"
            alt="IsletIQ logo"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="font-semibold text-[#14171f]">IsletIQ</span>
          <span className="text-xs text-[#94989e] ml-3">
            © {new Date().getFullYear()} IsletIQ
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#666b78]">
          <a href="/privacy" className="hover:text-[#0033a0] transition">
            Privacy
          </a>
          <a href="/terms" className="hover:text-[#0033a0] transition">
            Terms
          </a>
          <a
            href="mailto:hello@isletiq.com"
            className="hover:text-[#0033a0] transition"
          >
            Contact
          </a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-6 text-xs text-[#94989e] text-center">
        Not a medical device. IsletIQ is for informational and educational
        purposes only and is not a substitute for professional medical advice,
        diagnosis, or treatment.
      </div>
    </footer>
  );
}

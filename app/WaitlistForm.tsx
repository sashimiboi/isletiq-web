"use client";

import { useActionState } from "react";
import { joinWaitlist, type JoinWaitlistState } from "./actions";

const initialState: JoinWaitlistState = { status: "idle" };

export default function WaitlistForm() {
  const [state, formAction, isPending] = useActionState(
    joinWaitlist,
    initialState
  );

  return (
    <div className="max-w-md mx-auto">
      <form
        action={formAction}
        className="flex flex-col sm:flex-row gap-3"
        aria-describedby="waitlist-status"
      >
        <input type="hidden" name="source" value="hero_waitlist" />
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          disabled={isPending || state.status === "success"}
          className="flex-1 px-5 py-3.5 rounded-xl bg-white border border-black/[0.08] text-[#14171f] placeholder:text-[#94989e] focus:outline-none focus:border-[#0033a0]/40 focus:ring-2 focus:ring-[#0033a0]/10 transition disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isPending || state.status === "success"}
          className="px-6 py-3.5 rounded-xl bg-[#0033a0] text-white font-semibold hover:bg-[#002d8f] transition shadow-lg shadow-[#0033a0]/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending
            ? "Joining..."
            : state.status === "success"
            ? "You're in"
            : "Join waitlist"}
        </button>
      </form>
      <div id="waitlist-status" className="min-h-[1.5rem] mt-3 text-sm">
        {state.status === "success" && (
          <p className="text-[#21c45e] font-medium">{state.message}</p>
        )}
        {state.status === "error" && (
          <p className="text-[#e8506e] font-medium">{state.message}</p>
        )}
      </div>
    </div>
  );
}

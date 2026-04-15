"use server";

import { headers } from "next/headers";
import { sql, ensureWaitlistSchema } from "./lib/db";

// Conservative email pattern: local part + @ + domain with at least
// one dot. Rejects obvious garbage without being RFC pedantic.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type JoinWaitlistState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function joinWaitlist(
  _prev: JoinWaitlistState,
  formData: FormData
): Promise<JoinWaitlistState> {
  const rawEmail = formData.get("email");
  if (typeof rawEmail !== "string") {
    return { status: "error", message: "Missing email." };
  }
  const email = rawEmail.trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 320) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const source = (formData.get("source") as string) || "hero";

  try {
    await ensureWaitlistSchema();

    const hdrs = await headers();
    const userAgent = hdrs.get("user-agent") ?? null;
    const referrer = hdrs.get("referer") ?? null;

    // Upsert so repeated submissions from the same address don't
    // error out. updated_at bumps on re-signup so we can track
    // return visits.
    await sql`
      INSERT INTO waitlist_signups (email, source, user_agent, referrer)
      VALUES (${email}, ${source}, ${userAgent}, ${referrer})
      ON CONFLICT (email) DO UPDATE
      SET updated_at = NOW(),
          source = EXCLUDED.source,
          user_agent = EXCLUDED.user_agent,
          referrer = EXCLUDED.referrer
    `;

    return {
      status: "success",
      message: "You're on the list. We'll be in touch.",
    };
  } catch (err) {
    console.error("joinWaitlist failed", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again in a moment.",
    };
  }
}

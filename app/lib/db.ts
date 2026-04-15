import { neon } from "@neondatabase/serverless";

// Single shared SQL client against the pooled Neon connection.
// The STORAGE_ISLETIQ_* env vars come from the neon-emerald-canvas
// database provisioned via the Vercel Marketplace with a storage
// prefix of STORAGE_ISLETIQ.
export const sql = neon(process.env.STORAGE_ISLETIQ_DATABASE_URL!);

// Lazy one-time schema init. First server action or admin page load
// runs this; the CREATE TABLE IF NOT EXISTS is idempotent so it's
// safe to call repeatedly. The promise is memoized so concurrent
// callers share one migration run.
let ready: Promise<void> | null = null;

export function ensureWaitlistSchema(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS waitlist_signups (
          id          BIGSERIAL PRIMARY KEY,
          email       TEXT NOT NULL UNIQUE,
          source      TEXT,
          user_agent  TEXT,
          referrer    TEXT,
          created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
    })().catch((err) => {
      // Reset on failure so the next request retries
      ready = null;
      throw err;
    });
  }
  return ready;
}

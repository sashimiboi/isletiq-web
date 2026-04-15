import { sql, ensureWaitlistSchema } from "../../../lib/db";

interface SignupRow {
  id: number;
  email: string;
  source: string | null;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
  updated_at: string;
}

function csvEscape(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureWaitlistSchema();
  const rows = (await sql`
    SELECT id, email, source, user_agent, referrer, created_at, updated_at
    FROM waitlist_signups
    ORDER BY created_at DESC
  `) as unknown as SignupRow[];

  const header = [
    "id",
    "email",
    "source",
    "user_agent",
    "referrer",
    "created_at",
    "updated_at",
  ].join(",");

  const body = rows
    .map((r) =>
      [
        r.id,
        r.email,
        r.source,
        r.user_agent,
        r.referrer,
        r.created_at,
        r.updated_at,
      ]
        .map(csvEscape)
        .join(",")
    )
    .join("\n");

  const csv = header + "\n" + body + "\n";
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="isletiq-waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

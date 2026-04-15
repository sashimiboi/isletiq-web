import { sql, ensureWaitlistSchema } from "../../lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SignupRow {
  id: number;
  email: string;
  source: string | null;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
  updated_at: string;
}

async function getSignups(): Promise<SignupRow[]> {
  await ensureWaitlistSchema();
  const rows = (await sql`
    SELECT id, email, source, user_agent, referrer, created_at, updated_at
    FROM waitlist_signups
    ORDER BY created_at DESC
    LIMIT 500
  `) as unknown as SignupRow[];
  return rows;
}

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export default async function WaitlistAdminPage() {
  const signups = await getSignups();

  return (
    <main className="min-h-screen bg-[#f6f7fa] py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#14171f]">
              Waitlist
            </h1>
            <p className="text-sm text-[#666b78] mt-1">
              {signups.length} signup{signups.length === 1 ? "" : "s"}
              {signups.length >= 500 ? " (showing latest 500)" : ""}
            </p>
          </div>
          <a
            href="/api/admin/waitlist.csv"
            className="text-sm px-4 py-2 rounded-lg bg-[#0033a0] text-white font-medium hover:bg-[#002d8f] transition"
          >
            Export CSV
          </a>
        </div>

        {signups.length === 0 ? (
          <div className="card p-12 text-center border border-black/[0.04]">
            <p className="text-[#666b78]">
              No signups yet. Submissions will appear here the moment someone
              joins.
            </p>
          </div>
        ) : (
          <div className="card border border-black/[0.04] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white border-b border-black/[0.05]">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold text-[#666b78] text-xs uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 font-semibold text-[#666b78] text-xs uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-4 py-3 font-semibold text-[#666b78] text-xs uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 py-3 font-semibold text-[#666b78] text-xs uppercase tracking-wider">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {signups.map((row, i) => (
                  <tr
                    key={row.id}
                    className={
                      i % 2 === 0 ? "bg-white" : "bg-[#fafbfd]"
                    }
                  >
                    <td className="px-4 py-3 font-medium text-[#14171f]">
                      {row.email}
                    </td>
                    <td className="px-4 py-3 text-[#666b78]">
                      {row.source ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-[#666b78]">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-4 py-3 text-[#666b78]">
                      {formatDate(row.updated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

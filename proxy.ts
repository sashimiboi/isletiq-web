import { NextResponse, type NextRequest } from "next/server";

// Guards /admin/* routes with HTTP Basic Auth against the
// ADMIN_USERNAME / ADMIN_PASSWORD env vars. Browser shows its
// native credentials dialog on challenge. Exported as `proxy` per
// the Next.js 16 file convention.
export function proxy(request: NextRequest) {
  const user = process.env.ADMIN_USERNAME;
  const pass = process.env.ADMIN_PASSWORD;

  if (!user || !pass) {
    return new NextResponse("Admin auth not configured.", { status: 503 });
  }

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice("Basic ".length));
      const sep = decoded.indexOf(":");
      if (sep > -1) {
        const u = decoded.slice(0, sep);
        const p = decoded.slice(sep + 1);
        if (u === user && p === pass) {
          return NextResponse.next();
        }
      }
    } catch {
      // fall through to challenge
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="IsletIQ Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

import Image from "next/image";
import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1">
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
          <Link
            href="/"
            className="text-sm text-[#666b78] hover:text-[#0033a0] transition"
          >
            ← Back to home
          </Link>
        </div>
      </nav>
      <article className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">{children}</div>
      </article>
      <footer className="border-t border-black/[0.06] py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs text-[#94989e]">
          © {new Date().getFullYear()} IsletIQ ·{" "}
          <a
            href="mailto:hello@isletiq.com"
            className="hover:text-[#0033a0] transition"
          >
            hello@isletiq.com
          </a>
        </div>
      </footer>
    </main>
  );
}

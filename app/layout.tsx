import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IsletIQ | Your Type 1 Diabetes co-pilot",
  description:
    "Glucose, insulin, sleep, vitals, and AI guidance, all in one app. Built on Apple Health with Dexcom, LibreLink, and Apple Watch support.",
  metadataBase: new URL("https://isletiq.com"),
  openGraph: {
    title: "IsletIQ | Your Type 1 Diabetes co-pilot",
    description:
      "Glucose, insulin, sleep, vitals, and AI guidance, all in one app.",
    url: "https://isletiq.com",
    siteName: "IsletIQ",
    type: "website",
    images: [{ url: "/app-icon-1024.png", width: 1024, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IsletIQ | Your Type 1 Diabetes co-pilot",
    description:
      "Glucose, insulin, sleep, vitals, and AI guidance, all in one app.",
    images: ["/app-icon-1024.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Northstar CRM",
  description: "Client pipeline dashboard for the business app starter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-white">
        <header className="border-b border-white/10 bg-slate-950/90 px-6 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 text-sm font-semibold uppercase tracking-[0.35em] text-slate-300">
            <Link href="/" className="text-slate-100 hover:text-white">
              CRM
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-white">
                Dashboard
              </Link>
              <Link href="/portfolio" className="hover:text-white">
                Portfolio
              </Link>
              <Link href="/health" className="hover:text-white">
                Health
              </Link>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { phases } from "@/lib/demoData";

export const metadata: Metadata = {
  title: "FuneralFlow — Estate Settlement Pipeline",
  description: "End-to-end estate settlement prototype with a preloaded demo estate.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sunset-500 to-sunset-700 flex items-center justify-center text-white font-bold">
                  FF
                </div>
                <div>
                  <div className="font-semibold text-ink leading-tight">FuneralFlow</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">Estate Settlement Platform</div>
                </div>
              </Link>
              <nav className="hidden md:flex items-center gap-1 text-xs">
                {phases.map((p) => (
                  <Link
                    key={p.key}
                    href={p.href}
                    className="px-2 py-1 rounded hover:bg-slate-100 text-slate-600"
                    title={p.blurb}
                  >
                    {p.num}. {p.label}
                  </Link>
                ))}
              </nav>
              <Link href="/" className="btn-secondary text-xs hidden sm:inline-flex">
                Dashboard
              </Link>
            </div>
          </header>
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2">
              <span>FuneralFlow Prototype · Demo Estate: Margaret Chen · No real data is transmitted.</span>
              <span className="text-slate-400">Simulated environment</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

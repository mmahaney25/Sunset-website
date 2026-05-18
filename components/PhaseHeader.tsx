"use client";
import Link from "next/link";
import { phases, PhaseKey } from "@/lib/demoData";
import { useStore } from "@/lib/store";
import { useEffect } from "react";

export default function PhaseHeader({ phase }: { phase: PhaseKey }) {
  const meta = phases.find((p) => p.key === phase)!;
  const idx = phases.findIndex((p) => p.key === phase);
  const prev = phases[idx - 1];
  const next = phases[idx + 1];
  const markActive = useStore((s) => s.markActive);
  const markComplete = useStore((s) => s.markComplete);
  const status = useStore((s) => s.phaseStatus[phase]);

  useEffect(() => {
    markActive(phase);
  }, [phase, markActive]);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Link href="/" className="hover:text-sunset-600">Dashboard</Link>
        <span>›</span>
        <span>Phase {meta.num}</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sunset-600 text-white font-bold flex items-center justify-center">
              {meta.num}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-ink">{meta.label}</h1>
              <p className="text-sm text-slate-500">{meta.blurb}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === "complete" ? (
            <span className="pill bg-sage-100 text-sage-700">✓ Complete</span>
          ) : (
            <button
              className="btn-secondary text-xs"
              onClick={() => markComplete(phase)}
            >
              Mark complete
            </button>
          )}
          {prev && (
            <Link href={prev.href} className="btn-secondary text-xs">
              ← {prev.label}
            </Link>
          )}
          {next && (
            <Link href={next.href} className="btn-primary text-xs">
              {next.label} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

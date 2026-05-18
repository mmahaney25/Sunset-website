"use client";
import Link from "next/link";
import { phases, PhaseKey } from "@/lib/demoData";
import { useStore } from "@/lib/store";

export default function PipelineTracker({ compact = false }: { compact?: boolean }) {
  const phaseStatus = useStore((s) => s.phaseStatus);
  const currentPhase = useStore((s) => s.currentPhase);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="label">Pipeline</div>
          <div className="text-sm font-medium text-ink">9-Phase Estate Settlement</div>
        </div>
        <div className="text-xs text-slate-500">
          {Object.values(phaseStatus).filter((s) => s === "complete").length} / 9 complete
        </div>
      </div>
      <ol className="grid grid-cols-3 md:grid-cols-9 gap-2">
        {phases.map((p) => {
          const status = phaseStatus[p.key as PhaseKey];
          const isCurrent = currentPhase === p.key;
          const base = "block rounded-lg border p-2 text-center text-xs transition";
          const stateClass =
            status === "complete"
              ? "bg-sage-50 border-sage-500 text-sage-700"
              : isCurrent || status === "active"
              ? "bg-sunset-50 border-sunset-500 text-sunset-700 ring-2 ring-sunset-200"
              : "bg-white border-slate-200 text-slate-500";
          return (
            <li key={p.key}>
              <Link href={p.href} className={`${base} ${stateClass}`}>
                <div className="flex items-center justify-center mb-1">
                  <span className="w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center text-[10px] font-bold">
                    {status === "complete" ? "✓" : p.num}
                  </span>
                </div>
                <div className="font-medium truncate">{p.label}</div>
                {!compact && (
                  <div className="text-[10px] text-slate-500 mt-0.5 hidden md:block leading-tight">
                    {status === "complete" ? "Complete" : isCurrent ? "In progress" : "Pending"}
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

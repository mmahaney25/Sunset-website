"use client";
import Link from "next/link";
import PipelineTracker from "@/components/PipelineTracker";
import EstateSummaryCard from "@/components/EstateSummaryCard";
import { phases, demoEstate, formatCurrency } from "@/lib/demoData";
import { useStore } from "@/lib/store";

export default function Dashboard() {
  const phaseStatus = useStore((s) => s.phaseStatus);
  const closure = useStore((s) => s.closure);
  const consolidation = useStore((s) => s.consolidation);
  const monitoring = useStore((s) => s.monitoring);
  const distribution = useStore((s) => s.distribution);
  const resetAll = useStore((s) => s.resetAll);

  const pendingCounts: Record<string, number> = {
    intake: phaseStatus.intake === "complete" ? 0 : 3,
    discovery: phaseStatus.discovery === "complete" ? 0 : demoEstate.assets.length + demoEstate.liabilities.length,
    report: phaseStatus.report === "complete" ? 0 : 2,
    probate: phaseStatus.probate === "complete" ? 0 : 4,
    closure: Object.values(closure).filter((c) => c.status !== "closed").length,
    forms: phaseStatus.forms === "complete" ? 0 : 6,
    consolidation: phaseStatus.consolidation === "complete" ? 0 : consolidation.transactions.length === 0 ? 5 : 2,
    monitoring: monitoring.alerts.filter((a) => a.severity !== "ok").length || (phaseStatus.monitoring === "complete" ? 0 : 3),
    distribution: distribution.finalized ? 0 : distribution.approved ? 1 : 3,
  };

  return (
    <div className="space-y-6">
      <section className="card p-6 bg-gradient-to-br from-sunset-50 to-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="max-w-2xl">
            <div className="label">FuneralFlow Prototype</div>
            <h1 className="text-3xl font-bold text-ink mt-1">
              One platform. Nine phases. One family supported.
            </h1>
            <p className="text-slate-600 mt-2 text-sm">
              The demo estate for{" "}
              <strong>{demoEstate.deceased.fullName}</strong> is pre-loaded. Walk
              through intake → discovery → distribution end-to-end. Every screen
              uses realistic dummy data — no real PII is transmitted.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link href="/walkthrough" className="btn-primary">
              ▶ Run guided walkthrough
            </Link>
            <Link href="/intake" className="btn-secondary">
              Start at intake
            </Link>
            <button onClick={() => { if (confirm("Reset all demo progress?")) resetAll(); }} className="btn-ghost text-xs">
              Reset demo
            </button>
          </div>
        </div>
      </section>

      <EstateSummaryCard />

      <PipelineTracker />

      <section>
        <h2 className="text-lg font-semibold text-ink mb-3">Phase queue</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {phases.map((p) => {
            const status = phaseStatus[p.key];
            const count = pendingCounts[p.key] ?? 0;
            return (
              <Link key={p.key} href={p.href} className="card p-4 hover:shadow-md transition group">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Phase {p.num}</div>
                    <div className="font-semibold text-ink group-hover:text-sunset-700">{p.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{p.blurb}</div>
                  </div>
                  <div className="text-right">
                    {status === "complete" ? (
                      <span className="pill bg-sage-100 text-sage-700">✓ Done</span>
                    ) : status === "active" ? (
                      <span className="pill bg-sunset-100 text-sunset-700">Active</span>
                    ) : (
                      <span className="pill bg-slate-100 text-slate-500">Pending</span>
                    )}
                    {count > 0 && (
                      <div className="text-[11px] text-slate-500 mt-1">{count} pending</div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card p-4">
          <div className="label">Total assets</div>
          <div className="text-2xl font-semibold text-sage-700">
            {formatCurrency(demoEstate.assets.reduce((s, a) => s + a.value, 0))}
          </div>
          <div className="text-xs text-slate-500">{demoEstate.assets.length} accounts found</div>
        </div>
        <div className="card p-4">
          <div className="label">Total liabilities</div>
          <div className="text-2xl font-semibold text-sunset-700">
            {formatCurrency(demoEstate.liabilities.reduce((s, l) => s + l.balance, 0))}
          </div>
          <div className="text-xs text-slate-500">{demoEstate.liabilities.length} creditors</div>
        </div>
        <div className="card p-4">
          <div className="label">Estate value</div>
          <div className="text-2xl font-semibold text-ink">
            {formatCurrency(
              demoEstate.assets.reduce((s, a) => s + a.value, 0) -
                demoEstate.liabilities.reduce((s, l) => s + l.balance, 0)
            )}
          </div>
          <div className="text-xs text-slate-500">Before fees & probate costs</div>
        </div>
      </section>
    </div>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import PhaseHeader from "@/components/PhaseHeader";
import { demoEstate } from "@/lib/demoData";
import { useStore } from "@/lib/store";

export default function MonitoringPage() {
  const monitoring = useStore((s) => s.monitoring);
  const setMonitoring = useStore((s) => s.setMonitoring);
  const addAlert = useStore((s) => s.addAlert);
  const closure = useStore((s) => s.closure);
  const markComplete = useStore((s) => s.markComplete);
  const [scanning, setScanning] = useState<30 | 60 | 90 | null>(null);

  const runPull = (day: 30 | 60 | 90) => {
    setScanning(day);
    setTimeout(() => {
      if (day === 30) {
        setMonitoring({ pull30: true });
        addAlert("New collection: Mercy Hospital ER — $612 (post-mortem charge)", "warn");
        addAlert("Capital One Visa — confirmed closed by creditor", "ok");
        addAlert("Chase Checking ••1204 — closure confirmed, funds released", "ok");
      } else if (day === 60) {
        setMonitoring({ pull60: true });
        addAlert("Spectrum — final bill confirmed paid", "ok");
        addAlert("Nelnet — TPD discharge approved, balance $0", "ok");
        addAlert("Discover Card — closed and reported to bureaus", "ok");
      } else if (day === 90) {
        setMonitoring({ pull90: true });
        addAlert("All consumer trade lines removed from credit file", "ok");
        addAlert("Marcus personal loan — closure aging > 30d, retry scheduled", "warn");
        addAlert("MetLife — life insurance payout deposited", "ok");
      }
      setScanning(null);
    }, 1800);
  };

  const closedCount = Object.values(closure).filter((c) => c.status === "closed").length;
  const pullsRun = [monitoring.pull30, monitoring.pull60, monitoring.pull90].filter(Boolean).length;

  return (
    <>
      <PhaseHeader phase="monitoring" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-ink mb-3">Scheduled re-pulls</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {([30, 60, 90] as const).map((d) => {
                const done = d === 30 ? monitoring.pull30 : d === 60 ? monitoring.pull60 : monitoring.pull90;
                return (
                  <div key={d} className={`p-4 rounded-lg border ${done ? "bg-sage-50 border-sage-300" : "bg-slate-50 border-slate-200"}`}>
                    <div className="label">Day {d}</div>
                    <div className="text-sm font-semibold text-ink mt-1">Tri-bureau re-pull</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Detect new collections, status changes, and credit-report cleanup.
                    </div>
                    <div className="mt-3">
                      {done ? (
                        <span className="pill bg-sage-100 text-sage-700">✓ Completed</span>
                      ) : (
                        <button
                          onClick={() => runPull(d)}
                          disabled={scanning !== null}
                          className="btn-primary text-xs"
                        >
                          {scanning === d ? <><span className="pulse-dot mr-1">●</span> Pulling…</> : "Run pull"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-ink mb-3">Closure confirmation aging</h3>
            <div className="space-y-2">
              {demoEstate.liabilities.map((l) => {
                const c = closure[l.id];
                const daysSince = Math.round((Date.now() - new Date(c.lastUpdate).getTime()) / 86400000);
                const aging =
                  c.status === "closed"
                    ? { cls: "bg-sage-50 border-sage-200", label: "Confirmed" }
                    : daysSince >= 30
                    ? { cls: "bg-red-50 border-red-300", label: `${daysSince}d — stalled` }
                    : daysSince >= 14
                    ? { cls: "bg-amber-50 border-amber-300", label: `${daysSince}d — follow-up due` }
                    : { cls: "bg-slate-50 border-slate-200", label: `${daysSince}d` };
                return (
                  <div key={l.id} className={`p-3 rounded-lg border flex items-center justify-between ${aging.cls}`}>
                    <div>
                      <div className="text-sm font-medium text-ink">{l.label}</div>
                      <div className="text-xs text-slate-500">Status: {c.status.replace("_", " ")}</div>
                    </div>
                    <div className="text-xs font-medium">{aging.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="card p-4">
            <div className="label">Health</div>
            <ul className="mt-2 space-y-1 text-sm">
              <li className="flex justify-between"><span>Pulls run</span><span className="font-medium">{pullsRun}/3</span></li>
              <li className="flex justify-between"><span>Creditors closed</span><span className="font-medium">{closedCount}/{demoEstate.liabilities.length}</span></li>
              <li className="flex justify-between"><span>Active alerts</span><span className="font-medium">{monitoring.alerts.filter((a) => a.severity !== "ok").length}</span></li>
            </ul>
          </div>

          <div className="card p-4">
            <div className="label mb-2">Alert feed</div>
            {monitoring.alerts.length === 0 ? (
              <div className="text-xs text-slate-500">No alerts. Run a re-pull to populate.</div>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-auto text-xs">
                {monitoring.alerts.map((a) => {
                  const cls =
                    a.severity === "warn"
                      ? "bg-amber-50 border-amber-200 text-amber-800"
                      : a.severity === "ok"
                      ? "bg-sage-50 border-sage-200 text-sage-700"
                      : "bg-slate-50 border-slate-200 text-slate-700";
                  return (
                    <li key={a.id} className={`p-2 border rounded ${cls}`}>
                      <div className="text-[10px] opacity-60">{new Date(a.ts).toLocaleString()}</div>
                      <div>{a.msg}</div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="card p-4">
            <button onClick={() => markComplete("monitoring")} className="btn-primary w-full">Mark monitoring done</button>
            <Link href="/distribution" className="btn-secondary w-full mt-2 text-center">Continue to Distribution →</Link>
          </div>
        </aside>
      </div>
    </>
  );
}

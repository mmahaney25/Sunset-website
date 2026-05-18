"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PhaseHeader from "@/components/PhaseHeader";
import { demoEstate, formatCurrency, assetTypeLabel, liabilityTypeLabel } from "@/lib/demoData";
import { useStore } from "@/lib/store";

const BUREAUS = ["equifax", "experian", "transunion"] as const;

export default function DiscoveryPage() {
  const discovery = useStore((s) => s.discovery);
  const setDiscovery = useStore((s) => s.setDiscovery);
  const markComplete = useStore((s) => s.markComplete);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(discovery.bureauProgress);

  const start = () => {
    setRunning(true);
    setProgress({ equifax: 0, experian: 0, transunion: 0 });
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const p = Math.min(elapsed / 3, 1);
      setProgress({
        equifax: Math.min(p + 0.05, 1),
        experian: Math.min(p, 1),
        transunion: Math.min(p - 0.05, 1),
      });
      if (p >= 1) {
        clearInterval(interval);
        setProgress({ equifax: 1, experian: 1, transunion: 1 });
        setDiscovery({ completed: true, bureauProgress: { equifax: 1, experian: 1, transunion: 1 } });
        setRunning(false);
      }
    }, 80);
  };

  useEffect(() => {
    if (discovery.completed) {
      setProgress({ equifax: 1, experian: 1, transunion: 1 });
    }
  }, [discovery.completed]);

  const assetTotals: Record<string, { count: number; value: number }> = {};
  demoEstate.assets.forEach((a) => {
    const key = assetTypeLabel(a.type);
    assetTotals[key] = assetTotals[key] || { count: 0, value: 0 };
    assetTotals[key].count += 1;
    assetTotals[key].value += a.value;
  });
  const liabTotals: Record<string, { count: number; value: number }> = {};
  demoEstate.liabilities.forEach((l) => {
    const key = liabilityTypeLabel(l.type);
    liabTotals[key] = liabTotals[key] || { count: 0, value: 0 };
    liabTotals[key].count += 1;
    liabTotals[key].value += l.balance;
  });

  return (
    <>
      <PhaseHeader phase="discovery" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-ink">Tri-bureau credit & asset scan</h3>
              {!discovery.completed && !running && (
                <button onClick={start} className="btn-primary text-xs">
                  ▶ Run scan
                </button>
              )}
              {running && <span className="pill bg-sunset-100 text-sunset-700"><span className="pulse-dot mr-1">●</span> Scanning…</span>}
              {discovery.completed && <span className="pill bg-sage-100 text-sage-700">✓ Complete</span>}
            </div>
            <div className="space-y-3">
              {BUREAUS.map((b) => {
                const pct = Math.round((progress[b] || 0) * 100);
                return (
                  <div key={b}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-ink capitalize">{b}</span>
                      <span className="text-slate-500">{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sunset-500 to-sunset-700 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {discovery.completed && (
              <div className="mt-4 p-3 bg-sage-50 border border-sage-200 rounded-lg text-xs text-sage-700">
                ✓ Scan complete in 2.7s. Found {demoEstate.assets.length} assets and {demoEstate.liabilities.length} liabilities across {Object.keys(assetTotals).length + Object.keys(liabTotals).length} unique account types.
                Cross-bureau deduplication removed 4 duplicate trade lines.
              </div>
            )}
          </div>

          {discovery.completed && (
            <>
              <div className="card p-5">
                <h3 className="font-semibold text-ink mb-3">Assets — unified view</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {demoEstate.assets.map((a) => (
                    <div key={a.id} className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase text-slate-400">{assetTypeLabel(a.type)}</div>
                        <div className="text-sm font-medium text-ink">{a.label}</div>
                        {a.accountNumber && (
                          <div className="text-xs text-slate-500">{a.accountNumber}</div>
                        )}
                      </div>
                      <div className="text-sage-700 font-semibold">{formatCurrency(a.value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-semibold text-ink mb-3">Liabilities — unified view</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {demoEstate.liabilities.map((l) => (
                    <div key={l.id} className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase text-slate-400">{liabilityTypeLabel(l.type)}</div>
                        <div className="text-sm font-medium text-ink">{l.label}</div>
                        {l.accountNumber && (
                          <div className="text-xs text-slate-500">{l.accountNumber}</div>
                        )}
                        <div className="flex gap-1 mt-1">
                          {l.flags?.includes("joint_with_spouse") && (
                            <span className="pill bg-amber-100 text-amber-700">Joint w/ spouse</span>
                          )}
                          {l.flags?.includes("federal_discharge_eligible") && (
                            <span className="pill bg-sky-100 text-sky-700">Federal — dischargeable</span>
                          )}
                        </div>
                      </div>
                      <div className="text-sunset-700 font-semibold">{formatCurrency(l.balance)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <aside className="space-y-3">
          <div className="card p-4">
            <div className="label">By type — assets</div>
            <ul className="mt-2 text-sm divide-y divide-slate-100">
              {Object.entries(assetTotals).map(([k, v]) => (
                <li key={k} className="flex justify-between py-1.5">
                  <span className="text-slate-600">
                    {k} <span className="text-xs text-slate-400">×{v.count}</span>
                  </span>
                  <span className="font-medium text-sage-700">{formatCurrency(v.value)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span className="text-sage-700">{formatCurrency(demoEstate.assets.reduce((s,a)=>s+a.value,0))}</span>
            </div>
          </div>

          <div className="card p-4">
            <div className="label">By type — liabilities</div>
            <ul className="mt-2 text-sm divide-y divide-slate-100">
              {Object.entries(liabTotals).map(([k, v]) => (
                <li key={k} className="flex justify-between py-1.5">
                  <span className="text-slate-600">
                    {k} <span className="text-xs text-slate-400">×{v.count}</span>
                  </span>
                  <span className="font-medium text-sunset-700">{formatCurrency(v.value)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span className="text-sunset-700">{formatCurrency(demoEstate.liabilities.reduce((s,l)=>s+l.balance,0))}</span>
            </div>
          </div>

          {discovery.completed && (
            <div className="card p-4">
              <button onClick={() => markComplete("discovery")} className="btn-primary w-full">Complete discovery</button>
              <Link href="/report" className="btn-secondary w-full mt-2 text-center">Continue to Report →</Link>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

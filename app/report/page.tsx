"use client";
import Link from "next/link";
import PhaseHeader from "@/components/PhaseHeader";
import { demoEstate, formatCurrency, assetTypeLabel, liabilityTypeLabel } from "@/lib/demoData";
import { useStore } from "@/lib/store";

export default function ReportPage() {
  const markComplete = useStore((s) => s.markComplete);
  const assetTotal = demoEstate.assets.reduce((s, a) => s + a.value, 0);
  const liabTotal = demoEstate.liabilities.reduce((s, l) => s + l.balance, 0);

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <>
      <PhaseHeader phase="report" />
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-ink">Estate report</h2>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="btn-secondary text-xs">⤓ Export PDF</button>
          <button onClick={() => markComplete("report")} className="btn-primary text-xs">Mark report reviewed</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Stat label="Gross assets" value={formatCurrency(assetTotal)} tone="sage" />
        <Stat label="Gross liabilities" value={formatCurrency(liabTotal)} tone="sunset" />
        <Stat label="Net estate" value={formatCurrency(assetTotal - liabTotal)} tone="ink" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-ink mb-3">Asset breakdown</h3>
          <div className="space-y-2">
            {demoEstate.assets.map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-2">
                <div>
                  <div className="text-sm font-medium text-ink">{a.label}</div>
                  <div className="text-xs text-slate-500">{assetTypeLabel(a.type)} · {a.institution}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sage-700">{formatCurrency(a.value)}</div>
                  <div className="text-[10px] text-slate-400">{((a.value / assetTotal) * 100).toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-ink mb-3">Liability breakdown</h3>
          <div className="space-y-2">
            {demoEstate.liabilities.map((l) => (
              <div key={l.id} className="border-b border-slate-100 last:border-0 pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-ink">{l.label}</div>
                    <div className="text-xs text-slate-500">{liabilityTypeLabel(l.type)} · {l.institution}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sunset-700">{formatCurrency(l.balance)}</div>
                    <div className="text-[10px] text-slate-400">{((l.balance / liabTotal) * 100).toFixed(1)}%</div>
                  </div>
                </div>
                {l.flags?.includes("joint_with_spouse") && (
                  <div className="mt-1 text-xs bg-amber-50 border border-amber-200 rounded p-2 text-amber-800">
                    ⚠ <strong>Joint debt with spouse {demoEstate.survivors[0].name}.</strong> This balance
                    survives the decedent. Surviving spouse remains liable and the mortgage
                    will transfer; do <strong>not</strong> include this on the creditor
                    closure list.
                  </div>
                )}
                {l.flags?.includes("federal_discharge_eligible") && (
                  <div className="mt-1 text-xs bg-sky-50 border border-sky-200 rounded p-2 text-sky-800">
                    ⚑ <strong>Federal student loan — eligible for total & permanent discharge.</strong> Submit
                    death certificate to Nelnet via the FSA discharge channel — full
                    balance forgiven, no estate liability.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5 mt-4">
        <h3 className="font-semibold text-ink mb-3">Survivors & beneficiaries</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {demoEstate.survivors.map((s) => (
            <div key={s.id} className="p-3 border border-slate-200 rounded-lg">
              <div className="text-sm font-medium text-ink">{s.name}</div>
              <div className="text-xs text-slate-500">{s.relation}{s.isExecutor && " · Executor"}</div>
              <div className="text-xs text-slate-500 mt-1">
                Will share: {demoEstate.beneficiaries.find((b) => b.name === s.name)?.sharePct}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Link href="/probate" className="btn-primary">Continue to Probate →</Link>
      </div>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "sage" | "sunset" | "ink" }) {
  const toneClass = tone === "sage" ? "text-sage-700" : tone === "sunset" ? "text-sunset-700" : "text-ink";
  return (
    <div className="card p-4">
      <div className="label">{label}</div>
      <div className={`text-2xl font-semibold ${toneClass}`}>{value}</div>
    </div>
  );
}

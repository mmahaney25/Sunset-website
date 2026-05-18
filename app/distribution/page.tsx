"use client";
import { useState } from "react";
import Link from "next/link";
import PhaseHeader from "@/components/PhaseHeader";
import { demoEstate, formatCurrency } from "@/lib/demoData";
import { useStore } from "@/lib/store";

export default function DistributionPage() {
  const distribution = useStore((s) => s.distribution);
  const setShares = useStore((s) => s.setShares);
  const approve = useStore((s) => s.approveDistribution);
  const finalize = useStore((s) => s.finalizeDistribution);
  const markComplete = useStore((s) => s.markComplete);
  const consolidation = useStore((s) => s.consolidation);
  const [transferring, setTransferring] = useState(false);

  const assetTotal = demoEstate.assets.reduce((s, a) => s + a.value, 0);
  const liabTotal = demoEstate.liabilities.filter((l) => !l.flags?.includes("joint_with_spouse") && !l.flags?.includes("federal_discharge_eligible")).reduce((s, l) => s + l.balance, 0);
  const probateFees = 485;
  const funeralCosts = 12400;
  const platformFee = 1495;
  const netEstate = assetTotal - liabTotal - probateFees - funeralCosts - platformFee;

  const totalPct = distribution.shares.reduce((s, x) => s + x.sharePct, 0);
  const valid = totalPct === 100;

  const setSharePct = (id: string, pct: number) => {
    setShares(distribution.shares.map((s) => (s.id === id ? { ...s, sharePct: pct } : s)));
  };

  const runTransfers = () => {
    setTransferring(true);
    setTimeout(() => {
      finalize();
      setTransferring(false);
    }, 1500);
  };

  return (
    <>
      <PhaseHeader phase="distribution" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-ink mb-3">Net estate calculation</h3>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                <Row label="Gross assets discovered" value={assetTotal} />
                <Row label="Less: debts settled (non-survivor, non-discharged)" value={-liabTotal} />
                <Row label="Less: probate filing fees (Dane Co.)" value={-probateFees} />
                <Row label="Less: funeral & burial expenses" value={-funeralCosts} />
                <Row label="Less: FuneralFlow platform fee (1 charge total)" value={-platformFee} />
                <tr className="font-semibold">
                  <td className="py-2 text-ink">Net distributable estate</td>
                  <td className="py-2 text-right text-ink">{formatCurrency(netEstate)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-ink mb-3">Beneficiary shares (per will)</h3>
            <div className="space-y-3">
              {demoEstate.beneficiaries.map((b) => {
                const share = distribution.shares.find((s) => s.id === b.id)!;
                const amt = (share.sharePct / 100) * netEstate;
                return (
                  <div key={b.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center p-3 border border-slate-200 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-ink">{b.name}</div>
                      <div className="text-xs text-slate-500">{b.relation}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={share.sharePct}
                        min={0}
                        max={100}
                        disabled={distribution.finalized}
                        onChange={(e) => setSharePct(b.id, Number(e.target.value))}
                        className="field w-20"
                      />
                      <span className="text-sm text-slate-500">%</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sage-700">{formatCurrency(amt)}</div>
                      <div className="text-[10px] text-slate-500">Calculated share</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={`mt-3 text-xs ${valid ? "text-sage-700" : "text-red-600"}`}>
              Shares total: {totalPct}% {valid ? "✓" : "(must equal 100%)"}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-ink mb-3">Approval & transfer</h3>
            {!distribution.approved ? (
              <button onClick={approve} disabled={!valid} className="btn-primary">
                Submit for executor approval
              </button>
            ) : !distribution.finalized ? (
              <div>
                <div className="p-3 bg-sage-50 border border-sage-200 rounded mb-3 text-sm text-sage-700">
                  ✓ Approved by executor {demoEstate.will.executor} on {new Date().toLocaleDateString()}.
                </div>
                <button onClick={runTransfers} disabled={transferring} className="btn-primary">
                  {transferring ? <><span className="pulse-dot mr-1">●</span> Initiating ACH transfers…</> : "Execute distribution transfers"}
                </button>
              </div>
            ) : (
              <div className="p-4 bg-sage-50 border border-sage-300 rounded-lg">
                <div className="font-semibold text-sage-700">✓ Distribution complete</div>
                <div className="text-sm text-sage-700 mt-1">
                  All beneficiary transfers initiated. Final accounting filed with Dane County
                  Circuit Court. Estate closed.
                </div>
              </div>
            )}
          </div>

          {distribution.finalized && (
            <div className="card p-5">
              <h3 className="font-semibold text-ink mb-3">Final accounting</h3>
              <ul className="space-y-1.5 text-sm">
                <li className="flex justify-between border-b border-slate-100 pb-1.5"><span>Assets collected</span><span className="font-medium">{formatCurrency(assetTotal)}</span></li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5"><span>Debts settled</span><span className="font-medium">{formatCurrency(liabTotal)}</span></li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5"><span>Expenses (probate/funeral/platform)</span><span className="font-medium">{formatCurrency(probateFees + funeralCosts + platformFee)}</span></li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5"><span>Distributed to beneficiaries</span><span className="font-medium">{formatCurrency(netEstate)}</span></li>
                <li className="flex justify-between font-semibold pt-1"><span>Estate balance</span><span>{formatCurrency(0)}</span></li>
              </ul>
              <div className="mt-4 text-xs text-slate-500">
                Filed: Final Account &amp; Petition for Estate Closure · Dane County Circuit Court · {new Date().toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-3">
          <div className="card p-4">
            <div className="label">Pipeline complete</div>
            <p className="text-xs text-slate-600 mt-1">
              All nine phases lead here. Once distribution is finalized, the estate
              is closed and the family is supported end-to-end.
            </p>
          </div>
          {distribution.finalized && (
            <div className="card p-4">
              <button onClick={() => markComplete("distribution")} className="btn-primary w-full">Close estate</button>
              <Link href="/" className="btn-secondary w-full mt-2 text-center">Return to dashboard</Link>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <tr>
      <td className="py-1.5 text-slate-600">{label}</td>
      <td className={`py-1.5 text-right ${value < 0 ? "text-sunset-700" : "text-sage-700"}`}>
        {value < 0 ? "−" : ""}{formatCurrency(Math.abs(value))}
      </td>
    </tr>
  );
}

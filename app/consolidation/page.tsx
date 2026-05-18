"use client";
import { useState } from "react";
import Link from "next/link";
import PhaseHeader from "@/components/PhaseHeader";
import { demoEstate, formatCurrency } from "@/lib/demoData";
import { useStore } from "@/lib/store";

export default function ConsolidationPage() {
  const consolidation = useStore((s) => s.consolidation);
  const setConsolidation = useStore((s) => s.setConsolidation);
  const addTransaction = useStore((s) => s.addTransaction);
  const markComplete = useStore((s) => s.markComplete);
  const closure = useStore((s) => s.closure);
  const [issuing, setIssuing] = useState(false);

  const issueEin = () => {
    setIssuing(true);
    setTimeout(() => {
      setConsolidation({ einIssued: true });
      setIssuing(false);
    }, 1500);
  };

  const openAccount = () => {
    setConsolidation({ accountOpened: true });
    addTransaction({ description: "Estate account opened — Chase Estate Services", amount: 0 });
  };

  const collectFunds = () => {
    const closedCreditors = Object.values(closure).filter((c) => c.status === "closed");
    if (consolidation.transactions.find((t) => t.description.includes("Chase Checking closure"))) return;

    addTransaction({ description: "Inbound — Chase Checking ••1204 closure proceeds", amount: 14200 });
    addTransaction({ description: "Inbound — Chase Savings ••8821 closure proceeds", amount: 31500 });
    addTransaction({ description: "Inbound — Schwab Brokerage ••0156 transfer", amount: 67800 });
    addTransaction({ description: "Inbound — U.S. Treasury I-Bonds redemption", amount: 25000 });
    addTransaction({ description: "Inbound — Coinbase wallet liquidation", amount: 4200 });
    addTransaction({ description: "Inbound — HSA ••residual distribution", amount: 3100 });
    addTransaction({ description: "Inbound — MetLife life insurance proceeds", amount: 250000 });
    addTransaction({ description: "Outbound — Capital One Visa settlement", amount: -4300 });
    addTransaction({ description: "Outbound — Discover Card settlement", amount: -1800 });
    addTransaction({ description: "Outbound — UW Health medical collection", amount: -2300 });
    addTransaction({ description: "Outbound — AT&T final bill", amount: -287 });
    addTransaction({ description: "Outbound — Spectrum final bill", amount: -142 });
    addTransaction({ description: "Outbound — Marcus personal loan payoff", amount: -8500 });
    addTransaction({ description: "Outbound — Probate filing fees (Dane Co.)", amount: -485 });
    addTransaction({ description: "Outbound — Funeral & burial expenses", amount: -12400 });
  };

  const balance = consolidation.transactions.reduce((s, t) => s + t.amount, 0);
  const totalIn = consolidation.transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = consolidation.transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <>
      <PhaseHeader phase="consolidation" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-ink mb-3">Step 1 · EIN application</h3>
            {consolidation.einIssued ? (
              <div className="p-3 bg-sage-50 border border-sage-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-sage-700">✓ EIN issued by IRS</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">98-4729{Math.floor(Math.random()*900+100)}</div>
                </div>
                <span className="pill bg-sage-100 text-sage-700">Active</span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-600 mb-3">
                  Form SS-4 prefilled: Estate of {demoEstate.deceased.fullName} · Executor {demoEstate.will.executor}.
                  Submit electronically to the IRS to receive an EIN for the estate.
                </p>
                <button onClick={issueEin} disabled={issuing} className="btn-primary text-xs">
                  {issuing ? <><span className="pulse-dot mr-1">●</span> Submitting SS-4…</> : "Submit Form SS-4"}
                </button>
              </div>
            )}
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-ink mb-3">Step 2 · Estate bank account</h3>
            {consolidation.accountOpened ? (
              <div className="p-3 bg-sage-50 border border-sage-200 rounded-lg">
                <div className="text-sm font-medium text-sage-700">✓ Estate account opened — Chase Estate Services</div>
                <div className="text-xs text-slate-500 mt-1">Account ••8842 · Authorized signer: David Chen</div>
              </div>
            ) : (
              <button
                onClick={openAccount}
                disabled={!consolidation.einIssued}
                className="btn-primary text-xs"
              >
                Open estate checking
              </button>
            )}
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-ink">Step 3 · Fund collection & expense tracking</h3>
              <button
                onClick={collectFunds}
                disabled={!consolidation.accountOpened}
                className="btn-secondary text-xs"
              >
                Simulate inbound/outbound
              </button>
            </div>
            {consolidation.transactions.length === 0 ? (
              <div className="text-sm text-slate-500 text-center py-6">No transactions yet. Open the estate account and click simulate.</div>
            ) : (
              <div className="overflow-hidden border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                    <tr>
                      <th className="text-left px-3 py-2">Date</th>
                      <th className="text-left px-3 py-2">Description</th>
                      <th className="text-right px-3 py-2">Amount</th>
                      <th className="text-right px-3 py-2">Running balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      let running = 0;
                      return consolidation.transactions.map((t) => {
                        running += t.amount;
                        return (
                          <tr key={t.id}>
                            <td className="px-3 py-2 text-xs text-slate-500">{t.date}</td>
                            <td className="px-3 py-2">{t.description}</td>
                            <td className={`px-3 py-2 text-right font-medium ${t.amount > 0 ? "text-sage-700" : t.amount < 0 ? "text-sunset-700" : "text-slate-500"}`}>
                              {t.amount === 0 ? "—" : (t.amount > 0 ? "+" : "") + formatCurrency(t.amount)}
                            </td>
                            <td className="px-3 py-2 text-right text-slate-700">{formatCurrency(running)}</td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-3">
          <div className="card p-4">
            <div className="label">Estate account</div>
            <div className="text-2xl font-semibold text-ink mt-1">{formatCurrency(balance)}</div>
            <div className="text-xs text-slate-500">Running balance</div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-sage-50 border border-sage-100 rounded">
                <div className="text-sage-700 font-medium">In</div>
                <div>{formatCurrency(totalIn)}</div>
              </div>
              <div className="p-2 bg-sunset-50 border border-sunset-100 rounded">
                <div className="text-sunset-700 font-medium">Out</div>
                <div>{formatCurrency(totalOut)}</div>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <button onClick={() => markComplete("consolidation")} className="btn-primary w-full">Mark consolidation done</button>
            <Link href="/monitoring" className="btn-secondary w-full mt-2 text-center">Continue to Monitoring →</Link>
          </div>
        </aside>
      </div>
    </>
  );
}

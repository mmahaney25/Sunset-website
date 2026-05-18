"use client";
import { useState } from "react";
import Link from "next/link";
import PhaseHeader from "@/components/PhaseHeader";
import { demoEstate, liabilityTypeLabel } from "@/lib/demoData";
import { useStore } from "@/lib/store";

const TIERS = [
  { key: "email", label: "Email", day: 0, desc: "Initial digital notice with attached death certificate" },
  { key: "mail", label: "Certified mail", day: 7, desc: "Registered letter to legal department" },
  { key: "ai_phone", label: "AI phone call", day: 14, desc: "Automated voice agent contacts estate department" },
  { key: "user_fallback", label: "User fallback", day: 21, desc: "Escalation to executor with prepared script" },
];

export default function ClosurePage() {
  const closure = useStore((s) => s.closure);
  const updateCreditor = useStore((s) => s.updateCreditor);
  const appendCreditorLog = useStore((s) => s.appendCreditorLog);
  const markComplete = useStore((s) => s.markComplete);
  const [selected, setSelected] = useState<string | null>(demoEstate.liabilities[0].id);

  const advance = (id: string) => {
    const c = closure[id];
    const next = Math.min(c.tier + 1, 4) as 0 | 1 | 2 | 3;
    const lib = demoEstate.liabilities.find((l) => l.id === id)!;
    const statusMap = ["email_sent", "mail_sent", "ai_call", "user_fallback"] as const;
    const status = next >= 4 ? "closed" : statusMap[c.tier];
    updateCreditor(id, { tier: next, status });
    const tierMeta = TIERS[c.tier];
    if (tierMeta) {
      appendCreditorLog(id, `Tier ${c.tier + 1} — ${tierMeta.label} sent. Includes: deceased name (${demoEstate.deceased.fullName}), account ${lib.accountNumber || "—"}, DOD ${demoEstate.deceased.dateOfDeath}, death certificate copy, legal authority (executor ${demoEstate.will.executor}).`);
    } else {
      appendCreditorLog(id, "Confirmed closed by creditor.");
    }
  };

  const markClosed = (id: string) => {
    updateCreditor(id, { status: "closed", tier: 4 as any });
    appendCreditorLog(id, "Manually marked closed.");
  };

  const dispatchAll = () => {
    demoEstate.liabilities.forEach((l) => {
      if (closure[l.id].tier === 0) advance(l.id);
    });
  };

  const closedCount = Object.values(closure).filter((c) => c.status === "closed").length;
  const sel = selected ? demoEstate.liabilities.find((l) => l.id === selected)! : null;
  const selState = selected ? closure[selected] : null;

  return (
    <>
      <PhaseHeader phase="closure" />

      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="label">Closure waterfall</div>
            <div className="text-sm text-ink">
              4-tier escalation per creditor · email (day 0) → mail (day 7) → AI phone (day 14) → user fallback (day 21)
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={dispatchAll} className="btn-primary text-xs">▶ Dispatch tier 1 to all</button>
            <span className="pill bg-sage-100 text-sage-700">
              {closedCount}/{demoEstate.liabilities.length} closed
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="text-left px-3 py-2">Creditor</th>
                <th className="text-left px-3 py-2">Tier</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Last update</th>
                <th className="text-left px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {demoEstate.liabilities.map((l) => {
                const c = closure[l.id];
                const daysSince = Math.round((Date.now() - new Date(c.lastUpdate).getTime()) / 86400000);
                const flag14 = daysSince >= 14 && c.status !== "closed";
                const flag30 = daysSince >= 30 && c.status !== "closed";
                return (
                  <tr
                    key={l.id}
                    className={`cursor-pointer ${selected === l.id ? "bg-sunset-50" : "hover:bg-slate-50"}`}
                    onClick={() => setSelected(l.id)}
                  >
                    <td className="px-3 py-2">
                      <div className="font-medium text-ink">{l.label}</div>
                      <div className="text-xs text-slate-500">{liabilityTypeLabel(l.type)}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        {[0, 1, 2, 3].map((t) => (
                          <div
                            key={t}
                            className={`w-2.5 h-2.5 rounded-full ${
                              c.tier > t ? "bg-sunset-600" : c.tier === t && c.status !== "closed" ? "bg-sunset-300" : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <StatusPill status={c.status} />
                      {flag30 && <span className="pill bg-red-100 text-red-700 ml-1">30d</span>}
                      {flag14 && !flag30 && <span className="pill bg-amber-100 text-amber-700 ml-1">14d</span>}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-500">
                      {new Date(c.lastUpdate).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {c.status === "closed" ? (
                        <span className="text-xs text-sage-700">✓</span>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); advance(l.id); }} className="btn-secondary text-xs">Advance</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <aside className="space-y-3">
          {sel && selState ? (
            <>
              <div className="card p-4">
                <div className="label">Selected creditor</div>
                <div className="font-semibold text-ink mt-1">{sel.label}</div>
                <div className="text-xs text-slate-500">{sel.accountNumber}</div>
                <div className="mt-3">
                  <div className="label">Tier progress</div>
                  <ol className="mt-2 space-y-2">
                    {TIERS.map((t, i) => {
                      const done = selState.tier > i;
                      const active = selState.tier === i && selState.status !== "closed";
                      return (
                        <li key={t.key} className="flex items-start gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                            done ? "bg-sage-500 text-white" : active ? "bg-sunset-500 text-white" : "bg-slate-200 text-slate-500"
                          }`}>
                            {done ? "✓" : i + 1}
                          </div>
                          <div className="text-xs">
                            <div className="font-medium text-ink">{t.label} · day {t.day}</div>
                            <div className="text-slate-500">{t.desc}</div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
                <div className="mt-4 flex gap-2">
                  {selState.status !== "closed" && (
                    <>
                      <button onClick={() => advance(sel.id)} className="btn-primary text-xs flex-1">Advance tier</button>
                      <button onClick={() => markClosed(sel.id)} className="btn-secondary text-xs">Mark closed</button>
                    </>
                  )}
                </div>
              </div>

              <div className="card p-4">
                <div className="label">Notification log</div>
                {selState.log.length === 0 ? (
                  <div className="text-xs text-slate-500 mt-2">No notifications sent yet.</div>
                ) : (
                  <ul className="mt-2 space-y-2 text-xs">
                    {selState.log.slice().reverse().map((l, i) => (
                      <li key={i} className="p-2 bg-slate-50 border border-slate-200 rounded">
                        <div className="text-slate-500">{new Date(l.ts).toLocaleString()}</div>
                        <div className="text-ink mt-1">{l.msg}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className="card p-4 text-sm text-slate-500">Select a creditor to see details.</div>
          )}
          <div className="card p-4">
            <button onClick={() => markComplete("closure")} className="btn-primary w-full">Mark closure phase done</button>
            <Link href="/forms" className="btn-secondary w-full mt-2 text-center">Continue to Forms →</Link>
          </div>
        </aside>
      </div>
    </>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    queued: { label: "Queued", cls: "bg-slate-100 text-slate-600" },
    email_sent: { label: "Email sent", cls: "bg-sky-100 text-sky-700" },
    mail_sent: { label: "Mail sent", cls: "bg-indigo-100 text-indigo-700" },
    ai_call: { label: "AI call done", cls: "bg-purple-100 text-purple-700" },
    user_fallback: { label: "User fallback", cls: "bg-amber-100 text-amber-700" },
    closed: { label: "Closed", cls: "bg-sage-100 text-sage-700" },
  };
  const v = map[status] || map.queued;
  return <span className={`pill ${v.cls}`}>{v.label}</span>;
}

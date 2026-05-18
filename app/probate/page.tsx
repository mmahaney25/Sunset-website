"use client";
import Link from "next/link";
import PhaseHeader from "@/components/PhaseHeader";
import { demoEstate, formatCurrency, assetTypeLabel } from "@/lib/demoData";
import { useStore } from "@/lib/store";

const NON_PROBATE_TYPES = ["life_insurance", "401k", "ira", "hsa"];

export default function ProbatePage() {
  const markComplete = useStore((s) => s.markComplete);

  const probate = demoEstate.assets.filter((a) => !NON_PROBATE_TYPES.includes(a.type));
  const nonProbate = demoEstate.assets.filter((a) => NON_PROBATE_TYPES.includes(a.type));
  const probateTotal = probate.reduce((s, a) => s + a.value, 0);
  const nonProbateTotal = nonProbate.reduce((s, a) => s + a.value, 0);

  // WI small estate affidavit threshold = $50,000 (probate assets only)
  const WI_THRESHOLD = 50000;
  const smallEstateEligible = probateTotal <= WI_THRESHOLD;

  return (
    <>
      <PhaseHeader phase="probate" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-ink mb-3">Jurisdiction</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="label">State</div>
                <div className="font-medium text-ink">{demoEstate.deceased.state}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="label">County</div>
                <div className="font-medium text-ink">{demoEstate.deceased.county}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="label">Court</div>
                <div className="font-medium text-ink">Dane County Circuit Court — Probate</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Auto-detected from decedent's last known address.
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-ink mb-3">Filing path</h3>
            {smallEstateEligible ? (
              <div className="p-4 bg-sage-50 border border-sage-300 rounded-lg">
                <div className="font-semibold text-sage-700">✓ Small estate affidavit eligible</div>
                <div className="text-sm text-sage-700 mt-1">
                  Probate-eligible assets total <strong>{formatCurrency(probateTotal)}</strong>,
                  which is at or below Wisconsin's $50,000 small estate threshold (Wis. Stat. § 867.03).
                  The estate can avoid formal probate using a Transfer by Affidavit.
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg">
                <div className="font-semibold text-amber-700">⚠ Formal probate required</div>
                <div className="text-sm text-amber-700 mt-1">
                  Probate-eligible assets total <strong>{formatCurrency(probateTotal)}</strong>,
                  exceeding Wisconsin's $50,000 small estate threshold.
                  File for informal administration (PR-1801) with Dane County Circuit Court.
                </div>
              </div>
            )}
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-ink mb-3">Probate vs. non-probate assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="label">Probate ({probate.length})</div>
                  <div className="font-semibold text-ink">{formatCurrency(probateTotal)}</div>
                </div>
                <ul className="space-y-1.5">
                  {probate.map((a) => (
                    <li key={a.id} className="text-xs flex justify-between p-2 bg-amber-50 border border-amber-100 rounded">
                      <span className="text-ink">{a.label}</span>
                      <span className="text-amber-700">{formatCurrency(a.value)}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-slate-500 mt-2">
                  Pass through the estate. Subject to creditor claims & probate timeline.
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="label">Non-probate ({nonProbate.length})</div>
                  <div className="font-semibold text-ink">{formatCurrency(nonProbateTotal)}</div>
                </div>
                <ul className="space-y-1.5">
                  {nonProbate.map((a) => (
                    <li key={a.id} className="text-xs flex justify-between p-2 bg-sage-50 border border-sage-100 rounded">
                      <span className="text-ink">{a.label}</span>
                      <span className="text-sage-700">{formatCurrency(a.value)}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-slate-500 mt-2">
                  Pass by beneficiary designation. Not subject to probate or general creditor claims.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-ink mb-3">Generated county forms</h3>
            <div className="space-y-2">
              <FormRow name="HT-110 — Transfer by Affidavit ($50K & under)" county="Dane County, WI" recommended={smallEstateEligible} />
              <FormRow name="PR-1801 — Application for Informal Administration" county="Dane County, WI" recommended={!smallEstateEligible} />
              <FormRow name="HT-130 — Estate Account & Inventory" county="Dane County, WI" recommended />
              <FormRow name="DOA-6432 — WI Estate Recovery Notice (HMS)" county="Wisconsin DHS" recommended />
            </div>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="card p-4">
            <div className="label">Summary</div>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex justify-between"><span>Probate assets</span><span className="font-medium">{formatCurrency(probateTotal)}</span></li>
              <li className="flex justify-between"><span>Non-probate</span><span className="font-medium text-sage-700">{formatCurrency(nonProbateTotal)}</span></li>
              <li className="flex justify-between"><span>WI threshold</span><span className="font-medium">{formatCurrency(WI_THRESHOLD)}</span></li>
              <li className="flex justify-between border-t pt-2"><span>Path</span><span className="font-medium">{smallEstateEligible ? "Small estate" : "Formal"}</span></li>
            </ul>
          </div>
          <div className="card p-4">
            <button onClick={() => markComplete("probate")} className="btn-primary w-full">Confirm probate path</button>
            <Link href="/closure" className="btn-secondary w-full mt-2 text-center">Continue to Closure →</Link>
          </div>
        </aside>
      </div>
    </>
  );
}

function FormRow({ name, county, recommended }: { name: string; county: string; recommended?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
      <div>
        <div className="text-sm font-medium text-ink">{name}</div>
        <div className="text-xs text-slate-500">{county}</div>
      </div>
      <div className="flex items-center gap-2">
        {recommended && <span className="pill bg-sunset-100 text-sunset-700">Recommended</span>}
        <button className="btn-secondary text-xs">Generate</button>
      </div>
    </div>
  );
}

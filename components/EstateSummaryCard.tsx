"use client";
import { demoEstate, formatCurrency } from "@/lib/demoData";

export default function EstateSummaryCard() {
  const assetTotal = demoEstate.assets.reduce((s, a) => s + a.value, 0);
  const liabTotal = demoEstate.liabilities.reduce((s, l) => s + l.balance, 0);
  return (
    <div className="card p-4">
      <div className="label mb-2">Demo Estate</div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xl font-semibold text-ink">{demoEstate.deceased.fullName}</div>
          <div className="text-sm text-slate-500">
            Age {demoEstate.deceased.age} · DOD {demoEstate.deceased.dateOfDeath} · {demoEstate.deceased.address}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            SSN {demoEstate.deceased.ssn} · File {demoEstate.deceased.fileNumber}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-right">
          <div>
            <div className="label">Assets</div>
            <div className="text-lg font-semibold text-sage-700">{formatCurrency(assetTotal)}</div>
          </div>
          <div>
            <div className="label">Liabilities</div>
            <div className="text-lg font-semibold text-sunset-700">{formatCurrency(liabTotal)}</div>
          </div>
          <div>
            <div className="label">Net</div>
            <div className="text-lg font-semibold text-ink">{formatCurrency(assetTotal - liabTotal)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

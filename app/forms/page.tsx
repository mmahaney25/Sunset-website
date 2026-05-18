"use client";
import { useState } from "react";
import Link from "next/link";
import PhaseHeader from "@/components/PhaseHeader";
import { demoEstate } from "@/lib/demoData";
import { useStore } from "@/lib/store";

type FormDef = {
  id: string;
  institution: string;
  title: string;
  kind: "Closure" | "Claim" | "Transfer";
  accountRef: string;
  fields: { label: string; value: string; prefilled: boolean }[];
};

const buildForms = (): FormDef[] => {
  const d = demoEstate.deceased;
  const exec = demoEstate.will.executor;
  return [
    {
      id: "f-chase-close",
      institution: "Chase",
      title: "Deceased Account Closure Request",
      kind: "Closure",
      accountRef: "Checking ••1204 / Savings ••8821",
      fields: [
        { label: "Account holder", value: d.fullName, prefilled: true },
        { label: "Account numbers", value: "****1204, ****8821", prefilled: true },
        { label: "Date of death", value: d.dateOfDeath, prefilled: true },
        { label: "SSN (last 4)", value: "4729", prefilled: true },
        { label: "Executor", value: exec, prefilled: true },
        { label: "Disbursement instructions", value: "Transfer balance to Estate of Margaret Chen — EIN pending", prefilled: false },
      ],
    },
    {
      id: "f-fidelity-transfer",
      institution: "Fidelity",
      title: "Inherited IRA Beneficiary Claim",
      kind: "Transfer",
      accountRef: "IRA ****3340",
      fields: [
        { label: "Decedent name", value: d.fullName, prefilled: true },
        { label: "Account number", value: "****3340", prefilled: true },
        { label: "DOD", value: d.dateOfDeath, prefilled: true },
        { label: "Primary beneficiary", value: "David Chen (spouse) — 100%", prefilled: true },
        { label: "Distribution election", value: "Spousal rollover to inherited IRA", prefilled: false },
      ],
    },
    {
      id: "f-vanguard-401k",
      institution: "Vanguard",
      title: "401(k) Beneficiary Distribution",
      kind: "Transfer",
      accountRef: "401(k) ****7790",
      fields: [
        { label: "Participant", value: d.fullName, prefilled: true },
        { label: "Plan", value: "Madison Public Schools 401(k)", prefilled: true },
        { label: "DOD", value: d.dateOfDeath, prefilled: true },
        { label: "Beneficiary on file", value: "David Chen — 100%", prefilled: true },
        { label: "Payment election", value: "Direct rollover", prefilled: false },
      ],
    },
    {
      id: "f-metlife-claim",
      institution: "MetLife",
      title: "Life Insurance Death Claim",
      kind: "Claim",
      accountRef: "Policy POL-MTL-44219",
      fields: [
        { label: "Insured", value: d.fullName, prefilled: true },
        { label: "Policy number", value: "POL-MTL-44219", prefilled: true },
        { label: "Face amount", value: "$250,000", prefilled: true },
        { label: "DOD", value: d.dateOfDeath, prefilled: true },
        { label: "Cause of death", value: "Natural causes (per death certificate)", prefilled: true },
        { label: "Primary beneficiary", value: "David Chen — 60%; Lisa Park — 20%; Michael Chen — 20%", prefilled: true },
        { label: "Payment method", value: "ACH to estate account", prefilled: false },
      ],
    },
    {
      id: "f-schwab-tod",
      institution: "Schwab",
      title: "Brokerage Account Transfer (Non-TOD)",
      kind: "Transfer",
      accountRef: "Brokerage ****0156",
      fields: [
        { label: "Account holder", value: d.fullName, prefilled: true },
        { label: "Account", value: "****0156", prefilled: true },
        { label: "DOD", value: d.dateOfDeath, prefilled: true },
        { label: "Executor", value: exec, prefilled: true },
        { label: "Recipient", value: "Estate of Margaret Chen", prefilled: true },
        { label: "Cost basis step-up requested", value: "Yes — per IRC §1014", prefilled: false },
      ],
    },
    {
      id: "f-capone-close",
      institution: "Capital One",
      title: "Deceased Cardholder Notice & Closure",
      kind: "Closure",
      accountRef: "Visa ****4112",
      fields: [
        { label: "Cardholder", value: d.fullName, prefilled: true },
        { label: "Account", value: "****4112", prefilled: true },
        { label: "DOD", value: d.dateOfDeath, prefilled: true },
        { label: "Balance to dispute / settle", value: "$4,300 (under review)", prefilled: false },
      ],
    },
    {
      id: "f-nelnet-discharge",
      institution: "Nelnet (FSA)",
      title: "Federal Student Loan Death Discharge",
      kind: "Claim",
      accountRef: "Federal Direct ****FED-2231",
      fields: [
        { label: "Borrower", value: d.fullName, prefilled: true },
        { label: "SSN (last 4)", value: "4729", prefilled: true },
        { label: "DOD", value: d.dateOfDeath, prefilled: true },
        { label: "Discharge type", value: "Total & Permanent Discharge (death) — full balance forgiven", prefilled: true },
      ],
    },
  ];
};

export default function FormsPage() {
  const forms = buildForms();
  const [selected, setSelected] = useState(forms[0].id);
  const markComplete = useStore((s) => s.markComplete);
  const f = forms.find((x) => x.id === selected)!;

  return (
    <>
      <PhaseHeader phase="forms" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <div className="label">Auto-generated forms</div>
            <div className="text-xs text-slate-500">{forms.length} pre-filled from intake data</div>
          </div>
          <ul className="divide-y divide-slate-100">
            {forms.map((x) => (
              <li
                key={x.id}
                onClick={() => setSelected(x.id)}
                className={`p-3 cursor-pointer ${selected === x.id ? "bg-sunset-50" : "hover:bg-slate-50"}`}
              >
                <div className="text-xs text-slate-500">{x.institution} · {x.kind}</div>
                <div className="text-sm font-medium text-ink">{x.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{x.accountRef}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">{f.institution} · {f.kind}</div>
              <div className="font-semibold text-ink">{f.title}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary text-xs">⤓ Download PDF</button>
              <button className="btn-primary text-xs">▶ Send to {f.institution}</button>
            </div>
          </div>
          <div className="p-6 bg-white">
            <div className="border-2 border-slate-200 rounded-lg p-6 bg-slate-50/50">
              <div className="text-center mb-6">
                <div className="text-xs text-slate-500 uppercase tracking-wide">{f.institution}</div>
                <div className="text-lg font-semibold text-ink">{f.title}</div>
                <div className="text-xs text-slate-500 mt-1">Reference: {f.accountRef}</div>
              </div>
              <div className="space-y-3">
                {f.fields.map((field, i) => (
                  <div key={i} className="grid grid-cols-3 gap-3 items-start">
                    <div className="text-xs text-slate-600 font-medium pt-2">{field.label}</div>
                    <div className="col-span-2">
                      <input
                        defaultValue={field.value}
                        className={`field ${field.prefilled ? "bg-yellow-50 border-yellow-300" : "bg-white"}`}
                      />
                      {field.prefilled && (
                        <div className="text-[10px] text-yellow-700 mt-0.5">✦ Pre-filled from intake</div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-3 items-start mt-6 pt-4 border-t border-slate-200">
                  <div className="text-xs text-slate-600 font-medium pt-2">Executor signature</div>
                  <div className="col-span-2">
                    <div className="font-[cursive] text-xl italic text-ink border-b border-slate-300 pb-1">
                      {demoEstate.will.executor}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">E-signed · {new Date().toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button onClick={() => markComplete("forms")} className="btn-secondary">Mark forms complete</button>
        <Link href="/consolidation" className="btn-primary">Continue to Consolidation →</Link>
      </div>
    </>
  );
}

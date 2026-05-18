"use client";
import { useState } from "react";
import Link from "next/link";
import PhaseHeader from "@/components/PhaseHeader";
import { demoEstate } from "@/lib/demoData";
import { useStore } from "@/lib/store";

export default function IntakePage() {
  const intake = useStore((s) => s.intake);
  const setIntake = useStore((s) => s.setIntake);
  const markComplete = useStore((s) => s.markComplete);
  const [showSignature, setShowSignature] = useState(intake.consentSigned);
  const [uploading, setUploading] = useState(false);

  const d = demoEstate.deceased;

  const simulateUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setIntake({ deathCertUploaded: true });
      setUploading(false);
    }, 1200);
  };

  const simulateSign = () => {
    setShowSignature(true);
    setTimeout(() => setIntake({ consentSigned: true }), 800);
  };

  const allDone = intake.deathCertUploaded && intake.consentSigned && intake.nextOfKinSelected;

  return (
    <>
      <PhaseHeader phase="intake" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-ink mb-3">Deceased information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <Field label="Legal first name" value={d.firstName} />
              <Field label="Legal last name" value={d.lastName} />
              <Field label="Date of birth" value={d.dateOfBirth} />
              <Field label="Date of death" value={d.dateOfDeath} />
              <Field label="SSN" value={d.ssn} hint={`(Full: ${d.ssnFull} — masked in UI)`} />
              <Field label="Last known address" value={d.address} />
              <Field label="County" value={d.county} />
              <Field label="State" value={d.state} />
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Prefilled from funeral home intake at {d.funeralHome} · File {d.fileNumber}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-ink mb-3">Death certificate</h3>
            {intake.deathCertUploaded ? (
              <div className="flex items-center justify-between p-3 rounded-lg bg-sage-50 border border-sage-200">
                <div>
                  <div className="text-sm font-medium text-sage-700">death_certificate_chen_margaret.pdf</div>
                  <div className="text-xs text-slate-500">Uploaded · 412 KB · OCR verified</div>
                </div>
                <span className="pill bg-sage-100 text-sage-700">✓ Attached</span>
              </div>
            ) : (
              <button
                onClick={simulateUpload}
                disabled={uploading}
                className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-sunset-400 hover:bg-sunset-50/40 transition"
              >
                {uploading ? (
                  <div className="text-sm text-slate-600">
                    <span className="pulse-dot">●</span> Uploading & verifying…
                  </div>
                ) : (
                  <>
                    <div className="text-sm font-medium text-ink">Drop death certificate PDF</div>
                    <div className="text-xs text-slate-500 mt-1">Click to simulate upload</div>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-ink mb-3">Next-of-kin / executor</h3>
            <div className="space-y-2">
              {demoEstate.survivors.map((s) => (
                <label
                  key={s.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                    intake.nextOfKinSelected === s.id
                      ? "border-sunset-500 bg-sunset-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="nok"
                      checked={intake.nextOfKinSelected === s.id}
                      onChange={() => setIntake({ nextOfKinSelected: s.id })}
                      className="accent-sunset-600"
                    />
                    <div>
                      <div className="text-sm font-medium text-ink">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.relation}</div>
                    </div>
                  </div>
                  {s.isExecutor && (
                    <span className="pill bg-sunset-100 text-sunset-700">Named executor</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-ink mb-3">Consent & authorization</h3>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 max-h-48 overflow-auto">
              <p className="font-semibold text-ink mb-2">FuneralFlow Estate Settlement Authorization</p>
              <p>
                I, {intake.nextOfKinSelected
                  ? demoEstate.survivors.find((s) => s.id === intake.nextOfKinSelected)?.name
                  : "[next-of-kin]"}
                , as the lawful next-of-kin / executor of {d.fullName} (DOD {d.dateOfDeath}),
                hereby authorize Sunset Memorial Services and its partner platform
                FuneralFlow to: (a) initiate a tri-bureau credit and asset discovery
                on the decedent's behalf; (b) submit certified copies of the death
                certificate to identified creditors and financial institutions; (c)
                coordinate account closures, claim submissions, and asset transfers
                in accordance with applicable state and federal law; and (d) act on
                my behalf with limited scope until I revoke this authorization in
                writing.
              </p>
              <p className="mt-2">
                This authorization is governed by Wisconsin probate code and
                applicable federal statutes including the FCRA and GLBA.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs text-slate-500">
                {intake.nextOfKinSelected
                  ? `Signer: ${demoEstate.survivors.find((s) => s.id === intake.nextOfKinSelected)?.name}`
                  : "Select a next-of-kin first"}
              </div>
              {intake.consentSigned ? (
                <span className="pill bg-sage-100 text-sage-700">✓ E-signed {new Date().toLocaleDateString()}</span>
              ) : (
                <button
                  onClick={simulateSign}
                  disabled={!intake.nextOfKinSelected || !intake.deathCertUploaded}
                  className="btn-primary"
                >
                  {showSignature ? "Signing…" : "Send for e-signature"}
                </button>
              )}
            </div>
            {showSignature && (
              <div className="mt-4 border-t border-slate-200 pt-3">
                <div className="label mb-1">Signature</div>
                <div className="font-[cursive] text-2xl text-ink italic">
                  {intake.nextOfKinSelected
                    ? demoEstate.survivors.find((s) => s.id === intake.nextOfKinSelected)?.name
                    : ""}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-3">
          <div className="card p-4">
            <div className="label">Intake checklist</div>
            <ul className="mt-2 space-y-2 text-sm">
              <Check done label="Deceased info entered" />
              <Check done={intake.deathCertUploaded} label="Death certificate uploaded" />
              <Check done={!!intake.nextOfKinSelected} label="Next-of-kin selected" />
              <Check done={intake.consentSigned} label="Consent form e-signed" />
            </ul>
            {allDone && (
              <div className="mt-4">
                <button onClick={() => markComplete("intake")} className="btn-primary w-full">
                  Complete intake
                </button>
                <Link href="/discovery" className="btn-secondary w-full mt-2 text-center">
                  Continue to Discovery →
                </Link>
              </div>
            )}
          </div>
          <div className="card p-4 bg-slate-50">
            <div className="label">Why this matters</div>
            <p className="text-xs text-slate-600 mt-2">
              Intake builds the legal authority chain. Without an authenticated
              death certificate and signed consent, institutions will reject all
              downstream closure requests.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function Field({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <div className="label mb-1">{label}</div>
      <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-ink">{value}</div>
      {hint && <div className="text-[10px] text-slate-400 mt-1">{hint}</div>}
    </div>
  );
}

function Check({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
          done ? "bg-sage-500 text-white" : "bg-slate-200 text-slate-500"
        }`}
      >
        {done ? "✓" : "○"}
      </span>
      <span className={done ? "text-ink" : "text-slate-500"}>{label}</span>
    </li>
  );
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { phases, demoEstate, formatCurrency } from "@/lib/demoData";
import { useStore } from "@/lib/store";
import PipelineTracker from "@/components/PipelineTracker";

const STEP_NARRATION: Record<string, string[]> = {
  intake: [
    "Funeral home pulls the family record for Margaret Chen.",
    "Death certificate uploads & OCR-verifies.",
    "David Chen (spouse, executor) is selected as next-of-kin.",
    "Authorization is e-signed and timestamped.",
  ],
  discovery: [
    "Tri-bureau scan kicks off across Equifax, Experian, TransUnion…",
    "Finds 12 assets across 8 institutions.",
    "Finds 8 liabilities across 6 categories.",
    "Deduplicates trade lines and unifies into one estate view.",
  ],
  report: [
    "Generating estate snapshot…",
    "Joint mortgage with David Chen flagged — surviving spouse retains.",
    "Nelnet federal student loan flagged — eligible for full discharge.",
    "Report compiled. Export-as-PDF ready.",
  ],
  probate: [
    "Detected jurisdiction: Wisconsin · Dane County.",
    "Probate assets exceed $50K threshold → formal informal administration.",
    "Generated PR-1801, HT-130, DOA-6432 county forms.",
  ],
  closure: [
    "8 creditors entered the 4-tier closure waterfall.",
    "Email dispatched to all (Day 0).",
    "Certified mail queued for Day 7.",
    "AI phone agents scripted for Day 14.",
  ],
  forms: [
    "Auto-filling 7 institution-specific forms…",
    "Pre-filled fields highlighted yellow for executor review.",
    "Forms ready to e-sign and dispatch.",
  ],
  consolidation: [
    "Form SS-4 submitted — EIN issued.",
    "Estate checking opened at Chase Estate Services.",
    "Funds collecting as accounts close. Running balance updating.",
  ],
  monitoring: [
    "Day 30 re-pull: 1 new collection detected.",
    "Day 60 re-pull: Nelnet discharge confirmed.",
    "Day 90 re-pull: All consumer trade lines cleared.",
  ],
  distribution: [
    "Net distributable estate calculated.",
    "Per will: David 60% · Lisa 20% · Michael 20%.",
    "Executor approves. ACH transfers initiated.",
    "Final accounting filed. Estate closed.",
  ],
};

export default function WalkthroughPage() {
  const [stepIdx, setStepIdx] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const markComplete = useStore((s) => s.markComplete);
  const setPhase = useStore((s) => s.setPhase);
  const setIntake = useStore((s) => s.setIntake);
  const setDiscovery = useStore((s) => s.setDiscovery);
  const setConsolidation = useStore((s) => s.setConsolidation);
  const addAlert = useStore((s) => s.addAlert);
  const setMonitoring = useStore((s) => s.setMonitoring);
  const approveDistribution = useStore((s) => s.approveDistribution);
  const finalizeDistribution = useStore((s) => s.finalizeDistribution);

  const phase = phases[stepIdx];
  const narration = STEP_NARRATION[phase.key];

  useEffect(() => {
    setPhase(phase.key);
  }, [phase.key, setPhase]);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (subStep < narration.length - 1) {
        setSubStep(subStep + 1);
      } else {
        // Mark side effects for this phase
        applyPhaseSideEffects(phase.key);
        markComplete(phase.key);
        if (stepIdx < phases.length - 1) {
          setStepIdx(stepIdx + 1);
          setSubStep(0);
        } else {
          setPlaying(false);
        }
      }
    }, 1500 + Math.random() * 1500);
    return () => clearTimeout(timer);
  }, [playing, subStep, stepIdx, narration.length, phase.key, markComplete]);

  const applyPhaseSideEffects = (key: string) => {
    if (key === "intake") {
      setIntake({ deathCertUploaded: true, consentSigned: true, nextOfKinSelected: "s1" });
    } else if (key === "discovery") {
      setDiscovery({ completed: true, bureauProgress: { equifax: 1, experian: 1, transunion: 1 } });
    } else if (key === "consolidation") {
      setConsolidation({ einIssued: true, accountOpened: true });
    } else if (key === "monitoring") {
      setMonitoring({ pull30: true, pull60: true, pull90: true });
      addAlert("Walkthrough auto-pulled day 30/60/90", "ok");
    } else if (key === "distribution") {
      approveDistribution();
      finalizeDistribution();
    }
  };

  const reset = () => {
    setStepIdx(0);
    setSubStep(0);
    setPlaying(false);
  };

  return (
    <div className="space-y-4">
      <div className="card p-5 bg-gradient-to-br from-ink to-slate-700 text-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider opacity-70">Guided walkthrough</div>
            <h1 className="text-2xl font-semibold mt-1">{demoEstate.deceased.fullName} estate · end-to-end</h1>
            <p className="text-sm opacity-80 mt-1">
              Auto-advances through all 9 phases with 1.5–3s simulated delays.
            </p>
          </div>
          <div className="flex gap-2">
            {!playing && stepIdx < phases.length - 1 && (
              <button onClick={() => setPlaying(true)} className="btn-primary">▶ {subStep === 0 && stepIdx === 0 ? "Start" : "Resume"}</button>
            )}
            {playing && (
              <button onClick={() => setPlaying(false)} className="btn-secondary text-slate-700">⏸ Pause</button>
            )}
            <button onClick={reset} className="btn-ghost text-white hover:bg-white/10">Reset</button>
          </div>
        </div>
      </div>

      <PipelineTracker />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-6">
          <div className="text-xs text-slate-500 uppercase">Now playing</div>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-10 h-10 rounded-xl bg-sunset-600 text-white font-bold flex items-center justify-center">{phase.num}</div>
            <div>
              <div className="text-xl font-semibold text-ink">{phase.label}</div>
              <div className="text-xs text-slate-500">{phase.blurb}</div>
            </div>
          </div>
          <ol className="mt-5 space-y-3">
            {narration.map((line, i) => {
              const done = i < subStep;
              const active = i === subStep && playing;
              return (
                <li key={i} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                    done ? "bg-sage-500 text-white" : active ? "bg-sunset-500 text-white pulse-dot" : "bg-slate-200 text-slate-500"
                  }`}>
                    {done ? "✓" : i + 1}
                  </div>
                  <div className={`text-sm ${done ? "text-slate-500" : active ? "text-ink font-medium" : "text-slate-500"}`}>
                    {line}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 flex items-center justify-between flex-wrap gap-2">
            <Link href={phase.href} className="btn-secondary text-xs">Open {phase.label} screen →</Link>
            <div className="flex gap-2">
              <button
                onClick={() => { setSubStep(0); setStepIdx(Math.max(0, stepIdx - 1)); }}
                disabled={stepIdx === 0 && subStep === 0}
                className="btn-secondary text-xs"
              >← Previous phase</button>
              <button
                onClick={() => {
                  applyPhaseSideEffects(phase.key);
                  markComplete(phase.key);
                  if (stepIdx < phases.length - 1) {
                    setStepIdx(stepIdx + 1);
                    setSubStep(0);
                  }
                }}
                disabled={stepIdx >= phases.length - 1}
                className="btn-primary text-xs"
              >Skip to next →</button>
            </div>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="card p-4">
            <div className="label">Demo estate at a glance</div>
            <ul className="mt-2 text-xs space-y-1">
              <li><strong>{demoEstate.deceased.fullName}</strong>, age {demoEstate.deceased.age}</li>
              <li>Died {demoEstate.deceased.dateOfDeath} · {demoEstate.deceased.county}, {demoEstate.deceased.state}</li>
              <li>{demoEstate.assets.length} assets · {formatCurrency(demoEstate.assets.reduce((s,a)=>s+a.value,0))}</li>
              <li>{demoEstate.liabilities.length} liabilities · {formatCurrency(demoEstate.liabilities.reduce((s,l)=>s+l.balance,0))}</li>
              <li>Survivors: {demoEstate.survivors.map((s) => s.name).join(", ")}</li>
            </ul>
          </div>
          <div className="card p-4">
            <div className="label mb-2">Phase {phase.num} of 9</div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sunset-500 to-sunset-700 transition-all"
                style={{ width: `${((stepIdx + subStep / narration.length) / phases.length) * 100}%` }}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PhaseKey, demoEstate } from "./demoData";

type CreditorStatus = "queued" | "email_sent" | "mail_sent" | "ai_call" | "user_fallback" | "closed";

export type CreditorState = {
  id: string;
  tier: 0 | 1 | 2 | 3;
  status: CreditorStatus;
  lastUpdate: string;
  log: { ts: string; msg: string }[];
};

export type PhaseStatus = "pending" | "active" | "complete";

type StoreState = {
  currentPhase: PhaseKey;
  phaseStatus: Record<PhaseKey, PhaseStatus>;
  intake: {
    deathCertUploaded: boolean;
    consentSigned: boolean;
    nextOfKinSelected: string | null;
  };
  discovery: {
    completed: boolean;
    bureauProgress: { equifax: number; experian: number; transunion: number };
  };
  closure: Record<string, CreditorState>;
  consolidation: {
    einIssued: boolean;
    accountOpened: boolean;
    transactions: { id: string; date: string; description: string; amount: number }[];
  };
  monitoring: {
    pull30: boolean;
    pull60: boolean;
    pull90: boolean;
    alerts: { id: string; ts: string; msg: string; severity: "info" | "warn" | "ok" }[];
  };
  distribution: {
    shares: { id: string; sharePct: number }[];
    approved: boolean;
    finalized: boolean;
  };
  setPhase: (p: PhaseKey) => void;
  markComplete: (p: PhaseKey) => void;
  markActive: (p: PhaseKey) => void;
  setIntake: (patch: Partial<StoreState["intake"]>) => void;
  setDiscovery: (patch: Partial<StoreState["discovery"]>) => void;
  updateCreditor: (id: string, patch: Partial<CreditorState>) => void;
  appendCreditorLog: (id: string, msg: string) => void;
  setConsolidation: (patch: Partial<StoreState["consolidation"]>) => void;
  addTransaction: (t: { description: string; amount: number }) => void;
  setMonitoring: (patch: Partial<StoreState["monitoring"]>) => void;
  addAlert: (msg: string, severity?: "info" | "warn" | "ok") => void;
  setShares: (shares: { id: string; sharePct: number }[]) => void;
  approveDistribution: () => void;
  finalizeDistribution: () => void;
  resetAll: () => void;
};

const initialCreditors = (): Record<string, CreditorState> => {
  const result: Record<string, CreditorState> = {};
  for (const l of demoEstate.liabilities) {
    result[l.id] = {
      id: l.id,
      tier: 0,
      status: "queued",
      lastUpdate: new Date().toISOString(),
      log: [],
    };
  }
  return result;
};

const initialShares = () =>
  demoEstate.beneficiaries.map((b) => ({ id: b.id, sharePct: b.sharePct }));

const initialState = (): Omit<StoreState, "setPhase" | "markComplete" | "markActive" | "setIntake" | "setDiscovery" | "updateCreditor" | "appendCreditorLog" | "setConsolidation" | "addTransaction" | "setMonitoring" | "addAlert" | "setShares" | "approveDistribution" | "finalizeDistribution" | "resetAll"> => ({
  currentPhase: "intake",
  phaseStatus: {
    intake: "active",
    discovery: "pending",
    report: "pending",
    probate: "pending",
    closure: "pending",
    forms: "pending",
    consolidation: "pending",
    monitoring: "pending",
    distribution: "pending",
  },
  intake: {
    deathCertUploaded: false,
    consentSigned: false,
    nextOfKinSelected: null,
  },
  discovery: {
    completed: false,
    bureauProgress: { equifax: 0, experian: 0, transunion: 0 },
  },
  closure: initialCreditors(),
  consolidation: {
    einIssued: false,
    accountOpened: false,
    transactions: [],
  },
  monitoring: {
    pull30: false,
    pull60: false,
    pull90: false,
    alerts: [],
  },
  distribution: {
    shares: initialShares(),
    approved: false,
    finalized: false,
  },
});

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...initialState(),
      setPhase: (p) => set({ currentPhase: p }),
      markActive: (p) =>
        set((s) => ({
          currentPhase: p,
          phaseStatus: { ...s.phaseStatus, [p]: s.phaseStatus[p] === "complete" ? "complete" : "active" },
        })),
      markComplete: (p) =>
        set((s) => ({ phaseStatus: { ...s.phaseStatus, [p]: "complete" } })),
      setIntake: (patch) => set((s) => ({ intake: { ...s.intake, ...patch } })),
      setDiscovery: (patch) => set((s) => ({ discovery: { ...s.discovery, ...patch } })),
      updateCreditor: (id, patch) =>
        set((s) => ({
          closure: {
            ...s.closure,
            [id]: { ...s.closure[id], ...patch, lastUpdate: new Date().toISOString() },
          },
        })),
      appendCreditorLog: (id, msg) =>
        set((s) => ({
          closure: {
            ...s.closure,
            [id]: {
              ...s.closure[id],
              log: [...s.closure[id].log, { ts: new Date().toISOString(), msg }],
              lastUpdate: new Date().toISOString(),
            },
          },
        })),
      setConsolidation: (patch) => set((s) => ({ consolidation: { ...s.consolidation, ...patch } })),
      addTransaction: (t) =>
        set((s) => ({
          consolidation: {
            ...s.consolidation,
            transactions: [
              ...s.consolidation.transactions,
              {
                id: `tx-${s.consolidation.transactions.length + 1}`,
                date: new Date().toISOString().slice(0, 10),
                description: t.description,
                amount: t.amount,
              },
            ],
          },
        })),
      setMonitoring: (patch) => set((s) => ({ monitoring: { ...s.monitoring, ...patch } })),
      addAlert: (msg, severity = "info") =>
        set((s) => ({
          monitoring: {
            ...s.monitoring,
            alerts: [
              { id: `al-${s.monitoring.alerts.length + 1}`, ts: new Date().toISOString(), msg, severity },
              ...s.monitoring.alerts,
            ],
          },
        })),
      setShares: (shares) => set((s) => ({ distribution: { ...s.distribution, shares } })),
      approveDistribution: () =>
        set((s) => ({ distribution: { ...s.distribution, approved: true } })),
      finalizeDistribution: () =>
        set((s) => ({ distribution: { ...s.distribution, finalized: true } })),
      resetAll: () => set(initialState()),
    }),
    { name: "funeralflow-demo-v1" }
  )
);

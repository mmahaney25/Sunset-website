import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Asset, Liability, Beneficiary, DeceasedInfo,
  Notification, EstateBankAccount, ProbateForm, ChannelType, NotificationStatus,
} from './data/types'
import { demoAssets, demoBeneficiaries, demoDeceased, demoLiabilities, generateProbateForms } from './data/demoEstate'

type Step = 1 | 2 | 3 | 4 | 5

interface SunsetState {
  signedIn: boolean
  userEmail?: string
  signIn: (email: string) => void
  signOut: () => void

  deceased?: DeceasedInfo
  setDeceased: (d: DeceasedInfo) => void

  currentStep: Step
  setStep: (s: Step) => void
  highestStep: Step

  // discovery
  discoveryComplete: boolean
  assets: Asset[]
  liabilities: Liability[]
  runDiscovery: () => Promise<void>
  setAssets: (a: Asset[]) => void
  setLiabilities: (l: Liability[]) => void

  // probate
  probateState: string
  probateCounty: string
  probateForms: ProbateForm[]
  notarizationScheduled?: { dt: string; provider: string }
  setProbateJurisdiction: (state: string, county: string) => void
  generateForms: () => void
  scheduleNotary: (dt: string, provider: string) => void
  markFormStatus: (id: string, status: ProbateForm['status']) => void

  // estate account
  estateAccount: EstateBankAccount
  fileEIN: () => Promise<void>
  openEstateAccount: () => void
  addTransaction: (t: { description: string; amount: number; category: EstateBankAccount['transactions'][number]['category'] }) => void

  // closure / notifications
  notifications: Notification[]
  sendNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'status'>) => void
  updateNotificationStatus: (id: string, status: NotificationStatus) => void

  // financial transfer
  fraudCheckPassed: boolean
  runFraudCheck: () => Promise<void>
  closeAndTransfer: (assetId: string) => void

  // distribution
  beneficiaries: Beneficiary[]
  setBeneficiaries: (b: Beneficiary[]) => void
  approveBeneficiary: (id: string) => void
  distributeFunds: () => void

  // demo helpers
  loadDemoEstate: () => void
  resetEverything: () => void
}

const initialEstateAccount: EstateBankAccount = {
  balance: 0,
  status: 'not_started',
  transactions: [],
}

function randomEIN(): string {
  const a = Math.floor(10 + Math.random() * 89)
  const b = Math.floor(1000000 + Math.random() * 8999999)
  return `${a}-${b}`
}
function randomAccount(): string {
  return Math.floor(1000000000 + Math.random() * 8999999999).toString()
}
function randomRouting(): string {
  return Math.floor(100000000 + Math.random() * 899999999).toString()
}

export const useStore = create<SunsetState>()(persist(
  (set, get) => ({
    signedIn: false,
    userEmail: undefined,
    signIn: (email) => set({ signedIn: true, userEmail: email }),
    signOut: () => set({ signedIn: false, userEmail: undefined }),

    deceased: undefined,
    setDeceased: (d) => set({ deceased: d, probateState: d.state, probateCounty: d.county ?? '' }),

    currentStep: 1,
    setStep: (s) => set((st) => ({ currentStep: s, highestStep: (Math.max(st.highestStep, s) as Step) })),
    highestStep: 1,

    discoveryComplete: false,
    assets: [],
    liabilities: [],
    runDiscovery: async () => {
      await new Promise((r) => setTimeout(r, 2400))
      set({ assets: demoAssets, liabilities: demoLiabilities, discoveryComplete: true })
    },
    setAssets: (a) => set({ assets: a }),
    setLiabilities: (l) => set({ liabilities: l }),

    probateState: '',
    probateCounty: '',
    probateForms: [],
    setProbateJurisdiction: (state, county) => set({ probateState: state, probateCounty: county }),
    generateForms: () => {
      const { probateState, probateCounty } = get()
      if (!probateState || !probateCounty) return
      set({ probateForms: generateProbateForms(probateState, probateCounty) })
    },
    scheduleNotary: (dt, provider) => set({ notarizationScheduled: { dt, provider } }),
    markFormStatus: (id, status) => set((st) => ({
      probateForms: st.probateForms.map((f) => f.id === id ? { ...f, status } : f),
    })),

    estateAccount: initialEstateAccount,
    fileEIN: async () => {
      await new Promise((r) => setTimeout(r, 1800))
      set((st) => ({ estateAccount: { ...st.estateAccount, ein: randomEIN(), status: 'ein_filed' } }))
    },
    openEstateAccount: () => set((st) => ({
      estateAccount: {
        ...st.estateAccount,
        accountNumber: randomAccount(),
        routingNumber: randomRouting(),
        status: 'opened',
      },
    })),
    addTransaction: (t) => set((st) => {
      const tx = {
        id: `tx-${Math.random().toString(36).slice(2, 9)}`,
        date: new Date().toISOString().slice(0, 10),
        description: t.description, amount: t.amount, category: t.category,
      }
      return {
        estateAccount: {
          ...st.estateAccount,
          balance: st.estateAccount.balance + t.amount,
          transactions: [tx, ...st.estateAccount.transactions],
        },
      }
    }),

    notifications: [],
    sendNotification: (n) => set((st) => {
      const id = `n-${Math.random().toString(36).slice(2, 9)}`
      const createdAt = new Date().toISOString()
      const dueDate = new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().slice(0, 10)
      return {
        notifications: [
          { ...n, id, createdAt, status: 'sent', followUpDue: dueDate },
          ...st.notifications,
        ],
      }
    }),
    updateNotificationStatus: (id, status) => set((st) => ({
      notifications: st.notifications.map((n) => n.id === id ? { ...n, status } : n),
    })),

    fraudCheckPassed: false,
    runFraudCheck: async () => {
      await new Promise((r) => setTimeout(r, 2000))
      set({ fraudCheckPassed: true })
    },
    closeAndTransfer: (assetId) => set((st) => {
      const asset = st.assets.find((a) => a.id === assetId)
      if (!asset) return st
      const updatedAssets = st.assets.map((a) =>
        a.id === assetId ? { ...a, status: 'transferred' as const } : a
      )
      const tx = {
        id: `tx-${Math.random().toString(36).slice(2, 9)}`,
        date: new Date().toISOString().slice(0, 10),
        description: `Incoming transfer — ${asset.institution} ••${asset.accountLast4}`,
        amount: asset.balance,
        category: 'incoming_transfer' as const,
      }
      return {
        assets: updatedAssets,
        estateAccount: {
          ...st.estateAccount,
          balance: st.estateAccount.balance + asset.balance,
          transactions: [tx, ...st.estateAccount.transactions],
        },
      }
    }),

    beneficiaries: [],
    setBeneficiaries: (b) => set({ beneficiaries: b }),
    approveBeneficiary: (id) => set((st) => ({
      beneficiaries: st.beneficiaries.map((b) => b.id === id ? { ...b, approvalState: 'approved' } : b),
    })),
    distributeFunds: () => set((st) => {
      const total = st.estateAccount.balance
      const newTransactions = st.beneficiaries.map((b) => ({
        id: `tx-${Math.random().toString(36).slice(2, 9)}`,
        date: new Date().toISOString().slice(0, 10),
        description: `Distribution to ${b.name} (${b.relationship}) — ${b.sharePct}%`,
        amount: -(total * (b.sharePct / 100)),
        category: 'distribution' as const,
      }))
      const updatedBenes = st.beneficiaries.map((b) => ({
        ...b,
        amountAllocated: total * (b.sharePct / 100),
        approvalState: 'sent' as const,
      }))
      return {
        beneficiaries: updatedBenes,
        estateAccount: {
          ...st.estateAccount,
          balance: 0,
          transactions: [...newTransactions, ...st.estateAccount.transactions],
        },
      }
    }),

    loadDemoEstate: () => set({
      deceased: demoDeceased,
      assets: demoAssets,
      liabilities: demoLiabilities,
      beneficiaries: demoBeneficiaries,
      discoveryComplete: true,
      probateState: demoDeceased.state,
      probateCounty: demoDeceased.county ?? '',
      probateForms: generateProbateForms(demoDeceased.state, demoDeceased.county ?? 'Buncombe'),
      signedIn: true,
      userEmail: 'demo@example.com',
      currentStep: 1,
      highestStep: 5,
    }),
    resetEverything: () => set({
      signedIn: false, userEmail: undefined, deceased: undefined,
      currentStep: 1, highestStep: 1,
      discoveryComplete: false, assets: [], liabilities: [],
      probateState: '', probateCounty: '', probateForms: [], notarizationScheduled: undefined,
      estateAccount: initialEstateAccount,
      notifications: [],
      fraudCheckPassed: false,
      beneficiaries: [],
    }),
  }),
  { name: 'sunset-store' },
))

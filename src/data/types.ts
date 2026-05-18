export type AssetType =
  | 'IRA'
  | '401k'
  | 'Savings'
  | 'Checking'
  | 'CD'
  | 'Stocks'
  | 'Bonds'
  | 'Life Insurance'
  | 'Funeral Insurance'
  | 'HSA'
  | 'Credit Card Rewards'
  | 'Property'
  | 'Vehicle'
  | 'Crypto'
  | 'Business Account'
  | 'Pension'

export type LiabilityType =
  | 'Credit Card'
  | 'Personal Loan'
  | 'Auto Loan'
  | 'Auto Lease'
  | 'Mortgage'
  | 'HELOC'
  | 'Student Loan'
  | 'Business Loan'
  | 'Medical Debt'
  | 'Line of Credit'
  | 'Collections'

export type ChannelType = 'email' | 'fax' | 'phone' | 'mail'

export type AccountStatus = 'discovered' | 'closing' | 'closed' | 'transferred'

export type NotificationStatus = 'pending' | 'sent' | 'confirmed' | 'disputed'

export interface Asset {
  id: string
  type: AssetType
  institution: string
  accountLast4: string
  balance: number
  ownership: 'sole' | 'joint' | 'beneficiary'
  beneficiaryNamed?: string
  discoveredVia: string
  status: AccountStatus
  contact: { phone: string; email?: string; mailingAddress?: string; faxNumber?: string }
  notes?: string
}

export interface Liability {
  id: string
  type: LiabilityType
  creditor: string
  accountLast4: string
  balance: number
  status: 'current' | 'past_due' | 'in_collections' | 'closed'
  sharedDebt: boolean
  coSigner?: string
  contact: { phone: string; email?: string; mailingAddress?: string; faxNumber?: string }
  apr?: number
}

export interface Beneficiary {
  id: string
  name: string
  relationship: string
  sharePct: number
  email: string
  amountAllocated?: number
  approvalState: 'pending' | 'approved' | 'sent'
}

export interface Notification {
  id: string
  targetType: 'asset' | 'liability'
  targetId: string
  targetName: string
  channel: ChannelType
  subject: string
  body: string
  status: NotificationStatus
  createdAt: string
  followUpDue?: string
}

export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category: 'incoming_transfer' | 'funeral' | 'legal' | 'utilities' | 'tax' | 'distribution' | 'other'
}

export interface ProbateForm {
  id: string
  title: string
  jurisdiction: string
  description: string
  status: 'draft' | 'ready' | 'notarized' | 'filed'
  pages: number
}

export interface DeceasedInfo {
  fullName: string
  ssn: string
  dob: string
  dod: string
  addressLine1: string
  city: string
  state: string
  zip: string
  county?: string
}

export interface EstateBankAccount {
  ein?: string
  accountNumber?: string
  routingNumber?: string
  balance: number
  status: 'not_started' | 'ein_filed' | 'opened'
  transactions: Transaction[]
}

export interface PipelineStep {
  id: 1 | 2 | 3 | 4 | 5
  key: 'discover' | 'probate' | 'estate_account' | 'closures' | 'distribute'
  label: string
  description: string
}

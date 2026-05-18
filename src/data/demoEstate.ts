import type { Asset, Liability, Beneficiary, DeceasedInfo, ProbateForm } from './types'

export const demoDeceased: DeceasedInfo = {
  fullName: 'Harold W. Mitchell',
  ssn: 'XXX-XX-4729',
  dob: '1948-03-14',
  dod: '2026-02-08',
  addressLine1: '482 Lakeshore Drive',
  city: 'Asheville',
  state: 'NC',
  zip: '28801',
  county: 'Buncombe',
}

export const demoAssets: Asset[] = [
  {
    id: 'a1', type: 'Checking', institution: 'Wells Fargo', accountLast4: '4821',
    balance: 12480.55, ownership: 'sole', discoveredVia: 'IRS Form 1099-INT',
    status: 'discovered',
    contact: { phone: '1-800-869-3557', email: 'estates@wellsfargo.com', faxNumber: '1-866-415-4683', mailingAddress: 'WF Estate Services, MAC #X2401-06T, 1 Home Campus, Des Moines, IA 50328' },
  },
  {
    id: 'a2', type: 'Savings', institution: 'Wells Fargo', accountLast4: '0192',
    balance: 38215.10, ownership: 'sole', discoveredVia: 'IRS Form 1099-INT',
    status: 'discovered',
    contact: { phone: '1-800-869-3557', email: 'estates@wellsfargo.com', faxNumber: '1-866-415-4683' },
  },
  {
    id: 'a3', type: 'IRA', institution: 'Fidelity Investments', accountLast4: '7710',
    balance: 412380.22, ownership: 'sole', beneficiaryNamed: 'Margaret Mitchell',
    discoveredVia: 'Fidelity beneficiary registry',
    status: 'discovered',
    contact: { phone: '1-800-544-6666', email: 'estate.services@fidelity.com', mailingAddress: 'Fidelity Estate Processing, PO Box 770001, Cincinnati, OH 45277' },
  },
  {
    id: 'a4', type: '401k', institution: 'Vanguard', accountLast4: '3329',
    balance: 188420.00, ownership: 'sole', beneficiaryNamed: 'Margaret Mitchell',
    discoveredVia: 'Employer plan records',
    status: 'discovered',
    contact: { phone: '1-800-523-1188', email: 'estates@vanguard.com' },
  },
  {
    id: 'a5', type: 'Stocks', institution: 'Charles Schwab', accountLast4: '8804',
    balance: 76210.45, ownership: 'sole', discoveredVia: 'DTCC unclaimed property',
    status: 'discovered',
    contact: { phone: '1-800-435-4000', email: 'estates@schwab.com' },
  },
  {
    id: 'a6', type: 'CD', institution: 'Capital One', accountLast4: '2241',
    balance: 25000.00, ownership: 'sole', discoveredVia: 'IRS Form 1099-INT',
    status: 'discovered',
    contact: { phone: '1-800-227-4825' },
  },
  {
    id: 'a7', type: 'Life Insurance', institution: 'Northwestern Mutual', accountLast4: '1138',
    balance: 250000.00, ownership: 'beneficiary', beneficiaryNamed: 'Margaret Mitchell',
    discoveredVia: 'NAIC Life Policy Locator',
    status: 'discovered',
    contact: { phone: '1-800-388-8123', email: 'claims@northwesternmutual.com' },
  },
  {
    id: 'a8', type: 'Funeral Insurance', institution: 'Lincoln Heritage', accountLast4: '5560',
    balance: 15000.00, ownership: 'beneficiary', beneficiaryNamed: 'Estate',
    discoveredVia: 'Funeral home records',
    status: 'discovered',
    contact: { phone: '1-800-433-8181' },
  },
  {
    id: 'a9', type: 'HSA', institution: 'HealthEquity', accountLast4: '0044',
    balance: 6420.18, ownership: 'sole', discoveredVia: 'HSA aggregator',
    status: 'discovered',
    contact: { phone: '1-866-346-5800' },
  },
  {
    id: 'a10', type: 'Property', institution: 'Buncombe County Register of Deeds', accountLast4: 'DEED',
    balance: 485000.00, ownership: 'joint',
    discoveredVia: 'County deed records — 482 Lakeshore Dr.',
    status: 'discovered',
    contact: { phone: '828-250-4300', mailingAddress: '205 College St, Asheville, NC 28801' },
  },
  {
    id: 'a11', type: 'Vehicle', institution: 'NC DMV', accountLast4: '2019 Subaru Outback',
    balance: 18500.00, ownership: 'sole', discoveredVia: 'State title records',
    status: 'discovered',
    contact: { phone: '919-715-7000' },
  },
  {
    id: 'a12', type: 'Crypto', institution: 'Coinbase', accountLast4: '0xA4f9',
    balance: 4280.92, ownership: 'sole', discoveredVia: 'Email statement match',
    status: 'discovered',
    contact: { phone: '1-888-908-7930', email: 'estates@coinbase.com' },
  },
]

export const demoLiabilities: Liability[] = [
  {
    id: 'l1', type: 'Credit Card', creditor: 'Chase Sapphire', accountLast4: '6612',
    balance: 4382.10, status: 'current', sharedDebt: false,
    contact: { phone: '1-800-432-3117', email: 'estate.documents@chase.com', faxNumber: '1-866-282-5366', mailingAddress: 'Chase Estate Recovery, PO Box 15298, Wilmington, DE 19850' },
    apr: 22.49,
  },
  {
    id: 'l2', type: 'Credit Card', creditor: 'American Express Gold', accountLast4: '1005',
    balance: 2140.55, status: 'current', sharedDebt: true, coSigner: 'Margaret Mitchell',
    contact: { phone: '1-800-528-4800', email: 'estates@aexp.com' },
    apr: 19.99,
  },
  {
    id: 'l3', type: 'Mortgage', creditor: 'Bank of America Home Loans', accountLast4: '8821',
    balance: 142800.00, status: 'current', sharedDebt: true, coSigner: 'Margaret Mitchell',
    contact: { phone: '1-800-669-6607', mailingAddress: 'BoA Home Loans, PO Box 31785, Tampa, FL 33631' },
    apr: 3.875,
  },
  {
    id: 'l4', type: 'Auto Loan', creditor: 'Toyota Financial Services', accountLast4: '4490',
    balance: 8214.00, status: 'current', sharedDebt: false,
    contact: { phone: '1-800-874-8822' },
    apr: 4.9,
  },
  {
    id: 'l5', type: 'Medical Debt', creditor: 'Mission Hospital', accountLast4: 'INV-4421',
    balance: 12480.00, status: 'past_due', sharedDebt: false,
    contact: { phone: '828-213-1111', mailingAddress: '509 Biltmore Ave, Asheville, NC 28801' },
  },
  {
    id: 'l6', type: 'Personal Loan', creditor: 'SoFi', accountLast4: '7720',
    balance: 6320.00, status: 'in_collections', sharedDebt: false,
    contact: { phone: '1-855-456-7634', email: 'estates@sofi.com' },
    apr: 11.49,
  },
]

export const demoBeneficiaries: Beneficiary[] = [
  { id: 'b1', name: 'Margaret Mitchell', relationship: 'Spouse', sharePct: 50, email: 'margaret.mitchell@example.com', approvalState: 'pending' },
  { id: 'b2', name: 'Daniel Mitchell', relationship: 'Son', sharePct: 25, email: 'daniel.mitchell@example.com', approvalState: 'pending' },
  { id: 'b3', name: 'Sarah Mitchell-Reyes', relationship: 'Daughter', sharePct: 25, email: 'sarah.reyes@example.com', approvalState: 'pending' },
]

export function generateProbateForms(state: string, county: string): ProbateForm[] {
  const j = `${county} County, ${state}`
  return [
    { id: 'p1', title: 'Application for Probate and Letters Testamentary', jurisdiction: j, description: 'Petition filed with the Clerk of Superior Court to open the estate and appoint the personal representative.', status: 'draft', pages: 4 },
    { id: 'p2', title: 'Preliminary Inventory of Decedent\'s Estate', jurisdiction: j, description: 'Lists all known assets, their estimated values, and ownership at the date of death.', status: 'draft', pages: 6 },
    { id: 'p3', title: 'Oath of Personal Representative', jurisdiction: j, description: 'Sworn statement by the executor to faithfully administer the estate per the laws of the jurisdiction.', status: 'draft', pages: 2 },
    { id: 'p4', title: 'Notice to Creditors (Publication Affidavit)', jurisdiction: j, description: 'Affidavit confirming publication of notice to creditors in a local newspaper of general circulation.', status: 'draft', pages: 2 },
    { id: 'p5', title: 'Estate Tax Certification', jurisdiction: j, description: `Certification used to determine state estate-tax liability under ${state} law.`, status: 'draft', pages: 3 },
  ]
}

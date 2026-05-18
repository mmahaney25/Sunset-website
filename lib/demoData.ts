export type Asset = {
  id: string;
  type:
    | "checking"
    | "savings"
    | "ira"
    | "401k"
    | "brokerage"
    | "life_insurance"
    | "property"
    | "vehicle"
    | "crypto"
    | "bond"
    | "hsa"
    | "auto_insurance";
  institution: string;
  label: string;
  value: number;
  accountNumber?: string;
  notes?: string;
};

export type Liability = {
  id: string;
  type:
    | "credit_card"
    | "mortgage"
    | "student_loan"
    | "medical"
    | "utility"
    | "personal_loan";
  institution: string;
  label: string;
  balance: number;
  accountNumber?: string;
  flags?: ("joint_with_spouse" | "federal_discharge_eligible")[];
};

export type Beneficiary = {
  id: string;
  name: string;
  relation: string;
  sharePct: number;
};

export const demoEstate = {
  deceased: {
    firstName: "Margaret",
    lastName: "Chen",
    fullName: "Margaret Chen",
    age: 74,
    dateOfBirth: "1950-11-03",
    dateOfDeath: "2025-04-12",
    ssn: "XXX-XX-4729",
    ssnFull: "523-94-4729",
    address: "1847 Elm St, Madison, WI 53703",
    county: "Dane County",
    state: "Wisconsin",
    funeralHome: "Sunset Memorial Services",
    fileNumber: "SMS-2025-0412",
  },
  survivors: [
    { id: "s1", name: "David Chen", relation: "Spouse", isExecutor: true },
    { id: "s2", name: "Lisa Park", relation: "Daughter", isExecutor: false },
    { id: "s3", name: "Michael Chen", relation: "Son", isExecutor: false },
  ],
  beneficiaries: [
    { id: "b1", name: "David Chen", relation: "Spouse", sharePct: 60 },
    { id: "b2", name: "Lisa Park", relation: "Daughter", sharePct: 20 },
    { id: "b3", name: "Michael Chen", relation: "Son", sharePct: 20 },
  ] as Beneficiary[],
  assets: [
    { id: "a1", type: "checking", institution: "Chase", label: "Chase Checking ••1204", value: 14200, accountNumber: "****1204" },
    { id: "a2", type: "savings", institution: "Chase", label: "Chase Savings ••8821", value: 31500, accountNumber: "****8821" },
    { id: "a3", type: "ira", institution: "Fidelity", label: "Fidelity Traditional IRA", value: 187000, accountNumber: "****3340" },
    { id: "a4", type: "401k", institution: "Vanguard", label: "Vanguard 401(k)", value: 243000, accountNumber: "****7790" },
    { id: "a5", type: "brokerage", institution: "Schwab", label: "Schwab Brokerage", value: 67800, accountNumber: "****0156" },
    { id: "a6", type: "life_insurance", institution: "MetLife", label: "MetLife Term Life Policy", value: 250000, accountNumber: "POL-MTL-44219" },
    { id: "a7", type: "property", institution: "Dane County Registry", label: "Home — 1847 Elm St, Madison WI", value: 385000, notes: "Single-family residence" },
    { id: "a8", type: "vehicle", institution: "WI DMV", label: "2019 Honda Accord", value: 18500, accountNumber: "VIN ••JH4KA" },
    { id: "a9", type: "crypto", institution: "Coinbase", label: "Coinbase — BTC/ETH", value: 4200 },
    { id: "a10", type: "bond", institution: "U.S. Treasury", label: "U.S. Treasury I-Bonds", value: 25000 },
    { id: "a11", type: "hsa", institution: "HealthEquity", label: "Health Savings Account", value: 3100 },
    { id: "a12", type: "auto_insurance", institution: "USAA", label: "USAA Auto Policy (refund pending)", value: 0, notes: "Active policy — refund / cancellation pending" },
  ] as Asset[],
  liabilities: [
    { id: "l1", type: "credit_card", institution: "Capital One", label: "Capital One Visa", balance: 4300, accountNumber: "****4112" },
    { id: "l2", type: "credit_card", institution: "Discover", label: "Discover Card", balance: 1800, accountNumber: "****9078" },
    { id: "l3", type: "mortgage", institution: "Chase", label: "Chase Mortgage — 1847 Elm St", balance: 142000, accountNumber: "MTG-CHS-77821", flags: ["joint_with_spouse"] },
    { id: "l4", type: "student_loan", institution: "Nelnet (Federal)", label: "Federal Direct Student Loan", balance: 12400, accountNumber: "****FED-2231", flags: ["federal_discharge_eligible"] },
    { id: "l5", type: "medical", institution: "UW Health", label: "UW Health — Medical Collection", balance: 2300 },
    { id: "l6", type: "utility", institution: "AT&T", label: "AT&T — Final Bill", balance: 287 },
    { id: "l7", type: "utility", institution: "Spectrum", label: "Spectrum — Final Bill", balance: 142 },
    { id: "l8", type: "personal_loan", institution: "Marcus by Goldman Sachs", label: "Marcus Personal Loan", balance: 8500, accountNumber: "****PL-3340" },
  ] as Liability[],
  will: {
    onFile: true,
    executor: "David Chen",
    notes: "Last will dated 2022-08-14, on file at Dane County",
  },
};

export const phases = [
  { key: "intake", num: 1, label: "Intake", href: "/intake", blurb: "Funeral home enters deceased info & consent" },
  { key: "discovery", num: 2, label: "Discovery", href: "/discovery", blurb: "3-bureau scan finds assets & liabilities" },
  { key: "report", num: 3, label: "Report", href: "/report", blurb: "Unified estate snapshot with flags" },
  { key: "probate", num: 4, label: "Probate", href: "/probate", blurb: "County detection + correct filing path" },
  { key: "closure", num: 5, label: "Closure", href: "/closure", blurb: "4-tier creditor & account closure" },
  { key: "forms", num: 6, label: "Forms", href: "/forms", blurb: "Auto-filled institution-specific PDFs" },
  { key: "consolidation", num: 7, label: "Consolidation", href: "/consolidation", blurb: "Estate account & running balance" },
  { key: "monitoring", num: 8, label: "Monitoring", href: "/monitoring", blurb: "30/60/90-day re-pulls & alerts" },
  { key: "distribution", num: 9, label: "Distribution", href: "/distribution", blurb: "Beneficiary shares & final accounting" },
] as const;

export type PhaseKey = (typeof phases)[number]["key"];

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const assetTypeLabel = (t: Asset["type"]) =>
  ({
    checking: "Checking",
    savings: "Savings",
    ira: "IRA",
    "401k": "401(k)",
    brokerage: "Brokerage",
    life_insurance: "Life Insurance",
    property: "Real Property",
    vehicle: "Vehicle",
    crypto: "Crypto",
    bond: "Treasury Bond",
    hsa: "HSA",
    auto_insurance: "Auto Insurance",
  }[t]);

export const liabilityTypeLabel = (t: Liability["type"]) =>
  ({
    credit_card: "Credit Card",
    mortgage: "Mortgage",
    student_loan: "Student Loan",
    medical: "Medical",
    utility: "Utility",
    personal_loan: "Personal Loan",
  }[t]);

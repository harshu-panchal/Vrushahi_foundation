import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const donationInputSchema = z.object({
  donorId: z.string().trim().length(24).optional(),
  donorName: z.string().trim().min(1).max(200).optional(),
  donorEmail: z.string().trim().email().optional().or(z.literal("")),
  donorPhone: z.string().trim().max(30).optional().or(z.literal("")),
  donorCity: z.string().trim().max(120).optional().or(z.literal("")),
  amount: z.coerce.number().positive(),
  currency: z.string().trim().max(10).optional(),
  mode: z.enum(["cash", "bank_transfer", "upi", "cheque", "other"]),
  program: z.string().trim().max(80).optional(),
  date: z.coerce.date(),
  referenceNote: z.string().trim().max(500).optional().or(z.literal("")),
});

export const donationUpdateSchema = donationInputSchema.partial().extend({
  amount: z.coerce.number().positive().optional(),
  mode: z
    .enum(["cash", "bank_transfer", "upi", "cheque", "other"])
    .optional(),
  date: z.coerce.date().optional(),
});

export const donorUpdateSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

// Deliberately accepts any string — validation must not reject a filled
// honeypot, since the route handler needs to see the value to silently
// discard the submission rather than returning an error that tips off bots.
const honeypotField = z.string().optional().or(z.literal(""));

export const volunteerSignupSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  interest: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  company: honeypotField,
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
  company: honeypotField,
});

export const statusUpdateSchema = z.object({
  status: z.string().trim().min(1).max(30),
});

// --- Trustees ---

export const trusteeSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only")
    .optional()
    .or(z.literal("")),
  designation: z.string().trim().min(1).max(120),
  photoUrl: z.string().trim().max(500).optional().or(z.literal("")),
  bio: z.string().trim().max(5000).optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  order: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const trusteeUpdateSchema = trusteeSchema.partial();

// --- Online donations (Razorpay) ---

const indianMobileSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number");

export const donationOrderSchema = z.object({
  donorName: z.string().trim().min(1).max(200),
  donorEmail: z.string().trim().email().optional().or(z.literal("")),
  donorPhone: indianMobileSchema,
  donorMobile2: indianMobileSchema.optional().or(z.literal("")),
  donorAddress: z.string().trim().max(300).optional().or(z.literal("")),
  amount: z.coerce.number().min(10).max(10000000),
  donationType: z.string().trim().max(60).optional().or(z.literal("")),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  suggestion: z.string().trim().max(1000).optional().or(z.literal("")),
  company: honeypotField,
});

export const donationVerifySchema = z.object({
  donationId: z.string().trim().length(24),
  razorpay_order_id: z.string().trim().min(1),
  razorpay_payment_id: z.string().trim().min(1),
  razorpay_signature: z.string().trim().min(1),
});

export const donationAllocationSchema = z.object({
  program: z.string().trim().min(1).max(80),
  date: z.coerce.date(),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

// --- Accounting ---

export const financialYearSchema = z.object({
  yearCode: z.string().trim().min(1).max(20),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isActive: z.coerce.boolean().optional(),
  factoryCode: z.string().trim().max(50).optional().or(z.literal("")),
});
export const financialYearUpdateSchema = financialYearSchema.partial();

export const lookupItemSchema = z.object({
  code: z.coerce.number(),
  name: z.string().trim().min(1).max(200),
  parentCode: z.coerce.number().optional(),
  meta: z.any().optional(),
});
export const lookupItemUpdateSchema = lookupItemSchema.partial();

export const ledgerSchema = z.object({
  code: z.coerce.number(),
  name: z.string().trim().min(1).max(200),
  groupCode: z.coerce.number().optional(),
  subGroupCode: z.coerce.number().optional(),
  subSubGroupCode: z.coerce.number().optional(),
  divisionCode: z.coerce.number().optional(),
  partyTypeCode: z.coerce.number().optional(),
  interestLedgerCode: z.coerce.number().optional(),
  interestRate: z.coerce.number().optional(),
  isProfitLoss: z.coerce.boolean().optional(),
  oldCode: z.string().trim().max(50).optional().or(z.literal("")),
});
export const ledgerUpdateSchema = ledgerSchema.partial();

export const partySchema = z.object({
  code: z.coerce.number(),
  name: z.string().trim().min(1).max(200),
  typeCode: z.coerce.number().optional(),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  oldCode: z.string().trim().max(50).optional().or(z.literal("")),
  hasMultipleActivity: z.coerce.boolean().optional(),
});
export const partyUpdateSchema = partySchema.partial();

export const bankSchema = z.object({
  code: z.coerce.number(),
  name: z.string().trim().min(1).max(200),
  shortName: z.string().trim().max(50).optional().or(z.literal("")),
  bankTypeCode: z.coerce.number().optional(),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  email: z.string().trim().max(120).optional().or(z.literal("")),
  factoryCode: z.string().trim().max(50).optional().or(z.literal("")),
});
export const bankUpdateSchema = bankSchema.partial();

export const openingBalanceSchema = z.object({
  yearCode: z.string().trim().min(1).max(20),
  scope: z.enum(["ledger", "party"]),
  ledgerCode: z.coerce.number().optional(),
  partyCode: z.coerce.number().optional(),
  amount: z.coerce.number(),
});
export const openingBalanceUpdateSchema = openingBalanceSchema.partial();

const voucherLineSchema = z.object({
  ledgerCode: z.coerce.number(),
  partyCode: z.coerce.number().optional(),
  debit: z.coerce.number().min(0).default(0),
  credit: z.coerce.number().min(0).default(0),
  remark: z.string().trim().max(300).optional().or(z.literal("")),
});

const voucherChequeDdSchema = z.object({
  typeCode: z.coerce.number().optional(),
  number: z.string().trim().max(50).optional().or(z.literal("")),
  date: z.coerce.date().optional(),
  draweeBankCode: z.coerce.number().optional(),
  amount: z.coerce.number().optional(),
  clearDate: z.coerce.date().optional(),
});

export const voucherSchema = z
  .object({
    yearCode: z.string().trim().min(1).max(20),
    voucherNumber: z.coerce.number(),
    voucherTypeCode: z.coerce.number(),
    date: z.coerce.date(),
    narration: z.string().trim().max(300).optional().or(z.literal("")),
    fromTo: z.string().trim().max(200).optional().or(z.literal("")),
    bankCode: z.coerce.number().optional(),
    status: z.coerce.number().optional(),
    preparedBy: z.string().trim().max(100).optional().or(z.literal("")),
    passedBy: z.string().trim().max(100).optional().or(z.literal("")),
    cashierUser: z.string().trim().max(100).optional().or(z.literal("")),
    lines: z.array(voucherLineSchema).min(1, "Add at least one line"),
    chequeDdDetails: z.array(voucherChequeDdSchema).optional(),
  })
  .refine(
    (v) => {
      const debit = v.lines.reduce((sum, l) => sum + (l.debit || 0), 0);
      const credit = v.lines.reduce((sum, l) => sum + (l.credit || 0), 0);
      return Math.abs(debit - credit) < 0.01;
    },
    { message: "Total debit must equal total credit", path: ["lines"] }
  );

export const voucherUpdateSchema = z.object({
  yearCode: z.string().trim().min(1).max(20).optional(),
  voucherNumber: z.coerce.number().optional(),
  voucherTypeCode: z.coerce.number().optional(),
  date: z.coerce.date().optional(),
  narration: z.string().trim().max(300).optional().or(z.literal("")),
  fromTo: z.string().trim().max(200).optional().or(z.literal("")),
  bankCode: z.coerce.number().optional(),
  status: z.coerce.number().optional(),
  preparedBy: z.string().trim().max(100).optional().or(z.literal("")),
  passedBy: z.string().trim().max(100).optional().or(z.literal("")),
  cashierUser: z.string().trim().max(100).optional().or(z.literal("")),
  lines: z.array(voucherLineSchema).optional(),
  chequeDdDetails: z.array(voucherChequeDdSchema).optional(),
});

// --- Website content (admin-managed public site) ---

const optionalText = (max) =>
  z.string().trim().max(max).optional().or(z.literal(""));

const slugField = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only")
  .max(120);

export const settingsSchema = z.object({
  name: optionalText(200),
  shortName: optionalText(100),
  tagline: optionalText(300),
  founded: z.coerce.number().int().min(1800).max(2200).optional(),
  url: optionalText(300),
  registration: z
    .object({
      act: optionalText(200),
      number: optionalText(100),
      pan: optionalText(20),
      incorporated: optionalText(100),
    })
    .partial()
    .optional(),
  location: z
    .object({
      city: optionalText(100),
      taluka: optionalText(100),
      district: optionalText(100),
      state: optionalText(100),
      line: optionalText(300),
    })
    .partial()
    .optional(),
  contact: z
    .object({
      phones: z.array(z.string().trim().max(40)).max(6).optional(),
      phonesRaw: z.array(z.string().trim().max(40)).max(6).optional(),
      email: z.string().trim().email().optional().or(z.literal("")),
    })
    .partial()
    .optional(),
  bankDetails: z
    .object({
      name: optionalText(200),
      bankName: optionalText(200),
      branch: optionalText(200),
      accountNo: optionalText(50),
      ifsc: optionalText(20),
      city: optionalText(100),
      state: optionalText(100),
      pan: optionalText(20),
    })
    .partial()
    .optional(),
  seo: z
    .object({
      description: optionalText(400),
      ogDescription: optionalText(400),
    })
    .partial()
    .optional(),
  donation: z
    .object({
      presetAmounts: z.array(z.coerce.number().positive()).max(8).optional(),
      minAmount: z.coerce.number().positive().optional(),
      maxAmount: z.coerce.number().positive().optional(),
    })
    .partial()
    .optional(),
  logoHeaderUrl: optionalText(500),
  logoFooterUrl: optionalText(500),
});

const programSectionSchema = z.object({
  heading: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(8000),
});

export const programSchema = z.object({
  slug: slugField.optional().or(z.literal("")),
  title: z.string().trim().min(1).max(200),
  short: optionalText(500),
  icon: optionalText(50),
  statValue: optionalText(40),
  statLabel: optionalText(200),
  image: optionalText(500),
  imageAlt: optionalText(300),
  sections: z.array(programSectionSchema).max(30).optional(),
  order: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const programUpdateSchema = programSchema.partial();

const legalSectionSchema = z.object({
  heading: z.string().trim().min(1).max(200),
  text: z.string().trim().min(1).max(8000),
});

export const legalPageSchema = z.object({
  slug: slugField.optional().or(z.literal("")),
  title: z.string().trim().min(1).max(200),
  updated: optionalText(60),
  sections: z.array(legalSectionSchema).max(30).optional(),
  order: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const legalPageUpdateSchema = legalPageSchema.partial();

export const contentItemSchema = z.object({
  group: optionalText(120),
  label: optionalText(200),
  title: optionalText(300),
  body: optionalText(8000),
  icon: optionalText(50),
  image: optionalText(500),
  imageAlt: optionalText(300),
  href: optionalText(300),
  flag: z.coerce.boolean().optional(),
  order: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const contentItemUpdateSchema = contentItemSchema.partial();

const pageBlockSchema = z.object({
  key: z.string().trim().min(1).max(60),
  eyebrow: optionalText(200),
  title: optionalText(500),
  description: optionalText(2000),
  body: optionalText(8000),
  image: optionalText(500),
  imageAlt: optionalText(300),
  primaryLabel: optionalText(80),
  primaryHref: optionalText(300),
  secondaryLabel: optionalText(80),
  secondaryHref: optionalText(300),
});

export const pageContentSchema = z.object({
  blocks: z.array(pageBlockSchema).max(40),
});

export const founderSchema = z.object({
  name: optionalText(200),
  role: optionalText(200),
  initials: optionalText(6),
  photoUrl: optionalText(500),
  bio: optionalText(8000),
  note: optionalText(2000),
});

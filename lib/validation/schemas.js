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

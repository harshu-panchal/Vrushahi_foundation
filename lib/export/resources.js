import { dbConnect } from "@/lib/db/connect";
import Donor from "@/lib/models/Donor";
import VolunteerSignup from "@/lib/models/VolunteerSignup";
import ContactMessage from "@/lib/models/ContactMessage";
import FinancialYear from "@/lib/models/FinancialYear";
import LookupItem, { LOOKUP_CATEGORIES } from "@/lib/models/LookupItem";
import Ledger from "@/lib/models/Ledger";
import Party from "@/lib/models/Party";
import Bank from "@/lib/models/Bank";
import Voucher from "@/lib/models/Voucher";
import OpeningBalance from "@/lib/models/OpeningBalance";

const isoDate = (v) => (v ? new Date(v).toISOString().slice(0, 10) : "");

/**
 * One entry per exportable admin table: how to fetch its rows (honoring
 * the same filters the list page uses) and how to map them to spreadsheet
 * columns. Consumed by the single generic export route below — keeping
 * this in one registry avoids ~10 near-identical export route files.
 */
export const EXPORT_RESOURCES = {
  donors: {
    filename: () => "donors.xlsx",
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "city", label: "City" },
      { key: "totalDonated", label: "Total Donated" },
      { key: "donationCount", label: "Donation Count" },
      { key: "firstDonationAt", label: "First Donation" },
      { key: "lastDonationAt", label: "Last Donation" },
      { key: "notes", label: "Notes" },
    ],
    async fetch(searchParams) {
      await dbConnect();
      const q = searchParams.get("q")?.trim();
      const filter = q
        ? {
            $or: [
              { name: { $regex: q, $options: "i" } },
              { email: { $regex: q, $options: "i" } },
              { phone: { $regex: q, $options: "i" } },
            ],
          }
        : {};
      const docs = await Donor.find(filter)
        .sort({ lastDonationAt: -1, createdAt: -1 })
        .lean();
      return docs.map((d) => ({
        name: d.name,
        email: d.email ?? "",
        phone: d.phone ?? "",
        city: d.city ?? "",
        totalDonated: d.totalDonated,
        donationCount: d.donationCount,
        firstDonationAt: isoDate(d.firstDonationAt),
        lastDonationAt: isoDate(d.lastDonationAt),
        notes: d.notes ?? "",
      }));
    },
  },

  volunteers: {
    filename: () => "volunteer-signups.xlsx",
    columns: [
      { key: "createdAt", label: "Received" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "location", label: "Location" },
      { key: "interest", label: "Interest" },
      { key: "status", label: "Status" },
      { key: "message", label: "Message" },
    ],
    async fetch(searchParams) {
      await dbConnect();
      const status = searchParams.get("status");
      const filter = status ? { status } : {};
      const docs = await VolunteerSignup.find(filter).sort({ createdAt: -1 }).lean();
      return docs.map((s) => ({
        createdAt: isoDate(s.createdAt),
        name: s.name,
        email: s.email ?? "",
        phone: s.phone ?? "",
        location: s.location ?? "",
        interest: s.interest ?? "",
        status: s.status,
        message: s.message ?? "",
      }));
    },
  },

  messages: {
    filename: () => "contact-messages.xlsx",
    columns: [
      { key: "createdAt", label: "Received" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "status", label: "Status" },
      { key: "message", label: "Message" },
    ],
    async fetch(searchParams) {
      await dbConnect();
      const status = searchParams.get("status");
      const filter = status ? { status } : {};
      const docs = await ContactMessage.find(filter).sort({ createdAt: -1 }).lean();
      return docs.map((m) => ({
        createdAt: isoDate(m.createdAt),
        name: m.name,
        email: m.email ?? "",
        phone: m.phone ?? "",
        status: m.status,
        message: m.message,
      }));
    },
  },

  vouchers: {
    filename: () => "vouchers.xlsx",
    columns: [
      { key: "yearCode", label: "Year" },
      { key: "voucherNumber", label: "Voucher #" },
      { key: "voucherTypeCode", label: "Type Code" },
      { key: "date", label: "Date" },
      { key: "narration", label: "Narration" },
      { key: "fromTo", label: "From / To" },
      { key: "bankCode", label: "Bank Code" },
      { key: "preparedBy", label: "Prepared By" },
      { key: "passedBy", label: "Passed By" },
      { key: "totalDebit", label: "Total Debit" },
      { key: "totalCredit", label: "Total Credit" },
    ],
    async fetch(searchParams) {
      await dbConnect();
      const yearCode = searchParams.get("yearCode");
      const from = searchParams.get("from");
      const to = searchParams.get("to");
      const filter = {};
      if (yearCode) filter.yearCode = yearCode;
      if (from || to) {
        filter.date = {};
        if (from) filter.date.$gte = new Date(from);
        if (to) filter.date.$lte = new Date(to);
      }
      const docs = await Voucher.find(filter).sort({ date: -1 }).lean();
      return docs.map((v) => ({
        yearCode: v.yearCode,
        voucherNumber: v.voucherNumber,
        voucherTypeCode: v.voucherTypeCode,
        date: isoDate(v.date),
        narration: v.narration ?? "",
        fromTo: v.fromTo ?? "",
        bankCode: v.bankCode ?? "",
        preparedBy: v.preparedBy ?? "",
        passedBy: v.passedBy ?? "",
        totalDebit: v.lines?.reduce((s, l) => s + (l.debit || 0), 0) ?? 0,
        totalCredit: v.lines?.reduce((s, l) => s + (l.credit || 0), 0) ?? 0,
      }));
    },
  },

  ledgers: {
    filename: () => "chart-of-accounts.xlsx",
    columns: [
      { key: "code", label: "Code" },
      { key: "name", label: "Ledger Name" },
      { key: "groupCode", label: "Group Code" },
      { key: "subGroupCode", label: "Sub-Group Code" },
      { key: "subSubGroupCode", label: "Sub-Sub-Group Code" },
      { key: "divisionCode", label: "Division Code" },
      { key: "partyTypeCode", label: "Party Type Code" },
      { key: "interestRate", label: "Interest Rate" },
      { key: "isProfitLoss", label: "P&L Account" },
      { key: "oldCode", label: "Old Code" },
    ],
    async fetch() {
      await dbConnect();
      const docs = await Ledger.find({}).sort({ code: 1 }).lean();
      return docs.map((l) => ({ ...l, isProfitLoss: l.isProfitLoss ? "Yes" : "No" }));
    },
  },

  parties: {
    filename: () => "parties.xlsx",
    columns: [
      { key: "code", label: "Code" },
      { key: "name", label: "Name" },
      { key: "typeCode", label: "Type Code" },
      { key: "address", label: "Address" },
      { key: "oldCode", label: "Old Code" },
      { key: "hasMultipleActivity", label: "Multiple Activity" },
    ],
    async fetch() {
      await dbConnect();
      const docs = await Party.find({}).sort({ code: 1 }).lean();
      return docs.map((p) => ({
        ...p,
        hasMultipleActivity: p.hasMultipleActivity ? "Yes" : "No",
      }));
    },
  },

  banks: {
    filename: () => "banks.xlsx",
    columns: [
      { key: "code", label: "Code" },
      { key: "name", label: "Bank Name" },
      { key: "shortName", label: "Short Name" },
      { key: "address", label: "Address" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
    ],
    async fetch() {
      await dbConnect();
      return Bank.find({}).sort({ code: 1 }).lean();
    },
  },

  "opening-balances": {
    filename: () => "opening-balances.xlsx",
    columns: [
      { key: "yearCode", label: "Year" },
      { key: "scope", label: "Scope" },
      { key: "ledgerCode", label: "Ledger Code" },
      { key: "partyCode", label: "Party Code" },
      { key: "amount", label: "Amount" },
    ],
    async fetch() {
      await dbConnect();
      return OpeningBalance.find({}).sort({ yearCode: -1 }).lean();
    },
  },

  "financial-years": {
    filename: () => "financial-years.xlsx",
    columns: [
      { key: "yearCode", label: "Year" },
      { key: "startDate", label: "Start Date" },
      { key: "endDate", label: "End Date" },
      { key: "isActive", label: "Active" },
      { key: "factoryCode", label: "Factory Code" },
    ],
    async fetch() {
      await dbConnect();
      const docs = await FinancialYear.find({}).sort({ startDate: -1 }).lean();
      return docs.map((y) => ({
        yearCode: y.yearCode,
        startDate: isoDate(y.startDate),
        endDate: isoDate(y.endDate),
        isActive: y.isActive ? "Yes" : "No",
        factoryCode: y.factoryCode ?? "",
      }));
    },
  },

  lookups: {
    filename: (searchParams) => `lookup-${searchParams.get("category") || "all"}.xlsx`,
    columns: [
      { key: "category", label: "Category" },
      { key: "code", label: "Code" },
      { key: "name", label: "Name" },
      { key: "parentCode", label: "Parent Code" },
    ],
    async fetch(searchParams) {
      await dbConnect();
      const category = searchParams.get("category");
      const filter = category && LOOKUP_CATEGORIES.includes(category) ? { category } : {};
      return LookupItem.find(filter).sort({ category: 1, code: 1 }).lean();
    },
  },
};

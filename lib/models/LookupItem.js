import mongoose from "mongoose";

// Generic {code, name} reference table — backs the ~13 small chart-of-accounts
// and voucher lookup tables from the legacy schema (group types, divisions,
// cost centers, voucher/cheque types, party types, etc). `category` selects
// which lookup a row belongs to; `parentCode` links hierarchical ones
// (account sub-group -> group, sub-sub-group -> sub-group).
export const LOOKUP_CATEGORIES = [
  "accountGroupType", // Balance Sheet / Profit & Loss
  "accountALIE", // Assets / Liabilities / Income / Expenditure
  "accountGroup",
  "accountSubGroup", // parentCode -> accountGroup
  "accountSubSubGroup", // parentCode -> accountSubGroup
  "scheduleGroupType",
  "division",
  "costCenter",
  "course",
  "farmType",
  "fixedAssetType",
  "voucherType",
  "subVoucherType",
  "chequeDdType",
  "draweeBank",
  "partyType", // IND type: farmer, trader, supplier, etc.
  "partyTypeResource", // local / foreign
];

const LookupItemSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, enum: LOOKUP_CATEGORIES, index: true },
    code: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    parentCode: { type: Number },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

LookupItemSchema.index({ category: 1, code: 1 }, { unique: true });

export default mongoose.models.LookupItem ||
  mongoose.model("LookupItem", LookupItemSchema);

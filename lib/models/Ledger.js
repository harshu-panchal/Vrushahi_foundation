import mongoose from "mongoose";

// Chart-of-accounts entry (legacy tbl_AC_ML) — the account code that
// vouchers, opening balances, and party ledgers all post against.
const LedgerSchema = new mongoose.Schema(
  {
    code: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    groupCode: { type: Number },
    subGroupCode: { type: Number },
    subSubGroupCode: { type: Number },
    divisionCode: { type: Number },
    partyTypeCode: { type: Number }, // set when this ledger is a party control account
    interestLedgerCode: { type: Number },
    interestRate: { type: Number },
    isProfitLoss: { type: Boolean, default: false },
    oldCode: { type: String, trim: true },
  },
  { timestamps: true }
);

LedgerSchema.index({ name: "text" });

export default mongoose.models.Ledger || mongoose.model("Ledger", LedgerSchema);

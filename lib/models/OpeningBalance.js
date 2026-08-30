import mongoose from "mongoose";

// Seeds ledger/party balances carried over from the legacy system so
// historical continuity isn't lost when new vouchers start posting here.
const OpeningBalanceSchema = new mongoose.Schema(
  {
    yearCode: { type: String, required: true, trim: true },
    scope: { type: String, enum: ["ledger", "party"], required: true },
    ledgerCode: { type: Number },
    partyCode: { type: Number },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

OpeningBalanceSchema.index({ yearCode: 1, scope: 1, ledgerCode: 1, partyCode: 1 });

export default mongoose.models.OpeningBalance ||
  mongoose.model("OpeningBalance", OpeningBalanceSchema);

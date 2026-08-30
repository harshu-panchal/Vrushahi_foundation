import mongoose from "mongoose";

// Individual/party sub-ledger (legacy tbl_AC_IND_others) — farmers, traders,
// suppliers, transporters etc. that vouchers can post to via partyCode.
const PartySchema = new mongoose.Schema(
  {
    code: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    typeCode: { type: Number }, // LookupItem category "partyType"
    address: { type: String, trim: true },
    oldCode: { type: String, trim: true },
    hasMultipleActivity: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PartySchema.index({ name: "text" });

export default mongoose.models.Party || mongoose.model("Party", PartySchema);

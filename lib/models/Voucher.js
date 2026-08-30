import mongoose from "mongoose";

const VoucherLineSchema = new mongoose.Schema(
  {
    ledgerCode: { type: Number, required: true },
    partyCode: { type: Number },
    debit: { type: Number, default: 0, min: 0 },
    credit: { type: Number, default: 0, min: 0 },
    remark: { type: String, trim: true },
  },
  { _id: false }
);

const VoucherChequeDdSchema = new mongoose.Schema(
  {
    typeCode: { type: Number }, // LookupItem category "chequeDdType"
    number: { type: String, trim: true },
    date: { type: Date },
    draweeBankCode: { type: Number },
    amount: { type: Number },
    clearDate: { type: Date },
  },
  { _id: false }
);

const VoucherSchema = new mongoose.Schema(
  {
    yearCode: { type: String, required: true, trim: true },
    voucherNumber: { type: Number, required: true },
    voucherTypeCode: { type: Number, required: true }, // LookupItem category "voucherType"
    date: { type: Date, required: true },
    narration: { type: String, trim: true },
    fromTo: { type: String, trim: true },
    bankCode: { type: Number },
    status: { type: Number, default: 1 },
    preparedBy: { type: String, trim: true },
    passedBy: { type: String, trim: true },
    cashierUser: { type: String, trim: true },
    lines: { type: [VoucherLineSchema], default: [] },
    chequeDdDetails: { type: [VoucherChequeDdSchema], default: [] },
  },
  { timestamps: true }
);

VoucherSchema.index({ yearCode: 1, voucherNumber: 1 }, { unique: true });
VoucherSchema.index({ date: -1 });

export default mongoose.models.Voucher || mongoose.model("Voucher", VoucherSchema);

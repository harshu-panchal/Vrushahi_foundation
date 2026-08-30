import mongoose from "mongoose";

const BankSchema = new mongoose.Schema(
  {
    code: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    shortName: { type: String, trim: true },
    bankTypeCode: { type: Number },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    factoryCode: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.Bank || mongoose.model("Bank", BankSchema);

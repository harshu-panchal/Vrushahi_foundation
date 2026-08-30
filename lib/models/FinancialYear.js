import mongoose from "mongoose";

const FinancialYearSchema = new mongoose.Schema(
  {
    yearCode: { type: String, required: true, trim: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: false },
    factoryCode: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.FinancialYear ||
  mongoose.model("FinancialYear", FinancialYearSchema);

import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: "INR" },
    mode: {
      type: String,
      enum: ["cash", "bank_transfer", "upi", "cheque", "other"],
      default: "cash",
    },
    program: { type: String, trim: true, default: "general" },
    date: { type: Date, required: true, default: Date.now },
    referenceNote: { type: String, trim: true },
  },
  { timestamps: true }
);

DonationSchema.index({ date: -1 });
DonationSchema.index({ donor: 1, date: -1 });

export default mongoose.models.Donation ||
  mongoose.model("Donation", DonationSchema);

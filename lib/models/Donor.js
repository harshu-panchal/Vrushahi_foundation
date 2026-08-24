import mongoose from "mongoose";

const DonorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: undefined,
    },
    phone: { type: String, trim: true },
    city: { type: String, trim: true },
    notes: { type: String, trim: true },
    totalDonated: { type: Number, default: 0 },
    donationCount: { type: Number, default: 0 },
    firstDonationAt: { type: Date },
    lastDonationAt: { type: Date },
  },
  { timestamps: true }
);

DonorSchema.index({ email: 1 }, { unique: true, sparse: true });
DonorSchema.index({ phone: 1 });
DonorSchema.index({ name: "text" });

export default mongoose.models.Donor || mongoose.model("Donor", DonorSchema);

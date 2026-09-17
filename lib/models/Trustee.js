import mongoose from "mongoose";

const TrusteeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    designation: { type: String, required: true, trim: true },
    photoUrl: { type: String, trim: true },
    bio: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

TrusteeSchema.index({ slug: 1 }, { unique: true });
TrusteeSchema.index({ order: 1, name: 1 });

export default mongoose.models.Trustee || mongoose.model("Trustee", TrusteeSchema);

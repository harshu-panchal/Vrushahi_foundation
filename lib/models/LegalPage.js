import mongoose from "mongoose";

// Backs /legal/[slug] and the footer's legal link row — replaces
// `data/legal.js`.
const LegalSectionSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const LegalPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    // Free text ("2026", "March 2026") rather than a date, matching how the
    // page renders it: "Updated {updated}".
    updated: { type: String, trim: true },
    sections: { type: [LegalSectionSchema], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

LegalPageSchema.index({ slug: 1 }, { unique: true });
LegalPageSchema.index({ order: 1, title: 1 });

export default mongoose.models.LegalPage || mongoose.model("LegalPage", LegalPageSchema);

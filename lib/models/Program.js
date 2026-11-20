import mongoose from "mongoose";

// Backs /programs, /programs/[slug], the home page programme grid, the
// footer programme list, the donation form's cause dropdown and the
// programme labels on receipts — everything that used to read
// `data/programs.js`.
const ProgramSectionSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ProgramSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    short: { type: String, trim: true },
    icon: { type: String, trim: true },
    statValue: { type: String, trim: true },
    statLabel: { type: String, trim: true },
    image: { type: String, trim: true },
    imageAlt: { type: String, trim: true },
    sections: { type: [ProgramSectionSchema], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProgramSchema.index({ slug: 1 }, { unique: true });
ProgramSchema.index({ order: 1, title: 1 });

export default mongoose.models.Program || mongoose.model("Program", ProgramSchema);

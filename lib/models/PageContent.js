import mongoose from "mongoose";

/**
 * Per-page editable copy: hero text, section headings, and the CTA band
 * overrides that were written inline in each page file.
 *
 * Each page holds a list of named blocks. Page components look a block up
 * by key and fall back to a default defined in `lib/content/defaults.js`,
 * so a missing or blanked block degrades to the original wording rather
 * than rendering an empty heading.
 */
export const CONTENT_PAGES = [
  "home",
  "about",
  "founder",
  "programs",
  "trustees",
  "events",
  "gallery",
  "stories",
  "donors",
  "volunteer",
  "donate",
  "contact",
];

const PageBlockSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    eyebrow: { type: String, trim: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    body: { type: String, trim: true },
    image: { type: String, trim: true },
    imageAlt: { type: String, trim: true },
    // Button labels/targets — used by hero CTAs and the CtaBand overrides
    // each page passes today.
    primaryLabel: { type: String, trim: true },
    primaryHref: { type: String, trim: true },
    secondaryLabel: { type: String, trim: true },
    secondaryHref: { type: String, trim: true },
  },
  { _id: false }
);

const PageContentSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, enum: CONTENT_PAGES, unique: true },
    blocks: { type: [PageBlockSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.PageContent ||
  mongoose.model("PageContent", PageContentSchema);

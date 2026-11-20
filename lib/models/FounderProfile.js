import mongoose from "mongoose";

// Single-document store for /about/founder. Replaces the hardcoded (and,
// per the old page's own code comment, unverified) founder details.
export const FOUNDER_KEY = "founder";

const FounderProfileSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: FOUNDER_KEY },
    name: { type: String, trim: true },
    role: { type: String, trim: true },
    // Shown in the avatar circle when there is no photo; derived from the
    // name at seed time but editable (initials don't always follow spelling).
    initials: { type: String, trim: true },
    photoUrl: { type: String, trim: true },
    // Paragraphs separated by a blank line, same convention as Trustee.bio.
    bio: { type: String, trim: true },
    // Optional dashed note block; blank hides it entirely.
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.FounderProfile ||
  mongoose.model("FounderProfile", FounderProfileSchema);

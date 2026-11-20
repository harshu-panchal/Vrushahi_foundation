import mongoose from "mongoose";

// Single-document store for organisation-wide values that used to live in
// `data/site.js` — identity, registration, contact, bank details, SEO copy
// and the donation form's presets. Always read/written through the fixed
// `key: "site"` document so there is exactly one row to edit.
export const SETTING_KEY = "site";

const SettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: SETTING_KEY },

    name: { type: String, trim: true },
    shortName: { type: String, trim: true },
    tagline: { type: String, trim: true },
    founded: { type: Number },
    url: { type: String, trim: true },

    registration: {
      act: { type: String, trim: true },
      number: { type: String, trim: true },
      pan: { type: String, trim: true },
      incorporated: { type: String, trim: true },
    },

    location: {
      city: { type: String, trim: true },
      taluka: { type: String, trim: true },
      district: { type: String, trim: true },
      state: { type: String, trim: true },
      line: { type: String, trim: true },
    },

    contact: {
      // `phones` are display strings; `phonesRaw` are the tel: targets, kept
      // as a parallel array because the display format carries spaces.
      phones: [{ type: String, trim: true }],
      phonesRaw: [{ type: String, trim: true }],
      email: { type: String, trim: true, lowercase: true },
    },

    bankDetails: {
      name: { type: String, trim: true },
      bankName: { type: String, trim: true },
      branch: { type: String, trim: true },
      accountNo: { type: String, trim: true },
      ifsc: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pan: { type: String, trim: true },
    },

    seo: {
      description: { type: String, trim: true },
      ogDescription: { type: String, trim: true },
    },

    donation: {
      presetAmounts: [{ type: Number }],
      minAmount: { type: Number },
      maxAmount: { type: Number },
    },

    logoHeaderUrl: { type: String, trim: true },
    logoFooterUrl: { type: String, trim: true },
  },
  { timestamps: true, minimize: false }
);

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);

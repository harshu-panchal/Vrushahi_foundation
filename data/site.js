/**
 * SEED + FALLBACK ONLY — not the editable source of truth.
 *
 * These values now live in MongoDB as the `Setting` singleton and are edited
 * at /admin/settings. `scripts/seed-content.mjs` upserts this object, and
 * `lib/content/read.js` falls back to it if that document is missing, so the
 * site never renders without an organisation name or contact details.
 *
 * Editing this file does nothing on a seeded site. Use the admin panel.
 */
export const site = {
  name: "Vrushahi Foundation",
  shortName: "Vrushahi",
  tagline: "A life not lived for others is not a life.",
  founded: 2017,
  registration: {
    act: "Societies Registration Act, 1860",
    number: "Maharashtra/349/2017",
    pan: "AACAV9986H",
    incorporated: "11 August 2017",
  },
  location: {
    city: "Sangli",
    taluka: "Miraj",
    district: "Sangli",
    state: "Maharashtra",
    line: "Sangli, Taluka Miraj, District Sangli, Maharashtra",
  },
  contact: {
    phones: ["+91 70580 30495", "+91 87939 15336"],
    phonesRaw: ["+919970907005", "+919970377005"],
    email: "info@vrushahifoundation.org",
  },
  bankDetails: {
    name: "Vrushahi Foundation",
    bankName: "ICICI Bank",
    branch: "Sangli Main Branch",
    accountNo: "653301053722",
    ifsc: "ICIC0006533",
    city: "Sangli",
    state: "Maharashtra",
    pan: "AACAV9986H",
  },
  url: "https://www.vrushahifoundation.org",

  seo: {
    description:
      "Vrushahi Foundation is a Sangli-based NGO working in education, medical support, elder care, orphan care, women's empowerment and disaster relief across Maharashtra.",
    ogDescription: "A life not lived for others is not a life.",
  },

  donation: {
    presetAmounts: [500, 1000, 2500, 5000],
    minAmount: 10,
    maxAmount: 10000000,
  },

  logoHeaderUrl: "/images/logo1.png",
  logoFooterUrl: "/images/logo2.png",
};

// `impactStats` moved to data/content.js (seeded as ContentItem category
// "impactStat") so the stat tiles can be added to and reordered in the
// admin panel like every other list on the site.

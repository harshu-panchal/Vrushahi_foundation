import { pageContentSeed } from "@/data/pageContent";

/**
 * Describes the page-copy editor at /admin/pages: which pages exist, which
 * blocks each one has, and which fields are worth showing per block.
 *
 * Imports nothing from lib/models on purpose: the field labels here are used
 * by the client-side form too, and importing a Mongoose model from a client
 * component pulls the whole MongoDB driver into the browser bundle. Pages
 * that need the list of page names import CONTENT_PAGES from the model
 * directly, in server code.
 *
 * Field lists are derived from the seed in `data/pageContent.js` — a block's
 * editable fields are the ones it actually ships copy for — with CTA blocks
 * special-cased because their seed entry is often empty (they inherit the
 * shared default wording until someone overrides it).
 */

export const PAGE_LABELS = {
  home: "Home",
  about: "About · Our Story",
  founder: "About · Founder",
  programs: "Programmes",
  trustees: "About · Trustees",
  events: "Events",
  gallery: "Gallery",
  stories: "Stories",
  donors: "Donors",
  volunteer: "Volunteer",
  donate: "Donate",
  contact: "Contact",
};

export const PAGE_PATHS = {
  home: "/",
  about: "/about",
  founder: "/about/founder",
  programs: "/programs",
  trustees: "/about/trustees",
  events: "/events",
  gallery: "/gallery",
  stories: "/stories",
  donors: "/donors",
  volunteer: "/volunteer",
  donate: "/donate",
  contact: "/contact",
};

const BLOCK_LABELS = {
  hero: "Page hero",
  heroCard: "Hero · floating stat card",
  heroBadge: "Hero · circular badge text",
  heroImage: "Hero image",
  whoWeAre: "“Who we are” section heading",
  programs: "Programmes section heading",
  galleryStrip: "Photo strip heading",
  eventsTeaser: "Events teaser section",
  intro: "Introduction section",
  vision: "Vision box",
  mission: "Mission section heading",
  objectives: "Objectives section heading",
  milestones: "Milestones section heading",
  empty: "Empty-state message",
  detailOthers: "“Other programmes” heading",
  detailCta: "Programme page call-to-action",
  stats: "Stats section heading",
  testimonials: "Testimonials section",
  form: "Form heading",
  ways: "“Ways to give” heading",
  online: "Online giving section",
  bank: "Bank transfer section",
  contactBand: "Green contact band",
  legal: "“Legal basics” heading",
  byProgram: "“Where it went” heading",
  list: "Donor list heading",
  privacyNote: "Donor privacy note",
  roles: "Roles section heading",
  signup: "Sign-up section",
  cta: "Call-to-action band",
};

const BLOCK_HINTS = {
  hero: "The large heading block at the top of the page.",
  cta: "Leave fields blank to use the site-wide default wording.",
  detailCta: "“{{program}}” is replaced with the programme's name.",
  privacyNote: "The contact email is appended automatically.",
  empty: "Shown only while no trustees are marked visible.",
  heroBadge: "Text around the spinning circular seal.",
};

// Home's headline runs through AnimatedHeadline, which italicises whatever
// is wrapped in *asterisks*.
const EMPHASIS_HINT =
  "Wrap a word in *asterisks* to render it italic and highlighted.";

const CTA_FIELDS = [
  "title",
  "description",
  "primaryLabel",
  "primaryHref",
  "secondaryLabel",
  "secondaryHref",
];

export const FIELD_LABELS = {
  eyebrow: "Eyebrow",
  title: "Title",
  description: "Description",
  body: "Body text",
  image: "Image",
  imageAlt: "Image alt text",
  primaryLabel: "Primary button label",
  primaryHref: "Primary button link",
  secondaryLabel: "Secondary button label",
  secondaryHref: "Secondary button link",
};

export const LONG_FIELDS = new Set(["description", "body"]);

function fieldsFor(page, block) {
  if (block.key === "cta" || block.key.endsWith("Cta")) return CTA_FIELDS;

  const present = Object.keys(block).filter(
    (k) => k !== "key" && FIELD_LABELS[k]
  );
  if (present.length === 0) return ["eyebrow", "title", "description"];

  // The home hero also drives its two buttons.
  if (page === "home" && block.key === "hero") {
    return [...new Set([...present, ...CTA_FIELDS.slice(2)])];
  }
  return present;
}

/** Returns the editable block descriptors for one page. */
export function pageBlockMeta(page) {
  return (pageContentSeed[page] || []).map((block) => ({
    key: block.key,
    label: BLOCK_LABELS[block.key] || block.key,
    hint:
      block.key === "hero" && page === "home"
        ? `${BLOCK_HINTS.hero} ${EMPHASIS_HINT}`
        : BLOCK_HINTS[block.key] || "",
    fields: fieldsFor(page, block),
  }));
}

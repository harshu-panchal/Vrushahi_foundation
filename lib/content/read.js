import { unstable_cache } from "next/cache";
import { dbConnect } from "@/lib/db/connect";
import Setting, { SETTING_KEY } from "@/lib/models/Setting";
import Program from "@/lib/models/Program";
import LegalPage from "@/lib/models/LegalPage";
import ContentItem from "@/lib/models/ContentItem";
import PageContent from "@/lib/models/PageContent";
import FounderProfile, { FOUNDER_KEY } from "@/lib/models/FounderProfile";
import Trustee from "@/lib/models/Trustee";
import { CONTENT_TAGS } from "./tags";

import { site as siteSeed } from "@/data/site";
import { programs as programsSeed } from "@/data/programs";
import { legalPages as legalSeed } from "@/data/legal";
import { contentSeed } from "@/data/content";
import { pageContentSeed, ctaDefaults } from "@/data/pageContent";
import { founderSeed } from "@/data/founder";

/**
 * Read layer for all admin-managed website content.
 *
 * Every getter is wrapped in `unstable_cache` with no time-based expiry, so
 * a page renders from cache until an admin save invalidates the matching tag
 * (see lib/content/revalidate.js). Note `unstable_cache` is the pre-Cache
 * Components API: `use cache` would need `cacheComponents: true`, which
 * changes rendering rules for the whole app including the cookie-reading
 * admin routes, so it is intentionally not used here.
 *
 * Fallback rules:
 *   - Singletons (settings, page copy, founder): merged field-by-field over
 *     the seed, so a missing document or a blanked field still renders real
 *     copy instead of an empty heading.
 *   - Lists (programmes, legal pages, content items): the seed is used only
 *     when the collection is COMPLETELY empty, i.e. never seeded or wiped.
 *     To empty a section deliberately, hide its rows (isActive = false)
 *     rather than deleting them — deleting every row resets it to the seed.
 */

/** Mongoose lean() docs carry ObjectIds and Dates; cache entries must be plain. */
function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

/** Returns `value` unless it is blank, in which case `fallback`. */
function orElse(value, fallback) {
  return isBlank(value) ? fallback : value;
}

/** Shallow-merges a stored object over a seed object, ignoring blank fields. */
function mergeFields(stored, seed) {
  const out = { ...seed };
  if (!stored) return out;
  for (const [key, seedValue] of Object.entries(seed)) {
    const storedValue = stored[key];
    if (Array.isArray(seedValue)) {
      if (Array.isArray(storedValue) && storedValue.length > 0) {
        out[key] = storedValue;
      }
    } else if (seedValue && typeof seedValue === "object") {
      out[key] = mergeFields(storedValue, seedValue);
    } else if (!isBlank(storedValue)) {
      out[key] = storedValue;
    }
  }
  return out;
}

// --- Settings ---------------------------------------------------------------

export const getSettings = unstable_cache(
  async () => {
    await dbConnect();
    const doc = await Setting.findOne({ key: SETTING_KEY }).lean();
    return mergeFields(doc ? plain(doc) : null, siteSeed);
  },
  ["content-settings"],
  { tags: [CONTENT_TAGS.settings] }
);

// --- Programmes -------------------------------------------------------------

/** Maps a Program document to the shape the public components expect. */
function toProgram(doc) {
  return {
    slug: doc.slug,
    title: doc.title,
    short: doc.short || "",
    icon: doc.icon || "Heart",
    stat: { value: doc.statValue || "", label: doc.statLabel || "" },
    image: doc.image || "",
    imageAlt: doc.imageAlt || "",
    sections: doc.sections || [],
  };
}

export const getPrograms = unstable_cache(
  async () => {
    await dbConnect();
    const docs = await Program.find({ isActive: true })
      .sort({ order: 1, title: 1 })
      .lean();
    if (docs.length === 0) return programsSeed.map((p) => ({ ...p }));
    return plain(docs).map(toProgram);
  },
  ["content-programs"],
  { tags: [CONTENT_TAGS.programs] }
);

export async function getProgramBySlug(slug) {
  const programs = await getPrograms();
  return programs.find((p) => p.slug === slug) || null;
}

// --- Legal pages ------------------------------------------------------------

export const getLegalPages = unstable_cache(
  async () => {
    await dbConnect();
    const docs = await LegalPage.find({ isActive: true })
      .sort({ order: 1, title: 1 })
      .lean();
    if (docs.length === 0) {
      return legalSeed.map((p) => ({
        slug: p.slug,
        title: p.title,
        updated: p.updated,
        sections: p.body,
      }));
    }
    return plain(docs).map((d) => ({
      slug: d.slug,
      title: d.title,
      updated: d.updated || "",
      sections: d.sections || [],
    }));
  },
  ["content-legal"],
  { tags: [CONTENT_TAGS.legal] }
);

export async function getLegalBySlug(slug) {
  const pages = await getLegalPages();
  return pages.find((p) => p.slug === slug) || null;
}

// --- Content item lists -----------------------------------------------------

export const getContentItems = unstable_cache(
  async (category) => {
    await dbConnect();
    const total = await ContentItem.countDocuments({ category });
    if (total === 0) {
      return (contentSeed[category] || []).map((item, i) => ({
        ...item,
        order: i,
        isActive: true,
      }));
    }
    const docs = await ContentItem.find({ category, isActive: true })
      .sort({ order: 1, _id: 1 })
      .lean();
    return plain(docs);
  },
  ["content-items"],
  { tags: [CONTENT_TAGS.items] }
);

/** Gallery images grouped into their category headings, order preserved. */
export async function getGalleryCategories() {
  const items = await getContentItems("galleryImage");
  const groups = [];
  for (const item of items) {
    const title = item.group || "Gallery";
    let group = groups.find((g) => g.title === title);
    if (!group) {
      group = { title, images: [] };
      groups.push(group);
    }
    group.images.push({
      src: item.image,
      alt: item.imageAlt || "",
      tall: Boolean(item.flag),
    });
  }
  return groups.filter((g) => g.images.length > 0);
}

// --- Page copy --------------------------------------------------------------

/**
 * Returns a `block(key)` accessor for one page. Stored blocks are merged
 * field-by-field over the seed, and `block()` never returns undefined, so
 * `block("hero").title` is always safe.
 */
export const getPageBlocks = unstable_cache(
  async (page) => {
    await dbConnect();
    const doc = await PageContent.findOne({ page }).lean();
    const stored = doc ? plain(doc).blocks || [] : [];
    const seeds = pageContentSeed[page] || [];

    const merged = {};
    for (const seed of seeds) {
      const match = stored.find((b) => b.key === seed.key);
      merged[seed.key] = mergeBlock(match, seed);
    }
    // Blocks an admin added that aren't in the seed still render.
    for (const block of stored) {
      if (!merged[block.key]) merged[block.key] = mergeBlock(block, {});
    }
    return merged;
  },
  ["content-pages"],
  { tags: [CONTENT_TAGS.pages] }
);

const BLOCK_FIELDS = [
  "eyebrow",
  "title",
  "description",
  "body",
  "image",
  "imageAlt",
  "primaryLabel",
  "primaryHref",
  "secondaryLabel",
  "secondaryHref",
];

function mergeBlock(stored, seed) {
  const out = { key: seed.key || stored?.key || "" };
  for (const field of BLOCK_FIELDS) {
    out[field] = orElse(stored?.[field], seed[field] ?? "");
  }
  return out;
}

/**
 * Resolves a page's CtaBand props, falling back to the shared defaults so a
 * page that never overrode the band keeps the same wording it had in code.
 */
export function ctaProps(block) {
  return {
    title: orElse(block?.title, ctaDefaults.title),
    description: orElse(block?.description, ctaDefaults.description),
    primary: {
      href: orElse(block?.primaryHref, ctaDefaults.primaryHref),
      label: orElse(block?.primaryLabel, ctaDefaults.primaryLabel),
    },
    secondary: {
      href: orElse(block?.secondaryHref, ctaDefaults.secondaryHref),
      label: orElse(block?.secondaryLabel, ctaDefaults.secondaryLabel),
    },
  };
}

// --- Founder ----------------------------------------------------------------

export const getFounder = unstable_cache(
  async () => {
    await dbConnect();
    const doc = await FounderProfile.findOne({ key: FOUNDER_KEY }).lean();
    return mergeFields(doc ? plain(doc) : null, founderSeed);
  },
  ["content-founder"],
  { tags: [CONTENT_TAGS.founder] }
);

// --- Trustees ---------------------------------------------------------------

export const getTrustees = unstable_cache(
  async () => {
    await dbConnect();
    const docs = await Trustee.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();
    return plain(docs);
  },
  ["content-trustees"],
  { tags: [CONTENT_TAGS.trustees] }
);

export async function getTrusteeBySlug(slug) {
  const trustees = await getTrustees();
  return trustees.find((t) => t.slug === slug) || null;
}

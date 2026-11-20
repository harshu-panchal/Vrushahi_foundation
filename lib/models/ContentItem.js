import mongoose from "mongoose";

/**
 * Generic ordered-list model for the repeating card/stat/image lists that
 * were hardcoded as arrays inside the public page files. One flat schema
 * with a `category` discriminator — the same approach `LookupItem` already
 * uses for the accounting reference tables — so all of these share a single
 * admin screen and one pair of API routes instead of a dozen each.
 *
 * Only a subset of fields is meaningful per category; `CONTENT_CATEGORIES`
 * below records which, and the admin UI renders just those columns.
 */
export const CONTENT_CATEGORIES = [
  "impactStat", // label + title(value) + icon  — StatBand on /, /stories
  "homeBreakthrough", // title + body + icon    — "Who we are" cards on /
  "homeHeroSlide", // image + imageAlt          — hero carousel on /
  "homeMarquee", // label                       — scrolling word strip on /
  "homeGalleryStrip", // image + imageAlt       — "a glimpse of the work" on /
  "missionPoint", // body                       — /about
  "objective", // body                          — /about
  "timelineEntry", // label(year) + title + body — /about milestones
  "eventCard", // title + body + icon           — /events
  "volunteerRole", // title + body + icon       — /volunteer
  "donateWay", // title + body + icon           — /donate
  "galleryImage", // group + image + imageAlt + flag(tall) — /gallery
];

const ContentItemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: CONTENT_CATEGORIES,
      index: true,
    },
    // Gallery category heading; blank for every other category.
    group: { type: String, trim: true },
    // Short leading value: a stat's number ("300"), a milestone's year
    // ("2017"), or a marquee word.
    label: { type: String, trim: true },
    title: { type: String, trim: true },
    body: { type: String, trim: true },
    // Must be a key of the whitelist in components/Icon.js.
    icon: { type: String, trim: true },
    image: { type: String, trim: true },
    imageAlt: { type: String, trim: true },
    href: { type: String, trim: true },
    // Category-specific boolean — currently only the gallery's "tall" tile.
    flag: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ContentItemSchema.index({ category: 1, order: 1 });

export default mongoose.models.ContentItem ||
  mongoose.model("ContentItem", ContentItemSchema);

import Link from "next/link";
import clsx from "clsx";
import { dbConnect } from "@/lib/db/connect";
import ContentItem, { CONTENT_CATEGORIES } from "@/lib/models/ContentItem";
import EditableTable from "@/components/admin/accounting/EditableTable";

export const metadata = { title: "Website Content — Admin" };

const orderColumn = { key: "order", label: "Order", type: "number", default: 0 };
const activeColumn = {
  key: "isActive",
  label: "Visible",
  type: "checkbox",
  default: true,
};
const iconColumn = { key: "icon", label: "Icon", type: "icon" };

/**
 * Per-list metadata: the label shown on the tab, where the list appears on
 * the public site, and which columns are meaningful for it. The underlying
 * `ContentItem` schema is shared, so this table is what keeps each list's
 * editing surface limited to the fields it actually uses.
 */
const LISTS = {
  impactStat: {
    label: "Impact stats",
    where: "The green stat band on the home page and /stories.",
    columns: [
      { key: "label", label: "Number", type: "text" },
      { key: "title", label: "Caption", type: "text" },
      iconColumn,
      orderColumn,
      activeColumn,
    ],
  },
  homeBreakthrough: {
    label: "Home · Who we are cards",
    where: "The four cards beside “A team of social workers” on the home page.",
    columns: [
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
      iconColumn,
      orderColumn,
      activeColumn,
    ],
  },
  homeHeroSlide: {
    label: "Home · Hero carousel",
    where: "The rotating images in the home page hero.",
    columns: [
      { key: "image", label: "Image", type: "image" },
      { key: "imageAlt", label: "Alt text", type: "text" },
      orderColumn,
      activeColumn,
    ],
  },
  homeMarquee: {
    label: "Home · Scrolling words",
    where: "The dark scrolling strip under the home page hero.",
    columns: [
      { key: "label", label: "Word", type: "text" },
      orderColumn,
      activeColumn,
    ],
  },
  homeGalleryStrip: {
    label: "Home · Photo strip",
    where: "The “a glimpse of the work” scrolling photo strip on the home page.",
    columns: [
      { key: "image", label: "Image", type: "image" },
      { key: "imageAlt", label: "Alt text", type: "text" },
      orderColumn,
      activeColumn,
    ],
  },
  missionPoint: {
    label: "About · Mission points",
    where: "The “Our mission” list on /about.",
    columns: [
      { key: "body", label: "Point", type: "textarea" },
      orderColumn,
      activeColumn,
    ],
  },
  objective: {
    label: "About · Objectives",
    where: "The “Our objectives” list on /about.",
    columns: [
      { key: "body", label: "Objective", type: "textarea" },
      orderColumn,
      activeColumn,
    ],
  },
  timelineEntry: {
    label: "About · Milestones",
    where: "The dated timeline at the bottom of /about.",
    columns: [
      { key: "label", label: "Year", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
      orderColumn,
      activeColumn,
    ],
  },
  eventCard: {
    label: "Events · Cards",
    where: "The cards on /events.",
    columns: [
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
      iconColumn,
      orderColumn,
      activeColumn,
    ],
  },
  volunteerRole: {
    label: "Volunteer · Roles",
    where: "The role cards on /volunteer.",
    columns: [
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
      iconColumn,
      orderColumn,
      activeColumn,
    ],
  },
  donateWay: {
    label: "Donate · Ways to give",
    where: "The “Pick what fits” cards on /donate.",
    columns: [
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
      iconColumn,
      orderColumn,
      activeColumn,
    ],
  },
  galleryImage: {
    label: "Gallery · Photos",
    where:
      "/gallery. Photos are grouped under the heading typed in “Category”; matching headings share a section.",
    columns: [
      { key: "group", label: "Category", type: "text" },
      { key: "image", label: "Image", type: "image" },
      { key: "imageAlt", label: "Alt text", type: "text" },
      { key: "flag", label: "Tall tile", type: "checkbox", default: false },
      orderColumn,
      activeColumn,
    ],
  },
};

export default async function ContentAdminPage({ searchParams }) {
  const params = await searchParams;
  const category = CONTENT_CATEGORIES.includes(params.category)
    ? params.category
    : CONTENT_CATEGORIES[0];
  const list = LISTS[category];

  await dbConnect();
  const docs = await ContentItem.find({ category })
    .sort({ order: 1, _id: 1 })
    .lean();
  const items = JSON.parse(JSON.stringify(docs));

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-medium text-ink">
          Website content
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft">
          The repeating card, stat and photo lists on the public site. Lower
          “Order” numbers appear first; untick “Visible” to hide an entry
          without deleting it.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {CONTENT_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/admin/content?category=${cat}`}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-xs font-semibold",
              cat === category
                ? "border-terracotta bg-terracotta text-paper"
                : "border-line text-ink-soft hover:border-ink"
            )}
          >
            {LISTS[cat]?.label || cat}
          </Link>
        ))}
      </div>

      <p className="mt-6 text-sm text-ink-soft">{list.where}</p>

      {items.length === 0 && (
        <p className="mt-4 rounded-xl border border-marigold bg-marigold-light/40 px-4 py-3 text-sm text-ink-soft">
          This list is empty, so the site is currently showing the built-in
          defaults from the project&apos;s seed data. Add a row here to take
          over, or run the seed script to import the original content first.
        </p>
      )}

      <div className="mt-4">
        <EditableTable
          key={category}
          apiBase={`/api/admin/content/${category}`}
          columns={list.columns}
          initialItems={items}
          emptyLabel="No entries yet."
        />
      </div>
    </div>
  );
}

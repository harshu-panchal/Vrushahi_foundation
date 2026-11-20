import Link from "next/link";
import { dbConnect } from "@/lib/db/connect";
import PageContent, { CONTENT_PAGES } from "@/lib/models/PageContent";
import { PAGE_LABELS, PAGE_PATHS } from "@/lib/content/pageBlockMeta";
import Icon from "@/components/Icon";

export const metadata = { title: "Page Copy — Admin" };

export default async function PagesAdminPage() {
  await dbConnect();
  const docs = await PageContent.find({}).select("page updatedAt").lean();
  const saved = new Map(docs.map((d) => [d.page, d.updatedAt]));

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Page copy</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-soft">
        The headings, intro text and call-to-action wording on each public
        page. Anything left blank keeps the site&apos;s original wording.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {CONTENT_PAGES.map((page) => {
          const updatedAt = saved.get(page);
          return (
            <Link
              key={page}
              href={`/admin/pages/${page}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 transition-colors hover:border-terracotta/40 hover:bg-paper"
            >
              <span>
                <span className="block font-medium text-ink">
                  {PAGE_LABELS[page] || page}
                </span>
                <span className="mt-0.5 block text-xs text-ink-faint">
                  {PAGE_PATHS[page]} ·{" "}
                  {updatedAt
                    ? `edited ${new Date(updatedAt).toLocaleDateString("en-IN")}`
                    : "using original wording"}
                </span>
              </span>
              <Icon
                name="ArrowRight"
                className="size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-1"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

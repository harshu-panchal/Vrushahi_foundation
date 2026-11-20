import Link from "next/link";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db/connect";
import PageContent, { CONTENT_PAGES } from "@/lib/models/PageContent";
import {
  PAGE_LABELS,
  PAGE_PATHS,
  pageBlockMeta,
} from "@/lib/content/pageBlockMeta";
import PageContentForm from "@/components/admin/PageContentForm";

export const metadata = { title: "Edit Page Copy — Admin" };

export default async function EditPageContentPage({ params }) {
  const { page } = await params;
  if (!CONTENT_PAGES.includes(page)) notFound();

  await dbConnect();
  const doc = await PageContent.findOne({ page }).lean();
  const initial = doc ? JSON.parse(JSON.stringify(doc)) : null;
  const meta = pageBlockMeta(page);

  return (
    <div>
      <Link
        href="/admin/pages"
        className="text-xs font-semibold text-ink-soft hover:text-terracotta"
      >
        ← All pages
      </Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-medium text-ink">
          {PAGE_LABELS[page] || page}
        </h1>
        <Link
          href={PAGE_PATHS[page]}
          target="_blank"
          className="text-xs font-semibold text-terracotta underline"
        >
          View page
        </Link>
      </div>
      <div className="mt-8">
        <PageContentForm page={page} meta={meta} initial={initial} />
      </div>
    </div>
  );
}

import Link from "next/link";
import { dbConnect } from "@/lib/db/connect";
import LegalPage from "@/lib/models/LegalPage";
import DeleteButton from "@/components/admin/DeleteButton";
import Icon from "@/components/Icon";

export const metadata = { title: "Legal Pages — Admin" };

export default async function LegalAdminPage() {
  await dbConnect();
  const pages = await LegalPage.find({}).sort({ order: 1, title: 1 }).lean();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">
            Legal pages
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            Privacy policy, terms, disclaimer and refund policy — linked from
            the footer of every page.
          </p>
        </div>
        <Link
          href="/admin/legal/new"
          className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-paper hover:bg-terracotta-dark"
        >
          <Icon name="Plus" className="size-4" />
          Add Page
        </Link>
      </div>

      {pages.length === 0 && (
        <p className="mt-6 rounded-xl border border-marigold bg-marigold-light/40 px-4 py-3 text-sm text-ink-soft">
          No legal pages stored yet, so the site is showing the four built-in
          defaults. Run the seed script to import them for editing.
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Sections</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {pages.map((p) => (
              <tr key={p._id} className="hover:bg-surface/60">
                <td className="px-4 py-3 text-ink-soft">{p.order ?? 0}</td>
                <td className="px-4 py-3 font-medium text-ink">{p.title}</td>
                <td className="px-4 py-3 text-ink-soft">{p.slug}</td>
                <td className="px-4 py-3 text-ink-soft">{p.updated || "—"}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {p.sections?.length || 0}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      "rounded-full px-2 py-0.5 text-xs font-semibold " +
                      (p.isActive
                        ? "bg-forest/10 text-forest"
                        : "bg-line text-ink-faint")
                    }
                  >
                    {p.isActive ? "Published" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/legal/${p.slug}`}
                      target="_blank"
                      className="text-xs font-semibold text-ink-soft"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/legal/${p._id}`}
                      className="text-xs font-semibold text-terracotta"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      endpoint={`/api/admin/legal-pages/${p._id}`}
                      confirmText={`Delete the ${p.title} page? Its footer link will 404.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-faint">
                  No legal pages added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

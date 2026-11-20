import Link from "next/link";
import { dbConnect } from "@/lib/db/connect";
import Program from "@/lib/models/Program";
import DeleteButton from "@/components/admin/DeleteButton";
import Icon from "@/components/Icon";

export const metadata = { title: "Programmes — Admin" };

export default async function ProgramsAdminPage() {
  await dbConnect();
  const programs = await Program.find({}).sort({ order: 1, title: 1 }).lean();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">Programmes</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            Drives{" "}
            <Link href="/programs" className="underline" target="_blank">
              /programs
            </Link>
            , each programme&apos;s own page, the home page grid, the footer
            list and the cause dropdown on the donation forms.
          </p>
        </div>
        <Link
          href="/admin/programs/new"
          className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-paper hover:bg-terracotta-dark"
        >
          <Icon name="Plus" className="size-4" />
          Add Programme
        </Link>
      </div>

      {programs.length === 0 && (
        <p className="mt-6 rounded-xl border border-marigold bg-marigold-light/40 px-4 py-3 text-sm text-ink-soft">
          No programmes stored yet, so the site is showing the six built-in
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
              <th className="px-4 py-3">Sections</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {programs.map((p) => (
              <tr key={p._id} className="hover:bg-surface/60">
                <td className="px-4 py-3 text-ink-soft">{p.order ?? 0}</td>
                <td className="px-4 py-3 font-medium text-ink">
                  <span className="flex items-center gap-2">
                    <Icon name={p.icon} className="size-4 shrink-0" />
                    {p.title}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-soft">{p.slug}</td>
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
                    {p.isActive ? "Visible" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/programs/${p.slug}`}
                      target="_blank"
                      className="text-xs font-semibold text-ink-soft"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/programs/${p._id}`}
                      className="text-xs font-semibold text-terracotta"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      endpoint={`/api/admin/programs/${p._id}`}
                      confirmText={`Delete the ${p.title} programme? Past donations recorded against it keep their stored slug.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {programs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-faint">
                  No programmes added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

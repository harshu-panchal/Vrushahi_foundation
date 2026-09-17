import Link from "next/link";
import { dbConnect } from "@/lib/db/connect";
import Trustee from "@/lib/models/Trustee";
import DeleteButton from "@/components/admin/DeleteButton";
import Icon from "@/components/Icon";

export const metadata = { title: "Trustees — Admin" };

export default async function TrusteesAdminPage() {
  await dbConnect();
  const trustees = await Trustee.find({}).sort({ order: 1, name: 1 }).lean();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">Trustees</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Manages the public{" "}
            <Link href="/about/trustees" className="underline" target="_blank">
              /about/trustees
            </Link>{" "}
            page and each trustee&apos;s detail page.
          </p>
        </div>
        <Link
          href="/admin/trustees/new"
          className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-paper hover:bg-terracotta-dark"
        >
          <Icon name="Plus" className="size-4" />
          Add Trustee
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Designation</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {trustees.map((t) => (
              <tr key={t._id} className="hover:bg-surface/60">
                <td className="px-4 py-3 text-ink-soft">{t.order ?? 0}</td>
                <td className="px-4 py-3">
                  <span className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-surface text-ink-faint">
                    {t.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- admin-entered arbitrary URL, not a whitelisted remote pattern
                      <img
                        src={t.photoUrl}
                        alt={t.name}
                        className="size-10 object-cover"
                      />
                    ) : (
                      <Icon name="Users" className="size-5" />
                    )}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-ink">{t.name}</td>
                <td className="px-4 py-3 text-ink-soft">{t.designation}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      "rounded-full px-2 py-0.5 text-xs font-semibold " +
                      (t.isActive
                        ? "bg-forest/10 text-forest"
                        : "bg-line text-ink-faint")
                    }
                  >
                    {t.isActive ? "Visible" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/about/trustees/${t.slug}`}
                      target="_blank"
                      className="text-xs font-semibold text-ink-soft"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/trustees/${t._id}`}
                      className="text-xs font-semibold text-terracotta"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      endpoint={`/api/admin/trustees/${t._id}`}
                      confirmText={`Remove ${t.name} from the Trustees page?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {trustees.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-faint">
                  No trustees added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

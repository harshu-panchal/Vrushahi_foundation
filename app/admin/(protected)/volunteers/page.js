import Link from "next/link";
import { dbConnect } from "@/lib/db/connect";
import VolunteerSignup from "@/lib/models/VolunteerSignup";
import StatusSelect from "@/components/admin/StatusSelect";
import ExportLink from "@/components/admin/ExportLink";

export const metadata = { title: "Volunteers — Admin" };

const STATUSES = ["new", "contacted", "onboarded", "archived"];
const PAGE_SIZE = 25;

export default async function VolunteersPage({ searchParams }) {
  const params = await searchParams;
  const status = params.status;
  const page = Math.max(1, Number(params.page) || 1);

  await dbConnect();

  const filter = status ? { status } : {};
  const [signupsDoc, total] = await Promise.all([
    VolunteerSignup.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    VolunteerSignup.countDocuments(filter),
  ]);
  const signups = JSON.parse(JSON.stringify(signupsDoc));
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">
            Volunteer sign-ups
          </h1>
          <p className="mt-1 text-sm text-ink-soft">{total} total sign-ups</p>
        </div>
        <ExportLink resource="volunteers" query={status ? { status } : {}} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin/volunteers"
          className={
            !status
              ? "rounded-full bg-terracotta px-3 py-1.5 text-xs font-semibold text-paper"
              : "rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft"
          }
        >
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/volunteers?status=${s}`}
            className={
              status === s
                ? "rounded-full bg-terracotta px-3 py-1.5 text-xs font-semibold capitalize text-paper"
                : "rounded-full border border-line px-3 py-1.5 text-xs font-semibold capitalize text-ink-soft"
            }
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Interest</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {signups.map((s) => (
              <tr key={s._id} className="hover:bg-surface/60">
                <td className="px-4 py-3 text-ink-soft">
                  {new Date(s.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3 font-medium text-ink">{s.name}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {[s.email, s.phone].filter(Boolean).join(" · ") || "—"}
                </td>
                <td className="px-4 py-3 text-ink-soft">{s.interest || "—"}</td>
                <td className="px-4 py-3">
                  <StatusSelect
                    id={s._id}
                    endpoint="/api/admin/volunteer-signups"
                    status={s.status}
                    options={STATUSES}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/volunteers/${s._id}`}
                    className="text-xs font-semibold text-terracotta"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {signups.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-faint">
                  No sign-ups yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/volunteers?${new URLSearchParams({ ...params, page: String(p) }).toString()}`}
              className={
                p === page
                  ? "rounded-lg bg-terracotta px-3 py-1.5 font-semibold text-paper"
                  : "rounded-lg px-3 py-1.5 text-ink-soft hover:bg-surface"
              }
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

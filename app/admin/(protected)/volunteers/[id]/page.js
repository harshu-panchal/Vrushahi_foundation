import Link from "next/link";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db/connect";
import VolunteerSignup from "@/lib/models/VolunteerSignup";
import StatusSelect from "@/components/admin/StatusSelect";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Volunteer Sign-up — Admin" };

const STATUSES = ["new", "contacted", "onboarded", "archived"];

export default async function VolunteerDetailPage({ params }) {
  const { id } = await params;
  await dbConnect();

  const signupDoc = await VolunteerSignup.findById(id).lean();
  if (!signupDoc) notFound();
  const signup = JSON.parse(JSON.stringify(signupDoc));

  return (
    <div className="max-w-2xl">
      <Link href="/admin/volunteers" className="text-sm text-ink-faint hover:text-terracotta">
        &larr; All sign-ups
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">
          {signup.name}
        </h1>
        <StatusSelect
          id={signup._id}
          endpoint="/api/admin/volunteer-signups"
          status={signup.status}
          options={STATUSES}
        />
      </div>

      <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
        <Row label="Received" value={new Date(signup.createdAt).toLocaleString("en-IN")} />
        <Row label="Email" value={signup.email || "—"} />
        <Row label="Phone" value={signup.phone || "—"} />
        <Row label="Location" value={signup.location || "—"} />
        <Row label="Interest" value={signup.interest || "—"} />
      </dl>

      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Message
        </p>
        <p className="whitespace-pre-wrap rounded-2xl border border-line bg-paper p-4 text-sm text-ink-soft">
          {signup.message || "No message provided."}
        </p>
      </div>

      <div className="mt-6">
        <DeleteButton
          endpoint={`/api/admin/volunteer-signups/${id}`}
          confirmText="Delete this sign-up?"
          redirectTo="/admin/volunteers"
        />
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <span className="text-ink-faint">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}

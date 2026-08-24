import Link from "next/link";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db/connect";
import ContactMessage from "@/lib/models/ContactMessage";
import StatusSelect from "@/components/admin/StatusSelect";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Message — Admin" };

const STATUSES = ["new", "read", "replied", "archived"];

export default async function MessageDetailPage({ params }) {
  const { id } = await params;
  await dbConnect();

  const messageDoc = await ContactMessage.findById(id).lean();
  if (!messageDoc) notFound();
  const message = JSON.parse(JSON.stringify(messageDoc));

  return (
    <div className="max-w-2xl">
      <Link href="/admin/messages" className="text-sm text-ink-faint hover:text-terracotta">
        &larr; All messages
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">
          {message.name}
        </h1>
        <StatusSelect
          id={message._id}
          endpoint="/api/admin/contact-messages"
          status={message.status}
          options={STATUSES}
        />
      </div>

      <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
        <Row label="Received" value={new Date(message.createdAt).toLocaleString("en-IN")} />
        <Row label="Email" value={message.email || "—"} />
        <Row label="Phone" value={message.phone || "—"} />
      </dl>

      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Message
        </p>
        <p className="whitespace-pre-wrap rounded-2xl border border-line bg-paper p-4 text-sm text-ink-soft">
          {message.message}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        {message.email && (
          <a
            href={`mailto:${message.email}`}
            className="rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-paper"
          >
            Reply by email
          </a>
        )}
        <DeleteButton
          endpoint={`/api/admin/contact-messages/${id}`}
          confirmText="Delete this message?"
          redirectTo="/admin/messages"
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

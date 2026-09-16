import Link from "next/link";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db/connect";
import Donation from "@/lib/models/Donation";
import "@/lib/models/Donor";
import DonationForm from "@/components/admin/DonationForm";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Edit Donation — Admin" };

export default async function EditDonationPage({ params }) {
  const { id } = await params;
  await dbConnect();

  const donationDoc = await Donation.findById(id).populate("donor").lean();
  if (!donationDoc) notFound();
  // Strip Mongoose-specific types (ObjectId, Date) to plain JSON before
  // passing across the server/client component boundary.
  const donation = JSON.parse(JSON.stringify(donationDoc));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">
          Edit donation
        </h1>
        <DeleteButton
          endpoint={`/api/admin/donations/${id}`}
          confirmText="Delete this donation record? This cannot be undone."
          redirectTo="/admin/donations"
        />
      </div>

      {(donation.source === "online" || donation.receiptNumber) && (
        <div className="mt-6 rounded-2xl border border-line bg-surface p-5 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            {donation.source === "online" ? "Razorpay payment" : "Receipt"}
          </p>
          <div className="mt-2 grid gap-1 text-ink-soft">
            {donation.receiptNumber && (
              <p>
                Receipt No.:{" "}
                <span className="font-medium text-ink">{donation.receiptNumber}</span>
              </p>
            )}
            {donation.source === "online" && (
              <p>
                Status:{" "}
                <span className="font-medium capitalize text-ink">
                  {donation.status}
                </span>
              </p>
            )}
            {donation.razorpayOrderId && <p>Order ID: {donation.razorpayOrderId}</p>}
            {donation.razorpayPaymentId && (
              <p>Payment ID: {donation.razorpayPaymentId}</p>
            )}
            {donation.category && <p>Donor-selected category: {donation.category}</p>}
            {donation.suggestion && <p>Suggestion: {donation.suggestion}</p>}
            {donation.receiptEmailSentAt && (
              <p>
                Receipt emailed on{" "}
                {new Date(donation.receiptEmailSentAt).toLocaleString("en-IN")}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-line bg-surface p-5 text-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Fund allocation
          </p>
          <Link
            href={`/admin/donations/${id}/allocate`}
            className="text-xs font-semibold text-forest"
          >
            {donation.allocation?.program ? "Reassign" : "Assign purpose"}
          </Link>
        </div>
        {donation.allocation?.program ? (
          <div className="mt-2 text-ink-soft">
            <p>
              Allocated to{" "}
              <span className="font-medium capitalize text-ink">
                {donation.allocation.program.replace(/-/g, " ")}
              </span>{" "}
              on{" "}
              {new Date(donation.allocation.date).toLocaleDateString("en-IN")}
            </p>
            {donation.allocation.note && <p className="mt-1">{donation.allocation.note}</p>}
          </div>
        ) : (
          <p className="mt-2 italic text-ink-faint">
            Not yet assigned to a programme.
          </p>
        )}
      </div>

      <div className="mt-8">
        <DonationForm donationId={id} initial={donation} />
      </div>
    </div>
  );
}

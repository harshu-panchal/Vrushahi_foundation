import { site } from "@/data/site";
import { programLabel } from "@/lib/utils/programLabel";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const row = "flex justify-between gap-4 border-b border-line/70 py-2 text-sm";

export default function DonationReceipt({ receipt, amountWords, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-line bg-paper p-6 text-left sm:p-8 ${className}`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="font-display text-lg font-medium text-ink">{site.name}</p>
          <p className="mt-1 text-xs text-ink-faint">
            {site.registration.act} &middot; Reg. No. {site.registration.number}
          </p>
          <p className="text-xs text-ink-faint">PAN: {site.registration.pan}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Receipt No.
          </p>
          <p className="font-medium text-ink">{receipt.receiptNumber}</p>
          <p className="mt-1 text-xs text-ink-faint">{formatDate(receipt.date)}</p>
        </div>
      </div>

      <p className="mt-4 text-center font-display text-base font-medium uppercase tracking-wide text-ink">
        Donation Receipt
      </p>

      <div className="mt-4">
        <div className={row}>
          <span className="text-ink-faint">Received from</span>
          <span className="font-medium text-ink">{receipt.donor?.name}</span>
        </div>
        {receipt.donor?.address && (
          <div className={row}>
            <span className="text-ink-faint">Address</span>
            <span className="text-ink">{receipt.donor.address}</span>
          </div>
        )}
        {receipt.donor?.email && (
          <div className={row}>
            <span className="text-ink-faint">Email</span>
            <span className="text-ink">{receipt.donor.email}</span>
          </div>
        )}
        {receipt.donor?.phone && (
          <div className={row}>
            <span className="text-ink-faint">Phone</span>
            <span className="text-ink">{receipt.donor.phone}</span>
          </div>
        )}
        <div className={row}>
          <span className="text-ink-faint">Purpose</span>
          <span className="text-ink">{programLabel(receipt.category)}</span>
        </div>
        <div className={row}>
          <span className="text-ink-faint">Payment mode</span>
          <span className="text-ink">Online</span>
        </div>
        {receipt.razorpayPaymentId && (
          <div className={row}>
            <span className="text-ink-faint">Payment reference</span>
            <span className="text-ink">{receipt.razorpayPaymentId}</span>
          </div>
        )}
        <div className="flex justify-between gap-4 py-3">
          <span className="font-semibold text-ink">Amount</span>
          <span className="font-display text-lg font-semibold text-terracotta-dark">
            ₹{Number(receipt.amount).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {amountWords && (
        <p className="border-t border-line pt-3 text-xs text-ink-faint">
          Rupees {amountWords} Only
        </p>
      )}

      <p className="mt-6 text-xs leading-relaxed text-ink-faint">
        Thank you for your generous support. This receipt confirms that the
        above donation has been received by {site.name} and recorded against
        the programme it supports.
      </p>

      <p className="mt-6 text-right text-xs text-ink-faint">
        For {site.name}
        <br />
        <span className="font-medium text-ink">Authorized Signatory</span>
      </p>
    </div>
  );
}

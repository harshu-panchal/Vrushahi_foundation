import { site } from "@/data/site";
import { amountInWords } from "@/lib/utils/numberToWords";
import { programLabel } from "@/lib/utils/programLabel";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/**
 * Renders the donation receipt as an HTML email. Kept deliberately simple
 * (table-based, inline styles) for compatibility across email clients.
 */
export function renderDonationReceiptEmail({ donation, donor }) {
  const amount = Number(donation.amount).toLocaleString("en-IN");
  const row = (label, value) =>
    value
      ? `<tr>
          <td style="padding:6px 12px 6px 0;color:#8a7b68;font-size:13px;white-space:nowrap;">${label}</td>
          <td style="padding:6px 0;color:#2a2118;font-size:13px;">${value}</td>
        </tr>`
      : "";

  const html = `
  <div style="font-family:Georgia,'Times New Roman',serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#2a2118;">
    <h1 style="font-size:20px;margin:0 0 4px;">${site.name}</h1>
    <p style="font-size:12px;color:#8a7b68;margin:0 0 24px;">
      ${site.registration.act} &middot; Reg. No. ${site.registration.number} &middot; PAN ${site.registration.pan}
    </p>
    <h2 style="font-size:16px;margin:0 0 16px;border-bottom:1px solid #e2d5ba;padding-bottom:12px;">
      Donation Receipt
    </h2>
    <table style="width:100%;border-collapse:collapse;">
      ${row("Receipt No.", donation.receiptNumber)}
      ${row("Date", formatDate(donation.date))}
      ${row("Received from", donor.name)}
      ${row("Address", donor.address)}
      ${row("Email", donor.email)}
      ${row("Phone", donor.phone)}
      ${row("Amount", `&#8377;${amount} (Rupees ${amountInWords(donation.amount)} Only)`)}
      ${row("Purpose", programLabel(donation.category))}
      ${row("Payment mode", "Online")}
      ${row("Payment reference", donation.razorpayPaymentId)}
    </table>
    <p style="margin-top:24px;font-size:13px;color:#5c4f42;line-height:1.6;">
      Thank you for your generous support. This receipt confirms that the
      above donation has been received by ${site.name} and recorded against
      the programme it supports.
    </p>
    <p style="margin-top:24px;font-size:13px;color:#5c4f42;">
      For Vrushahi Foundation<br />Authorized Signatory
    </p>
  </div>`;

  const text = `${site.name}
${site.registration.act} — Reg. No. ${site.registration.number} — PAN ${site.registration.pan}

DONATION RECEIPT
Receipt No.: ${donation.receiptNumber}
Date: ${formatDate(donation.date)}
Received from: ${donor.name}
Amount: Rs. ${amount} (Rupees ${amountInWords(donation.amount)} Only)
Purpose: ${programLabel(donation.category)}
Payment mode: Online
Payment reference: ${donation.razorpayPaymentId || ""}

Thank you for your generous support.`;

  return {
    subject: `Your donation receipt — ${donation.receiptNumber}`,
    html,
    text,
  };
}

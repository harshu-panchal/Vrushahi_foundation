import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/connect";
import Donation from "@/lib/models/Donation";
import Donor from "@/lib/models/Donor";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";
import { recomputeDonorStats } from "@/lib/services/donorStats";
import { assignReceiptNumber } from "@/lib/services/receipts";
import { sendMail } from "@/lib/mail/mailer";
import { renderDonationReceiptEmail } from "@/lib/mail/donationReceipt";

/**
 * Fallback for when the browser never returns to call /api/donations/verify
 * (tab closed after payment, network drop, etc). Configure this URL as a
 * webhook in the Razorpay dashboard for payment.captured / payment.failed.
 */
export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature({ body: rawBody, signature })) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const payment = event?.payload?.payment?.entity;
  if (!payment) {
    return NextResponse.json({ ok: true });
  }

  await dbConnect();

  const donation = await Donation.findOne({ razorpayOrderId: payment.order_id });
  if (!donation) {
    return NextResponse.json({ ok: true });
  }

  if (event.event === "payment.captured" && donation.status !== "paid") {
    donation.status = "paid";
    donation.razorpayPaymentId = payment.id;
    await assignReceiptNumber(donation);
    await donation.save();
    await recomputeDonorStats(donation.donor);

    const donor = await Donor.findById(donation.donor).lean();
    if (donor?.email && !donation.receiptEmailSentAt) {
      const { subject, html, text } = renderDonationReceiptEmail({
        donation,
        donor: { ...donor, address: donation.donorAddress },
      });
      const sent = await sendMail({ to: donor.email, subject, html, text });
      if (sent) {
        donation.receiptEmailSentAt = new Date();
        await donation.save();
      }
    }
  } else if (event.event === "payment.failed" && donation.status === "pending") {
    donation.status = "failed";
    await donation.save();
  }

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/connect";
import Donation from "@/lib/models/Donation";
import Donor from "@/lib/models/Donor";
import { donationVerifySchema } from "@/lib/validation/schemas";
import { verifyPaymentSignature } from "@/lib/payments/razorpay";
import { recomputeDonorStats } from "@/lib/services/donorStats";
import { assignReceiptNumber } from "@/lib/services/receipts";
import { sendMail } from "@/lib/mail/mailer";
import { renderDonationReceiptEmail } from "@/lib/mail/donationReceipt";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const parsed = donationVerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const {
    donationId,
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  } = parsed.data;

  await dbConnect();

  const donation = await Donation.findById(donationId);
  if (!donation || donation.razorpayOrderId !== orderId) {
    return NextResponse.json({ error: "Donation not found" }, { status: 404 });
  }

  const valid = verifyPaymentSignature({ orderId, paymentId, signature });
  if (!valid) {
    donation.status = "failed";
    await donation.save();
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  donation.status = "paid";
  donation.razorpayPaymentId = paymentId;
  donation.razorpaySignature = signature;
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

  return NextResponse.json({
    ok: true,
    receipt: {
      receiptNumber: donation.receiptNumber,
      date: donation.date,
      amount: donation.amount,
      category: donation.category,
      razorpayPaymentId: donation.razorpayPaymentId,
      donor: {
        name: donor?.name,
        email: donor?.email,
        phone: donor?.phone,
        address: donation.donorAddress,
      },
    },
  });
}

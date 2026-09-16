import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/connect";
import Donation from "@/lib/models/Donation";
import "@/lib/models/Donor";
import { donationOrderSchema } from "@/lib/validation/schemas";
import { resolveDonor } from "@/lib/services/donorStats";
import { createRazorpayOrder } from "@/lib/payments/razorpay";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const parsed = donationOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { company, ...data } = parsed.data;
  if (company) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  await dbConnect();

  const donor = await resolveDonor({
    donorName: data.donorName,
    donorEmail: data.donorEmail,
    donorPhone: data.donorPhone,
  });

  const donation = await Donation.create({
    donor: donor._id,
    amount: data.amount,
    currency: "INR",
    mode: "razorpay",
    source: "online",
    status: "pending",
    date: new Date(),
    donationType: data.donationType || undefined,
    category: data.category || undefined,
    donorAddress: data.donorAddress || undefined,
    donorMobile2: data.donorMobile2 || undefined,
    suggestion: data.suggestion || undefined,
  });

  let order;
  try {
    order = await createRazorpayOrder({
      amount: data.amount,
      currency: "INR",
      receipt: String(donation._id),
      notes: { donationId: String(donation._id), donorName: data.donorName },
    });
  } catch (err) {
    donation.status = "failed";
    await donation.save();
    return NextResponse.json(
      { error: err.message || "Could not start payment" },
      { status: 502 }
    );
  }

  donation.razorpayOrderId = order.id;
  await donation.save();

  return NextResponse.json({
    donationId: String(donation._id),
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    donor: { name: donor.name, email: donor.email || "", phone: donor.phone || "" },
  });
}

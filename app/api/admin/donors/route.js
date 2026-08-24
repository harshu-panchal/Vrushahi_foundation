import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { dbConnect } from "@/lib/db/connect";
import Donor from "@/lib/models/Donor";

export async function GET(request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Number(searchParams.get("limit")) || 25);

  const filter = q
    ? {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
          { phone: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  const [donors, total] = await Promise.all([
    Donor.find(filter)
      .sort({ lastDonationAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Donor.countDocuments(filter),
  ]);

  return NextResponse.json({ donors, total, page, limit });
}

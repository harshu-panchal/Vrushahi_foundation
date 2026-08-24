import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { dbConnect } from "@/lib/db/connect";
import VolunteerSignup from "@/lib/models/VolunteerSignup";

export async function GET(request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Number(searchParams.get("limit")) || 25);

  const filter = status ? { status } : {};

  const [signups, total] = await Promise.all([
    VolunteerSignup.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    VolunteerSignup.countDocuments(filter),
  ]);

  return NextResponse.json({ signups, total, page, limit });
}

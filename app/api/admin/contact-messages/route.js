import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { dbConnect } from "@/lib/db/connect";
import ContactMessage from "@/lib/models/ContactMessage";

export async function GET(request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Number(searchParams.get("limit")) || 25);

  const filter = status ? { status } : {};

  const [messages, total] = await Promise.all([
    ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ContactMessage.countDocuments(filter),
  ]);

  return NextResponse.json({ messages, total, page, limit });
}

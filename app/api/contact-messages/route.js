import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/connect";
import ContactMessage from "@/lib/models/ContactMessage";
import { contactMessageSchema } from "@/lib/validation/schemas";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const parsed = contactMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { company, ...data } = parsed.data;
  if (company) {
    // Honeypot tripped — pretend success, discard silently.
    return NextResponse.json({ ok: true });
  }

  await dbConnect();
  await ContactMessage.create(data);

  return NextResponse.json({ ok: true });
}

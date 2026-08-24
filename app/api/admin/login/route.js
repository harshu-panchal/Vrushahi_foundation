import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validation/schemas";
import {
  createSessionToken,
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/lib/auth/session";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminHash) {
    return NextResponse.json(
      { error: "Admin login is not configured on the server." },
      { status: 500 }
    );
  }

  const emailMatches = email.toLowerCase() === adminEmail.toLowerCase();
  const passwordMatches = emailMatches
    ? await bcrypt.compare(password, adminHash)
    : false;

  if (!emailMatches || !passwordMatches) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  const token = await createSessionToken({ role: "admin", email: adminEmail });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}

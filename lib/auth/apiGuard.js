import { NextResponse } from "next/server";
import { getSession } from "./verifySession";

/**
 * Defense-in-depth check for API routes under /api/admin/**.
 * proxy.js already blocks unauthenticated page navigation; this protects
 * direct calls to the route handler itself.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

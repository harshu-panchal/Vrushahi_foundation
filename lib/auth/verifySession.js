import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./session";

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    return null;
  }
  return session;
}

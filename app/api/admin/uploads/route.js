import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { uploadToCloudinary, cloudinaryConfig } from "@/lib/uploads/cloudinary";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

/** Tells the admin UI whether to offer an upload button at all. */
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  return NextResponse.json({ configured: Boolean(cloudinaryConfig()) });
}

export async function POST(request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Use a JPEG, PNG, WebP, AVIF or GIF image." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image is larger than 8 MB — please compress it first." },
      { status: 400 }
    );
  }

  try {
    const { url } = await uploadToCloudinary(file);
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}

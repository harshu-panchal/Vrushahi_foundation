import crypto from "node:crypto";

/**
 * Minimal signed Cloudinary upload.
 *
 * Deliberately uses Cloudinary's REST endpoint over `fetch` rather than the
 * `cloudinary` npm package: the only thing needed here is a signed single
 * file upload, and the signature is a sorted-params SHA-1 — not worth a
 * dependency that pulls in its own HTTP stack.
 *
 * Uploads are signed server-side (never an unsigned preset) so only a
 * logged-in admin can put files in the account.
 */
const FOLDER = process.env.CLOUDINARY_FOLDER || "vrushahi";

export function cloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

function sign(params, apiSecret) {
  const toSign = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");
}

/**
 * Uploads a File/Blob to Cloudinary and resolves to its delivery URL.
 * Throws with Cloudinary's own message when the API rejects the upload.
 */
export async function uploadToCloudinary(file) {
  const config = cloudinaryConfig();
  if (!config) {
    throw new Error(
      "Image uploads are not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to your environment."
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signedParams = { folder: FOLDER, timestamp };
  const signature = sign(signedParams, config.apiSecret);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", config.apiKey);
  form.append("folder", FOLDER);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    { method: "POST", body: form }
  );

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.secure_url) {
    throw new Error(json?.error?.message || "Cloudinary rejected the upload.");
  }
  return { url: json.secure_url, publicId: json.public_id };
}

import { programs } from "@/data/programs";

/**
 * Resolves a program slug (or "general") stored on a Donation to a
 * human-readable title, for display on receipts and public donor listings.
 */
export function programLabel(slug) {
  if (!slug || slug === "general") return "General / wherever needed most";
  return programs.find((p) => p.slug === slug)?.title || slug;
}

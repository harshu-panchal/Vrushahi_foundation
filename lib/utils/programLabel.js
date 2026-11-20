/**
 * Resolves a program slug (or "general") stored on a Donation to a
 * human-readable title, for display on receipts and public donor listings.
 *
 * Programmes are admin-managed, so the list is passed in rather than
 * imported: this keeps the helper usable from client components (the
 * printable receipt) as well as from server code. A slug with no matching
 * programme — a renamed or deleted one recorded on an old donation — falls
 * back to the stored slug so the receipt still says something truthful.
 */
export function programLabel(slug, programs = []) {
  if (!slug || slug === "general") return "General / wherever needed most";
  return programs.find((p) => p.slug === slug)?.title || slug;
}

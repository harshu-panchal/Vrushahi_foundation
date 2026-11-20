/**
 * Splits an admin-entered headline into the segment list AnimatedHeadline
 * expects, treating *asterisked* runs as the emphasised phrase.
 *
 * The original home page hardcoded three segments, one of which carried an
 * italic/terracotta class. Asterisks keep that single styling decision
 * editable from a plain text input without exposing class names to an admin
 * (and AnimatedHeadline keys its underline off the terracotta class, so the
 * emphasis must use exactly that class to keep the underline flourish).
 */
export function parseEmphasis(title) {
  const text = String(title || "");
  const segments = [];

  // split() with one capture group alternates plain, captured, plain…
  // so odd indices are the asterisked runs.
  text.split(/\*([^*]+)\*/g).forEach((part, index) => {
    const trimmed = part.trim();
    if (!trimmed) return;
    segments.push({
      text: trimmed,
      ...(index % 2 === 1 ? { className: "italic text-terracotta" } : {}),
    });
  });

  return segments.length > 0 ? segments : [{ text }];
}

/**
 * Replaces `{{name}}` / `{{nested.key}}` placeholders in admin-entered copy.
 *
 * The seed script fills these in before writing, so an admin normally edits
 * finished sentences. The substitution still runs at render time to cover the
 * un-seeded fallback path, and an unknown placeholder is left untouched
 * rather than replaced with "undefined".
 */
export function fillPlaceholders(text, values) {
  return String(text || "").replace(/\{\{([\w.]+)\}\}/g, (match, path) => {
    const resolved = path
      .split(".")
      .reduce((acc, key) => (acc == null ? acc : acc[key]), values);
    return resolved == null || resolved === "" ? match : String(resolved);
  });
}

/** Splits a textarea value into paragraphs on blank lines. */
export function paragraphs(text) {
  return String(text || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

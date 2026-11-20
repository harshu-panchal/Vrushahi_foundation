// Cache tags for the admin-managed website content. Every read in
// lib/content/read.js is tagged with one of these, and every admin write
// route invalidates the matching tag — see lib/content/revalidate.js.
export const CONTENT_TAGS = {
  settings: "content:settings",
  programs: "content:programs",
  legal: "content:legal",
  items: "content:items",
  pages: "content:pages",
  founder: "content:founder",
  trustees: "content:trustees",
};

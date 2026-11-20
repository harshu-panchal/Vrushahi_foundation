import { revalidateTag } from "next/cache";
import { CONTENT_TAGS } from "./tags";

/**
 * Invalidates the cached reads for one content domain after an admin write.
 *
 * `{ expire: 0 }` is deliberate: the plain `revalidateTag(tag)` form is
 * deprecated in Next 16, and the recommended `"max"` profile serves stale
 * content while refreshing in the background — which would show an admin
 * their *old* copy right after saving. Expiring immediately costs one
 * uncached render and gives read-your-own-writes instead.
 *
 * (`updateTag` would be the idiomatic choice, but it only works inside
 * Server Actions, and this admin panel mutates through route handlers.)
 */
export function revalidateContent(tag) {
  revalidateTag(tag, { expire: 0 });
}

export { CONTENT_TAGS };

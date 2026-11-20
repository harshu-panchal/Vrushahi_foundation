import ContentItem from "@/lib/models/ContentItem";
import { contentItemUpdateSchema } from "@/lib/validation/schemas";
import { itemHandlers } from "@/lib/api/crudRoute";
import { CONTENT_TAGS } from "@/lib/content/tags";

// `category` is already fixed on the stored document, so an update only ever
// touches the editable fields — the segment is there to keep the URL shape
// consistent with the list route.
export const { PATCH, DELETE } = itemHandlers({
  Model: ContentItem,
  updateSchema: contentItemUpdateSchema,
  cacheTag: CONTENT_TAGS.items,
});

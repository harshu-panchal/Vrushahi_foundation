import LegalPage from "@/lib/models/LegalPage";
import { legalPageUpdateSchema } from "@/lib/validation/schemas";
import { itemHandlers } from "@/lib/api/crudRoute";
import { CONTENT_TAGS } from "@/lib/content/tags";

const updateSchema = legalPageUpdateSchema.transform((data) => {
  if (data.slug === "") delete data.slug;
  return data;
});

export const { PATCH, DELETE } = itemHandlers({
  Model: LegalPage,
  updateSchema,
  cacheTag: CONTENT_TAGS.legal,
});

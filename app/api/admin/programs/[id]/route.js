import Program from "@/lib/models/Program";
import { programUpdateSchema } from "@/lib/validation/schemas";
import { itemHandlers } from "@/lib/api/crudRoute";
import { CONTENT_TAGS } from "@/lib/content/tags";

// A blank slug submitted from the form would fail the model's `required`
// check, so normalise it the same way the create route does.
const updateSchema = programUpdateSchema.transform((data) => {
  if (data.slug === "") delete data.slug;
  return data;
});

export const { PATCH, DELETE } = itemHandlers({
  Model: Program,
  updateSchema,
  cacheTag: CONTENT_TAGS.programs,
});

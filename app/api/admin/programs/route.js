import Program from "@/lib/models/Program";
import { programSchema } from "@/lib/validation/schemas";
import { listCreateHandlers } from "@/lib/api/crudRoute";
import { slugify } from "@/lib/utils/slugify";
import { CONTENT_TAGS } from "@/lib/content/tags";

export const { GET, POST } = listCreateHandlers({
  Model: Program,
  createSchema: programSchema,
  sort: { order: 1, title: 1 },
  cacheTag: CONTENT_TAGS.programs,
  extendData(data) {
    return { ...data, slug: slugify(data.slug || data.title) };
  },
});

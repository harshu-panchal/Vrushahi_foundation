import LegalPage from "@/lib/models/LegalPage";
import { legalPageSchema } from "@/lib/validation/schemas";
import { listCreateHandlers } from "@/lib/api/crudRoute";
import { slugify } from "@/lib/utils/slugify";
import { CONTENT_TAGS } from "@/lib/content/tags";

export const { GET, POST } = listCreateHandlers({
  Model: LegalPage,
  createSchema: legalPageSchema,
  sort: { order: 1, title: 1 },
  cacheTag: CONTENT_TAGS.legal,
  extendData(data) {
    return { ...data, slug: slugify(data.slug || data.title) };
  },
});

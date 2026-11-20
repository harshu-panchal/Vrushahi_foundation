import Trustee from "@/lib/models/Trustee";
import { trusteeSchema } from "@/lib/validation/schemas";
import { listCreateHandlers } from "@/lib/api/crudRoute";
import { slugify } from "@/lib/utils/slugify";
import { CONTENT_TAGS } from "@/lib/content/tags";

export const { GET, POST } = listCreateHandlers({
  Model: Trustee,
  createSchema: trusteeSchema,
  sort: { order: 1, name: 1 },
  cacheTag: CONTENT_TAGS.trustees,
  extendData(data) {
    return {
      ...data,
      slug: slugify(data.slug || data.name),
      photoUrl: data.photoUrl || undefined,
      bio: data.bio || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
    };
  },
});

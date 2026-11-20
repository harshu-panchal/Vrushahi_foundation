import FounderProfile, { FOUNDER_KEY } from "@/lib/models/FounderProfile";
import { founderSchema } from "@/lib/validation/schemas";
import { singletonHandlers } from "@/lib/api/singletonRoute";
import { CONTENT_TAGS } from "@/lib/content/tags";

export const { GET, PUT } = singletonHandlers({
  Model: FounderProfile,
  filter: { key: FOUNDER_KEY },
  schema: founderSchema,
  cacheTag: CONTENT_TAGS.founder,
});

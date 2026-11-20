import Setting, { SETTING_KEY } from "@/lib/models/Setting";
import { settingsSchema } from "@/lib/validation/schemas";
import { singletonHandlers } from "@/lib/api/singletonRoute";
import { CONTENT_TAGS } from "@/lib/content/tags";

export const { GET, PUT } = singletonHandlers({
  Model: Setting,
  filter: { key: SETTING_KEY },
  schema: settingsSchema,
  cacheTag: CONTENT_TAGS.settings,
});

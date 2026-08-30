import LookupItem from "@/lib/models/LookupItem";
import { lookupItemUpdateSchema } from "@/lib/validation/schemas";
import { itemHandlers } from "@/lib/api/crudRoute";

export const { PATCH, DELETE } = itemHandlers({
  Model: LookupItem,
  updateSchema: lookupItemUpdateSchema,
});

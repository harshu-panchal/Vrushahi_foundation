import Bank from "@/lib/models/Bank";
import { bankUpdateSchema } from "@/lib/validation/schemas";
import { itemHandlers } from "@/lib/api/crudRoute";

export const { PATCH, DELETE } = itemHandlers({
  Model: Bank,
  updateSchema: bankUpdateSchema,
});

import Party from "@/lib/models/Party";
import { partyUpdateSchema } from "@/lib/validation/schemas";
import { itemHandlers } from "@/lib/api/crudRoute";

export const { PATCH, DELETE } = itemHandlers({
  Model: Party,
  updateSchema: partyUpdateSchema,
});

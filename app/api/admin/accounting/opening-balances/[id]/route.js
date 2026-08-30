import OpeningBalance from "@/lib/models/OpeningBalance";
import { openingBalanceUpdateSchema } from "@/lib/validation/schemas";
import { itemHandlers } from "@/lib/api/crudRoute";

export const { PATCH, DELETE } = itemHandlers({
  Model: OpeningBalance,
  updateSchema: openingBalanceUpdateSchema,
});

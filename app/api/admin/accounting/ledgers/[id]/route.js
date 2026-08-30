import Ledger from "@/lib/models/Ledger";
import { ledgerUpdateSchema } from "@/lib/validation/schemas";
import { itemHandlers } from "@/lib/api/crudRoute";

export const { PATCH, DELETE } = itemHandlers({
  Model: Ledger,
  updateSchema: ledgerUpdateSchema,
});

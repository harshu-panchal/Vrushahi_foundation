import Ledger from "@/lib/models/Ledger";
import { ledgerSchema } from "@/lib/validation/schemas";
import { listCreateHandlers } from "@/lib/api/crudRoute";

export const { GET, POST } = listCreateHandlers({
  Model: Ledger,
  createSchema: ledgerSchema,
  sort: { code: 1 },
});

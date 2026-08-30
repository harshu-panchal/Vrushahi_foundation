import OpeningBalance from "@/lib/models/OpeningBalance";
import { openingBalanceSchema } from "@/lib/validation/schemas";
import { listCreateHandlers } from "@/lib/api/crudRoute";

export const { GET, POST } = listCreateHandlers({
  Model: OpeningBalance,
  createSchema: openingBalanceSchema,
  sort: { yearCode: -1 },
});

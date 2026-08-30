import Bank from "@/lib/models/Bank";
import { bankSchema } from "@/lib/validation/schemas";
import { listCreateHandlers } from "@/lib/api/crudRoute";

export const { GET, POST } = listCreateHandlers({
  Model: Bank,
  createSchema: bankSchema,
  sort: { code: 1 },
});

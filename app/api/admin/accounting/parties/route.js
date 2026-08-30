import Party from "@/lib/models/Party";
import { partySchema } from "@/lib/validation/schemas";
import { listCreateHandlers } from "@/lib/api/crudRoute";

export const { GET, POST } = listCreateHandlers({
  Model: Party,
  createSchema: partySchema,
  sort: { code: 1 },
});

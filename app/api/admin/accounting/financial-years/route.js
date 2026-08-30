import FinancialYear from "@/lib/models/FinancialYear";
import { financialYearSchema } from "@/lib/validation/schemas";
import { listCreateHandlers } from "@/lib/api/crudRoute";

export const { GET, POST } = listCreateHandlers({
  Model: FinancialYear,
  createSchema: financialYearSchema,
  sort: { startDate: -1 },
});

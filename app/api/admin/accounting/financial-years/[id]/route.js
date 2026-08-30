import FinancialYear from "@/lib/models/FinancialYear";
import { financialYearUpdateSchema } from "@/lib/validation/schemas";
import { itemHandlers } from "@/lib/api/crudRoute";

export const { PATCH, DELETE } = itemHandlers({
  Model: FinancialYear,
  updateSchema: financialYearUpdateSchema,
});

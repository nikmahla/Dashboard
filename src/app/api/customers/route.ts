import { createCrudHandlers } from "@/lib/crud";
import { customersRepo } from "@/lib/data";
import { customerCreate, customerUpdate } from "@/lib/validation";

export const { GET, POST, PUT, DELETE } = createCrudHandlers({
  repo: customersRepo,
  createSchema: customerCreate,
  updateSchema: customerUpdate,
});

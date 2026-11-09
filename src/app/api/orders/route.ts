import { createCrudHandlers } from "@/lib/crud";
import { ordersRepo } from "@/lib/data";
import { orderCreate, orderUpdate } from "@/lib/validation";

export const { GET, POST, PUT, DELETE } = createCrudHandlers({
  repo: ordersRepo,
  createSchema: orderCreate,
  updateSchema: orderUpdate,
  filterKeys: ["status"],
});

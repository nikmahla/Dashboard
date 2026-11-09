import { createCrudHandlers } from "@/lib/crud";
import { productsRepo } from "@/lib/data";
import { productCreate, productUpdate } from "@/lib/validation";

export const { GET, POST, PUT, DELETE } = createCrudHandlers({
  repo: productsRepo,
  createSchema: productCreate,
  updateSchema: productUpdate,
});

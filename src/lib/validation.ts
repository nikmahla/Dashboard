import { z } from "zod";

const id = z.number().int().positive();
const text = (max = 100) => z.string().trim().min(1, "Required").max(max);

export const roleSchema = z.enum(["Admin", "Editor", "Viewer"]);
export type Role = z.infer<typeof roleSchema>;

// NOTE: "update" schemas are built from a base WITHOUT defaults. If we made them
// with .partial() on a schema that has defaults, a missing field would be filled
// with its default and silently overwrite the stored value.

// ---- Customers ----
const customerBase = z.object({
  name: text(),
  email: z.string().trim().toLowerCase().email().max(254),
  orders: z.coerce.number().int().min(0),
});
export const customerCreate = customerBase.extend({ orders: customerBase.shape.orders.default(0) });
// Update: id is required, everything else optional. Unknown keys are dropped.
export const customerUpdate = customerBase.partial().extend({ id });

// ---- Orders ----
export const orderStatus = z.enum(["Pending", "Completed", "Cancelled"]);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
const orderBase = z.object({
  customer: text(),
  total: z.coerce.number().min(0).max(1_000_000),
  status: orderStatus,
  date: isoDate,
});
export const orderCreate = orderBase.extend({
  status: orderStatus.default("Pending"),
  date: isoDate.default(() => new Date().toISOString().slice(0, 10)),
});
export const orderUpdate = orderBase.partial().extend({ id });

// ---- Products ----
export const productStatus = z.enum(["In Stock", "Out of Stock"]);
const productBase = z.object({
  name: text(),
  price: z.coerce.number().min(0).max(1_000_000),
  status: productStatus,
});
export const productCreate = productBase.extend({ status: productStatus.default("In Stock") });
export const productUpdate = productBase.partial().extend({ id });

// ---- Users (admin management) ----
const userBase = z.object({
  name: text(),
  email: z.string().trim().toLowerCase().email().max(254),
  role: roleSchema,
});
export const userCreate = userBase.extend({ role: roleSchema.default("Viewer") });
export const userUpdate = userBase.partial().extend({ id });

// ---- Tasks ----
export const priority = z.enum(["low", "medium", "high"]);
export const taskCreate = z.object({
  title: text(200).default("Untitled Task"),
  priority: priority.default("medium"),
});
export const taskUpdate = z.object({
  id,
  title: text(200).optional(),
  priority: priority.optional(),
  completed: z.boolean().optional(),
});

// ---- Auth ----
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1).max(254),
  password: z.string().min(1).max(200),
});
export const profileUpdate = z.object({
  name: text().optional(),
  email: z.string().trim().toLowerCase().email().max(254).optional(),
});

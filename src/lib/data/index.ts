import { createMemoryRepo } from "./memory-repo";
import type { Role } from "../validation";

export type Customer = { id: number; name: string; email: string; orders: number };
export type Order = { id: number; customer: string; total: number; status: string; date: string };
export type Product = { id: number; name: string; price: number; status: string };
export type ManagedUser = { id: number; name: string; email: string; role: Role };
export type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: string;
  createdAt: string;
  updatedAt: string;
};
export type InventoryItem = {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  sku: string;
};

const now = () => new Date().toISOString();

// Dates are relative to "today" so the demo never looks stale.
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

// [customer, total, status, days ago] — more recent activity than old, like a growing shop.
const ORDER_SEED: [string, number, Order["status"], number][] = [
  ["Marta Ruiz", 2399, "Completed", 168], ["Liam Walker", 349, "Completed", 160], ["Sofia Rossi", 1299, "Completed", 151],
  ["Noah Becker", 899, "Cancelled", 143], ["Marta Ruiz", 179, "Completed", 134], ["Aisha Khan", 1899, "Completed", 126],
  ["Liam Walker", 2599, "Completed", 118], ["Elena Petrova", 129, "Completed", 109], ["Noah Becker", 1099, "Completed", 101],
  ["Sofia Rossi", 449, "Completed", 94], ["Aisha Khan", 3199, "Completed", 88], ["Daniel Costa", 349, "Completed", 81],
  ["Elena Petrova", 1299, "Completed", 74], ["Marta Ruiz", 899, "Completed", 66], ["Daniel Costa", 2399, "Completed", 59],
  ["Liam Walker", 179, "Cancelled", 52], ["Sofia Rossi", 1899, "Completed", 47], ["Aisha Khan", 349, "Completed", 41],
  ["Noah Becker", 2599, "Completed", 36], ["Elena Petrova", 449, "Completed", 31], ["Marta Ruiz", 1299, "Completed", 27],
  ["Daniel Costa", 129, "Completed", 23], ["Liam Walker", 3199, "Completed", 19], ["Sofia Rossi", 899, "Pending", 15],
  ["Aisha Khan", 1099, "Completed", 12], ["Noah Becker", 349, "Pending", 9], ["Elena Petrova", 2399, "Completed", 6],
  ["Marta Ruiz", 179, "Pending", 4], ["Daniel Costa", 1899, "Completed", 2], ["Liam Walker", 449, "Pending", 1], ["Aisha Khan", 349, "Completed", 0],
];

const CUSTOMER_SEED: { name: string; email: string }[] = [
  { name: "Marta Ruiz", email: "marta.ruiz@example.com" },
  { name: "Liam Walker", email: "liam.walker@example.com" },
  { name: "Sofia Rossi", email: "sofia.rossi@example.com" },
  { name: "Noah Becker", email: "noah.becker@example.com" },
  { name: "Aisha Khan", email: "aisha.khan@example.com" },
  { name: "Elena Petrova", email: "elena.petrova@example.com" },
  { name: "Daniel Costa", email: "daniel.costa@example.com" },
];

export const customersRepo = createMemoryRepo<Customer>(
  CUSTOMER_SEED.map((c, i) => ({
    id: i + 1,
    ...c,
    // Derived from the order seed so the two tables agree.
    orders: ORDER_SEED.filter(([name]) => name === c.name).length,
  })),
  { searchFields: ["name", "email"] }
);

export const ordersRepo = createMemoryRepo<Order>(
  ORDER_SEED.map(([customer, total, status, ago], i) => ({
    id: i + 1,
    customer,
    total,
    status,
    date: daysAgo(ago),
  })).reverse(),
  { searchFields: ["customer"], newestFirst: true, facetField: "status" }
);

const INVENTORY_SEED: Omit<InventoryItem, "id">[] = [
  { name: 'MacBook Pro 14"', category: "Laptops", stock: 12, price: 2399, sku: "MBP-14" },
  { name: "Dell XPS 13", category: "Laptops", stock: 8, price: 1299, sku: "DXP-13" },
  { name: "Asus ROG Zephyrus", category: "Laptops", stock: 5, price: 2599, sku: "ROG-ZF" },
  { name: "iPhone 15", category: "Phones", stock: 34, price: 899, sku: "IPH-15" },
  { name: "Samsung Galaxy S24", category: "Phones", stock: 27, price: 1099, sku: "SGS-24" },
  { name: "Google Pixel 8", category: "Phones", stock: 3, price: 699, sku: "PXL-8" },
  { name: "AirPods Pro", category: "Audio", stock: 58, price: 249, sku: "APP-2" },
  { name: "Sony WH-1000XM5", category: "Audio", stock: 40, price: 349, sku: "SNY-XM5" },
  { name: "Logitech MX Master 3S", category: "Accessories", stock: 45, price: 109, sku: "LMX-3S" },
  { name: "USB-C Dock", category: "Accessories", stock: 6, price: 179, sku: "DOCK-C" },
  { name: 'LG UltraFine 27"', category: "Monitors", stock: 14, price: 449, sku: "LG-UF27" },
  { name: 'Dell U2723QE 27"', category: "Monitors", stock: 9, price: 579, sku: "DEL-U27" },
];

export const inventoryRepo = createMemoryRepo<InventoryItem>(
  INVENTORY_SEED.map((r, i) => ({ id: i + 1, ...r })),
  { searchFields: ["name", "sku"] }
);

export const productsRepo = createMemoryRepo<Product>(
  INVENTORY_SEED.map((r, i) => ({
    id: i + 1,
    name: r.name,
    price: r.price,
    status: r.stock > 0 ? "In Stock" : "Out of Stock",
  })),
  { searchFields: ["name"], newestFirst: true }
);

export const usersRepo = createMemoryRepo<ManagedUser>(
  [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Editor" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Viewer" },
    { id: 4, name: "David Lee", email: "david@example.com", role: "Viewer" },
    { id: 5, name: "Emily Davis", email: "emily@example.com", role: "Editor" },
  ],
  { searchFields: ["name", "email"], newestFirst: true }
);

export const tasksRepo = createMemoryRepo<Task>(
  [
    { id: 1, title: "Reorder Google Pixel 8 (3 left in stock)", completed: false, priority: "high", createdAt: now(), updatedAt: now() },
    { id: 2, title: "Review pending orders from this week", completed: true, priority: "medium", createdAt: now(), updatedAt: now() },
    { id: 3, title: "Send the monthly sales report", completed: false, priority: "medium", createdAt: now(), updatedAt: now() },
    { id: 4, title: "Write product descriptions for the new monitors", completed: false, priority: "low", createdAt: now(), updatedAt: now() },
    { id: 5, title: "Fix the broken image on the About page", completed: true, priority: "low", createdAt: now(), updatedAt: now() },
  ],
  { searchFields: ["title"], newestFirst: true }
);

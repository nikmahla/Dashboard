/**
 * @jest-environment node
 */
// These tests use REAL tokens (no auth mocking) so they prove the real rules:
// 401 = not logged in, 403 = wrong role, 400 = invalid input.
import { signToken } from "@/lib/jwt";

process.env.JWT_SECRET = "test-secret-test-secret-test-secret-1234";

const url = (p: string) => `http://localhost${p}`;
async function as(role: "Admin" | "Editor" | "Viewer" | null) {
  if (!role) return {};
  const token = await signToken({ sub: 1, name: role, email: `${role}@t.com`, role });
  return { cookie: `token=${token}` };
}
const json = async (method: string, path: string, role: "Admin" | "Editor" | "Viewer" | null, body?: unknown) =>
  new Request(url(path), {
    method,
    headers: { "content-type": "application/json", ...(await as(role)) } as Record<string, string>,
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });

let orders: typeof import("@/app/api/orders/route");
let customers: typeof import("@/app/api/customers/route");
let users: typeof import("@/app/api/users/route");
let inventory: typeof import("@/app/api/inventory/route");
let tasks: typeof import("@/app/api/tasks/route");
let login: typeof import("@/app/api/auth/login/route");

beforeAll(async () => {
  orders = await import("@/app/api/orders/route");
  customers = await import("@/app/api/customers/route");
  users = await import("@/app/api/users/route");
  inventory = await import("@/app/api/inventory/route");
  tasks = await import("@/app/api/tasks/route");
  login = await import("@/app/api/auth/login/route");
});

describe("authentication (401)", () => {
  it.each(["GET", "POST"] as const)("customers %s without token -> 401", async (m) => {
    const res = await customers[m](await json(m, "/api/customers", null, m === "POST" ? {} : undefined));
    expect(res.status).toBe(401);
  });
  it("inventory GET without token -> 401 (was open before)", async () => {
    expect((await inventory.GET(await json("GET", "/api/inventory", null))).status).toBe(401);
  });
  it("garbage token -> 401", async () => {
    const req = new Request(url("/api/customers"), { headers: { cookie: "token=abc" } });
    expect((await customers.GET(req)).status).toBe(401);
  });
});

describe("authorization (403)", () => {
  it("Viewer can read", async () => {
    expect((await customers.GET(await json("GET", "/api/customers", "Viewer"))).status).toBe(200);
  });
  it("Viewer cannot create / update / delete", async () => {
    const body = { name: "X", email: "x@x.com" };
    expect((await customers.POST(await json("POST", "/api/customers", "Viewer", body))).status).toBe(403);
    expect((await customers.PUT(await json("PUT", "/api/customers", "Viewer", { id: 1, name: "Y" }))).status).toBe(403);
    expect((await customers.DELETE(await json("DELETE", "/api/customers?id=1", "Viewer"))).status).toBe(403);
  });
  it("Editor cannot manage users, Admin can", async () => {
    const body = { name: "New", email: "new@x.com", role: "Viewer" };
    expect((await users.POST(await json("POST", "/api/users", "Editor", body))).status).toBe(403);
    expect((await users.POST(await json("POST", "/api/users", "Admin", body))).status).toBe(201);
  });
});

describe("validation (400) and mass assignment", () => {
  it("rejects invalid email and wrong type", async () => {
    const res = await customers.POST(
      await json("POST", "/api/customers", "Editor", { name: "Test", email: "not-an-email", orders: "abc" })
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.errors.email).toBeDefined();
    expect(body.errors.orders).toBeDefined();
  });
  it("rejects broken JSON", async () => {
    const res = await customers.POST(await json("POST", "/api/customers", "Editor", "{not json"));
    expect(res.status).toBe(400);
  });
  it("creates with a server-generated id; ignores a client-sent id/role fields", async () => {
    const res = await customers.POST(
      await json("POST", "/api/customers", "Editor", { id: 999, name: "Ok", email: "OK@Example.com", isAdmin: true })
    );
    expect(res.status).toBe(201);
    const row = await res.json();
    expect(row.id).not.toBe(999);
    expect(row.email).toBe("ok@example.com");
    expect(row.orders).toBe(0);
    expect(row).not.toHaveProperty("isAdmin");
  });
  it("update with missing fields keeps stored values", async () => {
    const created = await (await customers.POST(await json("POST", "/api/customers", "Editor", { name: "Keep", email: "keep@x.com", orders: 7 }))).json();
    const upd = await (await customers.PUT(await json("PUT", "/api/customers", "Editor", { id: created.id, name: "Kept" }))).json();
    expect(upd.name).toBe("Kept");
    expect(upd.orders).toBe(7);
  });
  it("PUT unknown id -> 404, DELETE without id -> 400", async () => {
    expect((await customers.PUT(await json("PUT", "/api/customers", "Editor", { id: 424242, name: "Z" }))).status).toBe(404);
    expect((await customers.DELETE(await json("DELETE", "/api/customers", "Editor"))).status).toBe(400);
  });
  it("pagination is clamped (pageSize=100000 -> max 100)", async () => {
    const res = await inventory.GET(await json("GET", "/api/inventory?page=-5&pageSize=100000", "Viewer"));
    expect(res.status).toBe(200);
    expect((await res.json()).data.length).toBeLessThanOrEqual(100);
  });
  it("tasks: server decides id and completed", async () => {
    const res = await tasks.POST(await json("POST", "/api/tasks", "Editor", { title: "T", completed: true, id: 5 }));
    const t = await res.json();
    expect(t.completed).toBe(false);
    expect(t.id).not.toBe(5);
  });
});

describe("login with hashed passwords", () => {
  const post = (b: unknown) => login.POST(new Request(url("/api/auth/login"), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) }));
  it("accepts the demo account", async () => {
    const res = await post({ email: " Admin@test.com ", password: "1234" });
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toContain("HttpOnly");
  });
  it("rejects wrong password and unknown user the same way", async () => {
    const a = await post({ email: "admin@test.com", password: "nope" });
    const b = await post({ email: "ghost@test.com", password: "1234" });
    expect(a.status).toBe(401);
    expect(b.status).toBe(401);
    expect(await a.json()).toEqual(await b.json());
  });
  it("missing fields -> 400", async () => {
    expect((await post({})).status).toBe(400);
  });
});

describe("orders status filter", () => {
  it("returns only the requested status, with counters for every status", async () => {
    const all = await (await orders.GET(await json("GET", "/api/orders?pageSize=100", "Viewer"))).json();
    const pending = await (await orders.GET(await json("GET", "/api/orders?pageSize=100&status=Pending", "Viewer"))).json();
    expect(pending.data.length).toBeGreaterThan(0);
    expect(pending.data.every((o: { status: string }) => o.status === "Pending")).toBe(true);
    expect(pending.total).toBe(all.facets.Pending);
    expect(pending.facets).toEqual(all.facets); // counters ignore the status filter
    expect(Object.values(all.facets as Record<string, number>).reduce((a, b) => a + b, 0)).toBe(all.total);
  });
  it("ignores unknown filter keys", async () => {
    const res = await (await orders.GET(await json("GET", "/api/orders?customer=zzz&pageSize=100", "Viewer"))).json();
    expect(res.total).toBeGreaterThan(0);
  });
});

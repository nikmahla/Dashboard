import { buildDashboardSummary, parseRange } from "../dashboard-summary";
import type { InventoryItem, Order } from "../data";

const NOW = Date.parse("2026-11-02T12:00:00Z");
const order = (id: number, date: string, total: number, status = "Completed"): Order => ({ id, customer: "A", total, status, date });
const item = (id: number, category: string, stock: number): InventoryItem => ({ id, name: `i${id}`, category, stock, price: 1, sku: `S${id}` });

describe("buildDashboardSummary", () => {
  const orders = [
    order(1, "2026-10-30", 100), // last 30 days
    order(2, "2026-10-20", 50, "Pending"), // counts as an order, not revenue
    order(3, "2026-10-25", 999, "Cancelled"), // ignored everywhere
    order(4, "2026-09-20", 200), // previous 30 days
  ];
  const inventory = [item(1, "Laptops", 3), item(2, "Laptops", 20), item(3, "Phones", 9)];
  const s = buildDashboardSummary(orders, inventory, 7, NOW);

  it("counts revenue only from completed orders and ignores cancelled", () => {
    expect(s.kpis.revenue.value).toBe(100);
    expect(s.kpis.revenue.previous).toBe(200);
  });
  it("counts orders without the cancelled ones", () => {
    expect(s.kpis.orders.value).toBe(2);
    expect(s.kpis.orders.previous).toBe(1);
  });
  it("reports customers and low stock", () => {
    expect(s.kpis.customers.value).toBe(7);
    expect(s.kpis.lowStock.value).toBe(2);
    expect(s.lowStock.map((i) => i.id)).toEqual([1, 3]); // lowest stock first
  });
  it("builds 6 five-day bars for the 30-day range, newest last", () => {
    expect(s.days).toBe(30);
    expect(s.trend).toHaveLength(6);
    expect(s.bucketDays).toBe(5);
    expect(s.trend.reduce((sum, p) => sum + p.revenue, 0)).toBe(100);
    expect(s.trend.reduce((sum, p) => sum + p.orders, 0)).toBe(2);
    expect(s.trend.at(-1)).toMatchObject({ revenue: 100, orders: 1 }); // Oct 30 is in the last 5 days
  });
  it("groups stock by category, biggest first", () => {
    expect(s.stockByCategory).toEqual([
      { name: "Laptops", units: 23 },
      { name: "Phones", units: 9 },
    ]);
  });
  it("has 10 sparkline points (30 days) and newest orders first", () => {
    expect(s.kpis.revenue.spark).toHaveLength(10);
    expect(s.recentOrders[0].id).toBe(1);
  });

  describe("date range", () => {
    it("7 days: only the last week counts, shown as 7 daily bars", () => {
      const w = buildDashboardSummary(orders, inventory, 7, NOW, 7);
      expect(w.days).toBe(7);
      expect(w.kpis.revenue.value).toBe(100);
      expect(w.kpis.orders.value).toBe(1);
      expect(w.kpis.revenue.previous).toBe(0); // 7-14 days ago has nothing completed
      expect(w.trend).toHaveLength(7);
      expect(w.bucketDays).toBe(1);
      expect(w.ordersByStatus.find((x) => x.status === "Pending")?.count).toBe(0);
    });
    it("90 days: the earlier order moves into the current period", () => {
      const q = buildDashboardSummary(orders, inventory, 7, NOW, 90);
      expect(q.kpis.revenue.value).toBe(300);
      expect(q.kpis.orders.value).toBe(3);
      expect(q.trend).toHaveLength(6);
      expect(q.bucketDays).toBe(15);
    });
    it("parseRange only accepts supported values", () => {
      expect(parseRange("7")).toBe(7);
      expect(parseRange("90")).toBe(90);
      expect(parseRange("1000")).toBe(30);
      expect(parseRange(null)).toBe(30);
      expect(parseRange("abc")).toBe(30);
    });
  });
});

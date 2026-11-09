import type { InventoryItem, Order } from "./data";

import { LOW_STOCK_LIMIT } from "./dashboard-summary-constants";

export { LOW_STOCK_LIMIT };

export const RANGES = [7, 30, 90] as const;
export type RangeDays = (typeof RANGES)[number];
export const DEFAULT_RANGE: RangeDays = 30;

/** Accepts anything (e.g. a query string) and returns a supported range. */
export function parseRange(value: unknown): RangeDays {
  const n = Number(value);
  return (RANGES as readonly number[]).includes(n) ? (n as RangeDays) : DEFAULT_RANGE;
}
const DAY = 86_400_000;

export type DashboardSummary = {
  days: RangeDays;
  kpis: {
    revenue: { value: number; previous: number; spark: number[] };
    orders: { value: number; previous: number; spark: number[] };
    customers: { value: number };
    lowStock: { value: number };
  };
  /** Revenue and orders per bucket across the selected range, oldest first. */
  trend: { label: string; revenue: number; orders: number }[];
  /** Days covered by one bar in `trend`. */
  bucketDays: number;
  ordersByStatus: { status: string; count: number }[];
  stockByCategory: { name: string; units: number }[];
  recentOrders: Order[];
  lowStock: InventoryItem[];
};

const toTime = (isoDate: string) => Date.parse(`${isoDate}T00:00:00Z`);

/** Sum of `pick(order)` for orders whose date falls in (now - toDaysAgo, now - fromDaysAgo]. */
function windowSum(orders: Order[], now: number, fromDaysAgo: number, toDaysAgo: number, pick: (o: Order) => number) {
  return orders
    .filter((o) => {
      const age = (now - toTime(o.date)) / DAY;
      return age >= fromDaysAgo && age < toDaysAgo;
    })
    .reduce((sum, o) => sum + pick(o), 0);
}

/**
 * Pure function: same inputs -> same output, so it is easy to test.
 * Cancelled orders never count as revenue or as orders.
 */
export function buildDashboardSummary(
  orders: Order[],
  inventory: InventoryItem[],
  customerCount: number,
  now: number = Date.now(),
  days: RangeDays = DEFAULT_RANGE
): DashboardSummary {
  const active = orders.filter((o) => o.status !== "Cancelled");
  const revenueOf = (o: Order) => (o.status === "Completed" ? o.total : 0);
  const one = () => 1;

  // Small trend lines: the selected range cut into equal slices, oldest first.
  const sparkCount = days === 7 ? 7 : days === 30 ? 10 : 9;
  const sparkSize = days / sparkCount;
  const slices = Array.from({ length: sparkCount }, (_, i) => sparkCount - 1 - i);
  const sparkRevenue = slices.map((k) => windowSum(active, now, k * sparkSize, (k + 1) * sparkSize, revenueOf));
  const sparkOrders = slices.map((k) => windowSum(active, now, k * sparkSize, (k + 1) * sparkSize, one));

  // Bars: 7 days -> 7 daily bars, otherwise 6 bars (5-day or 15-day groups).
  const barCount = days === 7 ? 7 : 6;
  const bucketDays = days / barCount;
  const trend = Array.from({ length: barCount }, (_, i) => {
    const k = barCount - 1 - i;
    const from = k * bucketDays;
    const to = (k + 1) * bucketDays;
    // Label = first day of the bucket, e.g. "Oct 4".
    const start = new Date(now - (to - 1) * DAY);
    return {
      label: start.toLocaleString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
      revenue: windowSum(active, now, from, to, revenueOf),
      orders: windowSum(active, now, from, to, one),
    };
  });

  const statusCounts = new Map<string, number>();
  for (const o of orders) {
    if ((now - toTime(o.date)) / DAY >= days) continue;
    statusCounts.set(o.status, (statusCounts.get(o.status) ?? 0) + 1);
  }

  const categoryUnits = new Map<string, number>();
  for (const item of inventory) categoryUnits.set(item.category, (categoryUnits.get(item.category) ?? 0) + item.stock);

  const lowStock = inventory
    .filter((i) => i.stock < LOW_STOCK_LIMIT)
    .sort((a, b) => a.stock - b.stock);

  return {
    days,
    kpis: {
      revenue: {
        value: windowSum(active, now, 0, days, revenueOf),
        previous: windowSum(active, now, days, days * 2, revenueOf),
        spark: sparkRevenue,
      },
      orders: {
        value: windowSum(active, now, 0, days, one),
        previous: windowSum(active, now, days, days * 2, one),
        spark: sparkOrders,
      },
      customers: { value: customerCount },
      lowStock: { value: lowStock.length },
    },
    trend,
    bucketDays,
    ordersByStatus: ["Completed", "Pending", "Cancelled"].map((status) => ({
      status,
      count: statusCounts.get(status) ?? 0,
    })),
    stockByCategory: [...categoryUnits].map(([name, units]) => ({ name, units })).sort((a, b) => b.units - a.units),
    recentOrders: [...orders].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 6),
    lowStock: lowStock.slice(0, 5),
  };
}

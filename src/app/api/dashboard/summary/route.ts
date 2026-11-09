import { NextResponse } from "next/server";
import { customersRepo, inventoryRepo, ordersRepo } from "@/lib/data";
import { buildDashboardSummary, parseRange } from "@/lib/dashboard-summary";
import { READ, requireAuth } from "@/lib/requireAuth";

// All numbers on the dashboard come from here, calculated from the real data.
export async function GET(req: Request) {
  const auth = await requireAuth(req, { roles: READ });
  if (!auth.ok) return auth.res;

  const days = parseRange(new URL(req.url).searchParams.get("days"));
  const [orders, inventory, customers] = await Promise.all([
    ordersRepo.all(),
    inventoryRepo.all(),
    customersRepo.all(),
  ]);
  return NextResponse.json(buildDashboardSummary(orders, inventory, customers.length, Date.now(), days));
}

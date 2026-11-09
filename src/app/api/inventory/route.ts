import { NextResponse } from "next/server";
import { inventoryRepo } from "@/lib/data";
import { parseListParams } from "@/lib/api-utils";
import { READ, requireAuth } from "@/lib/requireAuth";

// Read-only. (This route used to have NO auth check at all.)
export async function GET(req: Request) {
  const auth = await requireAuth(req, { roles: READ });
  if (!auth.ok) return auth.res;

  const params = parseListParams(new URL(req.url).searchParams);
  return NextResponse.json(await inventoryRepo.list(params));
}

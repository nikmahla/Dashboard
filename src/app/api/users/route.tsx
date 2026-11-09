import { NextResponse } from "next/server";
import { createCrudHandlers } from "@/lib/crud";
import { usersRepo } from "@/lib/data";
import { ADMIN_ONLY, READ, requireAuth } from "@/lib/requireAuth";
import { userCreate, userUpdate } from "@/lib/validation";

// Only Admins may create/change/delete users (a Viewer must not be able to make themselves Admin).
const crud = createCrudHandlers({
  repo: usersRepo,
  createSchema: userCreate,
  updateSchema: userUpdate,
  writeRoles: ADMIN_ONLY,
});

export const { POST, PUT, DELETE } = crud;

// The UI expects a plain array here.
export async function GET(req: Request) {
  const auth = await requireAuth(req, { roles: READ });
  if (!auth.ok) return auth.res;
  return NextResponse.json(await usersRepo.all());
}

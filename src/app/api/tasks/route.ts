import { NextResponse } from "next/server";
import { createCrudHandlers } from "@/lib/crud";
import { tasksRepo } from "@/lib/data";
import { READ, requireAuth } from "@/lib/requireAuth";
import { taskCreate, taskUpdate } from "@/lib/validation";

const crud = createCrudHandlers({
  repo: tasksRepo,
  createSchema: taskCreate,
  updateSchema: taskUpdate,
  // The server sets these; the client can never choose them.
  onCreate: (input) => ({
    ...input,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
  onUpdate: (patch) => ({ ...patch, updatedAt: new Date().toISOString() }),
});

export const { POST, PUT, DELETE } = crud;

// The UI expects a plain array here.
export async function GET(req: Request) {
  const auth = await requireAuth(req, { roles: READ });
  if (!auth.ok) return auth.res;
  return NextResponse.json(await tasksRepo.all());
}

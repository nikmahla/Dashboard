import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { jsonError, parseBody, parseIdParam, parseListParams } from "./api-utils";
import { READ, WRITE, requireAuth } from "./requireAuth";
import type { Repo, Entity } from "./data/memory-repo";
import type { Role } from "./validation";

type Config<T extends Entity, C, U extends { id: number }> = {
  repo: Repo<T>;
  createSchema: ZodType<C>;
  updateSchema: ZodType<U>;
  /** Extra fields added by the server (e.g. timestamps). Never taken from the client. */
  onCreate?: (input: C) => Omit<T, "id">;
  onUpdate?: (patch: Omit<U, "id">) => Partial<Omit<T, "id">>;
  /** Query-string keys that act as exact-match filters (e.g. ["status"]). */
  filterKeys?: string[];
  readRoles?: Role[];
  writeRoles?: Role[];
};

/**
 * Builds the four handlers (GET/POST/PUT/DELETE) for one resource.
 * Every handler does the same steps, in this order:
 *   1) check auth + role   2) validate input   3) call the repository   4) respond
 */
export function createCrudHandlers<T extends Entity, C, U extends { id: number }>(cfg: Config<T, C, U>) {
  const readRoles = cfg.readRoles ?? READ;
  const writeRoles = cfg.writeRoles ?? WRITE;

  return {
    async GET(req: Request) {
      const auth = await requireAuth(req, { roles: readRoles });
      if (!auth.ok) return auth.res;

      const params = parseListParams(new URL(req.url).searchParams, cfg.filterKeys);
      return NextResponse.json(await cfg.repo.list(params));
    },

    async POST(req: Request) {
      const auth = await requireAuth(req, { roles: writeRoles });
      if (!auth.ok) return auth.res;

      const body = await parseBody(req, cfg.createSchema);
      if (!body.ok) return body.res;

      const input = cfg.onCreate ? cfg.onCreate(body.data) : (body.data as unknown as Omit<T, "id">);
      const created = await cfg.repo.create(input);
      return NextResponse.json(created, { status: 201 });
    },

    async PUT(req: Request) {
      const auth = await requireAuth(req, { roles: writeRoles });
      if (!auth.ok) return auth.res;

      const body = await parseBody(req, cfg.updateSchema);
      if (!body.ok) return body.res;

      const { id, ...rest } = body.data;
      const patch = cfg.onUpdate ? cfg.onUpdate(rest as Omit<U, "id">) : (rest as Partial<Omit<T, "id">>);
      const updated = await cfg.repo.update(id, patch);
      if (!updated) return jsonError(404, "Not found");
      return NextResponse.json(updated);
    },

    async DELETE(req: Request) {
      const auth = await requireAuth(req, { roles: writeRoles });
      if (!auth.ok) return auth.res;

      const id = parseIdParam(new URL(req.url).searchParams);
      if (id === null) return jsonError(400, "Missing or invalid id");

      const removed = await cfg.repo.remove(id);
      if (!removed) return jsonError(404, "Not found");
      return NextResponse.json({ success: true });
    },
  };
}

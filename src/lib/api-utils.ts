import { NextResponse } from "next/server";
import type { ZodType } from "zod";

/** Consistent JSON error: { message, errors? } */
export function jsonError(status: number, message: string, errors?: unknown) {
  return NextResponse.json(errors ? { message, errors } : { message }, { status });
}

type Parsed<T> = { ok: true; data: T } | { ok: false; res: NextResponse };

/**
 * Read the request body as JSON and validate it with a Zod schema.
 * Never trust data from the client: invalid JSON or wrong shape -> 400.
 */
export async function parseBody<T>(req: Request, schema: ZodType<T>): Promise<Parsed<T>> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return { ok: false, res: jsonError(400, "Request body must be valid JSON") };
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    const flat = result.error.flatten();
    return { ok: false, res: jsonError(400, "Validation failed", flat.fieldErrors) };
  }
  return { ok: true, data: result.data };
}

export type ListParams = {
  page: number;
  pageSize: number;
  search: string;
  /** Exact-match filters, e.g. { status: "Pending" }. Only keys the resource allows. */
  filters?: Record<string, string>;
};

function toInt(value: string | null, fallback: number) {
  const n = Number(value);
  return Number.isInteger(n) ? n : fallback;
}

/** Safe pagination: page >= 1, 1 <= pageSize <= 100, search trimmed and capped. */
export function parseListParams(searchParams: URLSearchParams, filterKeys: string[] = []): ListParams {
  const page = Math.max(1, toInt(searchParams.get("page"), 1));
  const pageSize = Math.min(100, Math.max(1, toInt(searchParams.get("pageSize"), 10)));
  const search = (searchParams.get("search") ?? "").trim().slice(0, 100);
  const filters: Record<string, string> = {};
  for (const key of filterKeys) {
    const v = (searchParams.get(key) ?? "").trim().slice(0, 50);
    if (v) filters[key] = v;
  }
  return { page, pageSize, search, filters };
}

/** Read ?id= as a positive integer, or null. */
export function parseIdParam(searchParams: URLSearchParams): number | null {
  const n = Number(searchParams.get("id"));
  return Number.isInteger(n) && n > 0 ? n : null;
}

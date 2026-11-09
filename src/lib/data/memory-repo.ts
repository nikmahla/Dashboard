import type { ListParams } from "../api-utils";

export type Entity = { id: number };

/**
 * The shape every data source must follow. Routes only talk to this interface,
 * so the in-memory store below can later be replaced by PostgreSQL + Prisma
 * without touching the routes.
 */
export interface Repo<T extends Entity> {
  list(params: ListParams): Promise<{ data: T[]; total: number; facets?: Record<string, number> }>;
  all(): Promise<T[]>;
  create(input: Omit<T, "id">): Promise<T>;
  update(id: number, patch: Partial<Omit<T, "id">>): Promise<T | null>;
  remove(id: number): Promise<boolean>;
}

type Options<T> = {
  /** Fields matched by ?search= (case-insensitive "contains"). */
  searchFields: (keyof T)[];
  /** New rows go to the top of the list (like the old behaviour for orders/products). */
  newestFirst?: boolean;
  /** Field whose values are counted (after search, before filters) for tab counters. */
  facetField?: keyof T;
};

export function createMemoryRepo<T extends Entity>(seed: T[], options: Options<T>): Repo<T> {
  let rows: T[] = seed.map((r) => ({ ...r }));
  // Like an auto-increment id in a database (never reuse an id).
  let nextId = rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;

  return {
    async list({ page, pageSize, search, filters = {} }) {
      const q = search.toLowerCase();
      const searched = q
        ? rows.filter((r) => options.searchFields.some((f) => String(r[f]).toLowerCase().includes(q)))
        : rows;
      const filtered = searched.filter((r) =>
        Object.entries(filters).every(([key, value]) => String((r as Record<string, unknown>)[key]) === value)
      );
      let facets: Record<string, number> | undefined;
      if (options.facetField) {
        facets = {};
        for (const r of searched) {
          const k = String(r[options.facetField]);
          facets[k] = (facets[k] ?? 0) + 1;
        }
      }
      const start = (page - 1) * pageSize;
      return { data: filtered.slice(start, start + pageSize), total: filtered.length, ...(facets ? { facets } : {}) };
    },

    async all() {
      return rows;
    },

    async create(input) {
      const row = { ...input, id: nextId++ } as T;
      if (options.newestFirst) rows = [row, ...rows];
      else rows = [...rows, row];
      return row;
    },

    async update(id, patch) {
      const idx = rows.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      // Only fields that were actually sent are changed.
      const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
      rows[idx] = { ...rows[idx], ...clean } as T;
      return rows[idx];
    },

    async remove(id) {
      const before = rows.length;
      rows = rows.filter((r) => r.id !== id);
      return rows.length < before;
    },
  };
}

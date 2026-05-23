"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, Eye, Pencil, Trash } from "lucide-react";
import SwipeCard from "./SwipeCard";
import ConfirmModal from "./ConfirmModal";
import EmptyState from "./EmptyState";
import Tooltip from "./Tooltip";

type Column<T> = {
  key: keyof T;
  label: string;
  align?: "left" | "right";
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  searchableKey?: keyof T;

  serverSide?: boolean;
  query?: string;
  onQueryChange?: (q: string) => void;
  loading?: boolean;

  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  sortKey?: keyof T | null;
  sortDir?: "asc" | "desc" | null;
  onSort?: (key: keyof T, dir: "asc" | "desc") => void;

  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onCreate?: () => void;

  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  height?: string;

  showRowNumbers?: boolean;

  getDeleteLabel?: (row: T) => string;
};

export default function DataTable<T extends { id?: number }>({
  data,
  columns,
  searchableKey,
  serverSide,
  query,
  onQueryChange,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  sortKey,
  sortDir,
  onSort,
  onView,
  onEdit,
  onDelete,
  onCreate,
  containerClassName,
  containerStyle,
  height,
  getDeleteLabel,
  showRowNumbers = true,
}: Props<T>) {
  const [internalQuery, setInternalQuery] = useState("");
  const [deleteRow, setDeleteRow] = useState<T | null>(null);

  const [internalPage, setInternalPage] = useState(page ?? 1);
  const [internalPageSize, setInternalPageSize] = useState(pageSize ?? 10);

  const [internalSortKey, setInternalSortKey] = useState<keyof T | null>(sortKey ?? null);
  const [internalSortDir, setInternalSortDir] = useState<"asc" | "desc" | null>(
    sortDir ?? null
  );
const [showSpinner, setShowSpinner] = useState(false);

useEffect(() => {
  if (!loading) {
    setShowSpinner(false);
    return;
  }
  const t = setTimeout(() => setShowSpinner(true), 200);
  return () => clearTimeout(t);
}, [loading]);
  const [openRow, setOpenRow] = useState<number | null>(null);

  useEffect(() => {
    if (page !== undefined) setInternalPage(page);
  }, [page]);

  useEffect(() => {
    if (pageSize !== undefined) setInternalPageSize(pageSize);
  }, [pageSize]);

  useEffect(() => {
    setInternalSortKey(sortKey ?? null);
    setInternalSortDir(sortDir ?? null);
  }, [sortKey, sortDir]);

  const effectiveQuery = query !== undefined ? query : internalQuery;

  useEffect(() => {
    if (serverSide) return;
    setInternalPage(1);
  }, [effectiveQuery, serverSide]);

  const baseFiltered = useMemo(() => {
    if (!searchableKey) return data;
    if (serverSide) return data;

    const q = effectiveQuery.trim().toLowerCase();
    if (!q) return data;

    return data.filter((item) =>
      String(item[searchableKey] ?? "").toLowerCase().includes(q)
    );
  }, [data, searchableKey, serverSide, effectiveQuery]);

  const sorted = useMemo(() => {
    if (!internalSortKey || !internalSortDir) return baseFiltered;

    const copy = [...baseFiltered];
    copy.sort((a: T, b: T) => {
      const av = a[internalSortKey];
      const bv = b[internalSortKey];
      const sa = String(av ?? "");
      const sb = String(bv ?? "");
      if (sa < sb) return internalSortDir === "asc" ? -1 : 1;
      if (sa > sb) return internalSortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [baseFiltered, internalSortKey, internalSortDir]);

  const totalItems = total ?? sorted.length;
  const pageSizeInternal = pageSize ?? internalPageSize;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSizeInternal));
  const currentPage = page ?? internalPage;

  const pageStart = (currentPage - 1) * pageSizeInternal;
  const pageData = sorted.slice(pageStart, pageStart + pageSizeInternal);

  const handlePageChange = (p: number) => {
    if (onPageChange) return onPageChange(p);
    setInternalPage(p);
  };

  const handlePageSizeChange = (s: number) => {
    if (onPageSizeChange) return onPageSizeChange(s);
    setInternalPageSize(s);
    setInternalPage(1);
  };

  const handleSortToggle = (key: keyof T, sortable?: boolean) => {
    if (!sortable) return;
    const nextDir =
      internalSortKey !== key ? "asc" : internalSortDir === "asc" ? "desc" : "asc";

    if (onSort) return onSort(key, nextDir);
    setInternalSortKey(key);
    setInternalSortDir(nextDir);
  };

  const deleteLabel = useMemo<string | undefined>(() => {
    if (!deleteRow) return undefined;

    if (getDeleteLabel) {
      try {
        const v = getDeleteLabel(deleteRow);
        return v ? String(v) : undefined;
      } catch {
        return undefined;
      }
    }

    const rowAny = deleteRow as any;
    const keys = [
      searchableKey ? String(searchableKey) : undefined,
      columns?.[0]?.key ? String(columns[0].key) : undefined,
      "name",
      "title",
      "customer",
      "email",
      "id",
    ].filter(Boolean) as string[];

    for (const k of keys) {
      const v = rowAny?.[k];
      if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
    }

    return undefined;
  }, [deleteRow, getDeleteLabel, searchableKey, columns]);

  return (
    <div className="w-full space-y-4">
      
      {/* Desktop-only header actions (keep your original) */}
      <div className="hidden sm:flex items-center justify-between gap-3">
        {searchableKey && (
          <div
            className="
              flex items-center gap-2 max-w-sm
              bg-[color:var(--card-bg)]
              border border-[color:var(--glass-border)]
              rounded-xl px-3 py-2
              shadow-sm
            "
          >
            <Search size={16} className="text-[color:var(--muted)]" />
            <input
              value={effectiveQuery}
              onChange={(e) => {
                const v = e.target.value;
                if (onQueryChange) return onQueryChange(v);
                setInternalQuery(v);
              }}
              placeholder={`Search by ${String(searchableKey)}...`}
              className="
                w-full bg-transparent outline-none text-sm
                text-[color:var(--foreground)]
                placeholder:text-[color:var(--muted)]
              "
            />
          </div>
        )}

        {onCreate && (
          <button
            onClick={onCreate}
            className="
              btn-primary ml-auto
              px-4 py-2 rounded-xl text-sm font-medium
              shadow-md hover:opacity-90 active:scale-95
              transition-all
            "
          >
            New
          </button>
        )}
      </div>

      {/* Table container */}
      <div
        className={`
          glass-soft rounded-2xl
          border border-[color:var(--glass-border)]
          shadow-[0_4px_20px_rgba(0,0,0,0.08)]
          overflow-hidden relative flex flex-col min-h-0
          ${containerClassName ?? ""}
        `}
        style={{
          ...(containerStyle ?? {}),
          ...(height ? { height } : { height: "60vh" }),
        }}
      >
        {loading && (
          <div
            className="
              absolute inset-0
              bg-white/60 dark:bg-slate-900/60
              backdrop-blur-sm
              flex items-center justify-center
              z-40
            "
          >
            <div className="h-8 w-8 border-4 border-t-transparent border-[color:var(--primary)] rounded-full animate-spin" />
          </div>
        )}

        <ConfirmModal
          open={!!deleteRow}
          title="Delete item?"
          description="This action cannot be undone."
          itemLabel={deleteLabel}
          onCancel={() => setDeleteRow(null)}
          onConfirm={() => {
            if (deleteRow) onDelete?.(deleteRow);
            setDeleteRow(null);
          }}
        />

        {/* ✅ Mobile sticky header (INSIDE the container so sticky works) */}
        <div
          className="
            sm:hidden
            sticky top-0 z-30
            bg-[color:var(--card-bg)]
            backdrop-blur-md
            border-b border-[color:var(--glass-border)]
            px-4 py-3
          "
        >
          <div className="flex items-center gap-3">
            {searchableKey && (
              <div
                className="
                  flex items-center gap-2 w-full
                  border border-[color:var(--glass-border)]
                  rounded-xl px-3 py-2
                "
              >
                <Search size={16} className="text-[color:var(--muted)]" />
                <input
                  value={effectiveQuery}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (onQueryChange) return onQueryChange(v);
                    setInternalQuery(v);
                  }}
                  placeholder={`Search by ${String(searchableKey)}...`}
                  className="w-full bg-transparent outline-none text-sm text-[color:var(--foreground)]"
                />
              </div>
            )}

            {onCreate && (
              <button
                onClick={onCreate}
                className="btn-primary px-4 py-2 rounded-xl text-sm font-medium"
              >
                New
              </button>
            )}
          </div>
        </div>

        {/* ✅ Mobile cards (SCROLL AREA) */}
        <div className="block sm:hidden flex-1 overflow-y-auto min-h-0 pt-4 px-1 divide-y divide-white/10">
          {pageData.length === 0 && (
            <EmptyState title="No results" description="Try adjusting your search or filters." />
          )}

          {pageData.map((row, i) => {
            const rowNumber = pageStart + i + 1;
            const key = row.id ?? i;
            const isOpen = openRow === key;

            return (
              <SwipeCard key={key} onView={() => onView?.(row)} onDelete={() => setDeleteRow(row)}>
                <div className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      {showRowNumbers && (
                        <p className="text-xs text-[color:var(--muted)]">No. {rowNumber}</p>
                      )}

                      <p className="text-sm font-medium text-[color:var(--foreground)]">
                        {columns[0].render
                          ? columns[0].render(row)
                          : String(row[columns[0].key] ?? "")}
                      </p>
                    </div>

                    {/* ✅ toggle ONLY by triangle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenRow(isOpen ? null : key);
                      }}
                      className={`
                        cursor-pointer p-2 -mr-2
                        transition-transform duration-300
                        ${isOpen ? "rotate-180" : "rotate-0"}
                        text-[color:var(--muted)]
                      `}
                      aria-label="Toggle row details"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Expandable content */}
                  <div
                    className={`
                      overflow-hidden transition-all duration-300
                      ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                    `}
                  >
                    <div className="pt-3 space-y-3">
                      {columns.slice(1).map((col) => (
                        <div key={String(col.key)}>
                          <p className="text-xs text-[color:var(--muted)]">{col.label}</p>
                          <p className="text-sm font-medium text-[color:var(--foreground)]">
                            {col.render ? col.render(row) : String(row[col.key] ?? "")}
                          </p>
                        </div>
                      ))}

                      {/* Actions */}
                      <div className="flex items-center gap-4 pt-2">
                        {onView && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(row);
                            }}
                            className="text-[color:var(--primary)] text-sm"
                          >
                            View
                          </button>
                        )}

                        {onEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(row);
                            }}
                            className="text-yellow-500 text-sm"
                          >
                            Edit
                          </button>
                        )}

                        {onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteRow(row);
                            }}
                            className="text-red-500 text-sm"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SwipeCard>
            );
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto overflow-y-auto flex-1 min-h-0 pt-0">
          <table className="w-full min-w-full text-sm table-auto">
            <thead
              className="
                bg-[color:var(--card-bg)]
                border-b border-[color:var(--glass-border)]
                sticky top-0 z-10 
                backdrop-blur-md  
                mt-0
              "
            >
              <tr>
                {showRowNumbers && (
                  <th className="px-4 py-3 font-medium text-left text-[color:var(--muted)]">#</th>
                )}

                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={`
                      px-4 py-3 font-medium whitespace-nowrap
                      text-[color:var(--muted)]
                      ${col.align === "right" ? "text-right" : "text-left"}
                      ${col.sortable ? "cursor-pointer hover:text-[color:var(--foreground)]" : ""}
                    `}
                    onClick={() => handleSortToggle(col.key, !!col.sortable)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{col.label}</span>
                      {col.sortable && (
                        <span className="text-xs text-[color:var(--muted)]">
                          {internalSortKey === col.key
                            ? internalSortDir === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}

                {(onView || onEdit || onDelete) && (
                  <th className="px-4 py-3 text-right text-[color:var(--muted)]">Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (onView || onEdit || onDelete ? 1 : 0) +
                      (showRowNumbers ? 1 : 0)
                    }
                  >
                    <EmptyState title="No data available" description="Once data is added, it will appear here." />
                  </td>
                </tr>
              ) : (
                pageData.map((row, i) => (
                  <tr key={row.id ?? i} className="transition-all duration-200 hover:bg-white/5">
                    {showRowNumbers && (
                      <td className="px-4 py-3 text-[color:var(--foreground)]">{pageStart + i + 1}</td>
                    )}

                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className={`
                          px-4 py-3 text-[color:var(--foreground)]
                          ${col.align === "right" ? "text-right" : "text-left"}
                        `}
                      >
                        {col.render ? col.render(row) : String(row[col.key] ?? "")}
                      </td>
                    ))}

                    {(onView || onEdit || onDelete) && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {onView && (
                            <Tooltip label="View" side="top">
                              <button
                                onClick={() => onView(row)}
                                className="cursor-pointer text-[color:var(--primary)] p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition"
                                aria-label="View"
                              >
                                <Eye size={18} />
                              </button>
                            </Tooltip>
                          )}

                          {onEdit && (
                            <Tooltip label="Edit" side="top">
                              <button
                                onClick={() => onEdit(row)}
                                className="cursor-pointer text-yellow-500 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition"
                                aria-label="Edit"
                              >
                                <Pencil size={18} />
                              </button>
                            </Tooltip>
                          )}

                          {onDelete && (
                            <Tooltip label="Delete" side="top">
                              <button
                                onClick={() => setDeleteRow(row)}
                                className="cursor-pointer text-red-500 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition"
                                aria-label="Delete"
                              >
                                <Trash size={18} />
                              </button>
                            </Tooltip>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="
            px-4 py-3 border-t border-[color:var(--glass-border)]
            text-xs text-[color:var(--muted)]
            flex items-center justify-between
            bg-[color:var(--card-bg)]
          "
        >
          <div>Showing {pageData.length} of {totalItems}</div>

          <div className="flex items-center gap-2">
            <select
              value={pageSizeInternal}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="
                bg-transparent border border-[color:var(--glass-border)]
                rounded px-2 py-1 text-sm
                text-[color:var(--foreground)]
              "
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-all"
            >
              Prev
            </button>

            <span className="px-2 text-[color:var(--foreground)]">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

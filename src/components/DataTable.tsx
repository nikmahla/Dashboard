"use client";

import { useMemo, useState, useEffect } from "react";
import { Eye, Pencil, Trash, MoreHorizontal } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import EmptyState from "./EmptyState";
import Tooltip from "./Tooltip";
import SearchField from "@/components/ui/SearchField";
import { TableSkeleton, MobileTableSkeleton } from "@/components/ui/TableSkeleton";
import {
  getColumnAlign,
  getColumnWidthKind,
  columnWidthClass,
  headerAlignClass,
  headerFlexClass,
} from "@/lib/table-utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ui, cn } from "@/lib/ui";

export type Column<T extends Record<string, unknown>> = {
  key: keyof T;
  label: string;
  align?: "left" | "right";
  /** Force right-align for numeric comparison */
  numeric?: boolean;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

type Props<T extends Record<string, unknown>> = {
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
  entityLabel?: string;
  deleteTitle?: string;
  deleteDescription?: string;
};

function RowActions<T>({
  row,
  onView,
  onEdit,
  onDelete,
  onDeleteClick,
}: {
  row: T;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onDeleteClick: (row: T) => void;
}) {
  const hasActions = onView || onEdit || onDelete;
  if (!hasActions) return null;

  return (
    <div className="data-table-actions">
      {onView && (
        <Tooltip label="View" side="top">
          <button
            type="button"
            onClick={() => onView(row)}
            className="data-table-action data-table-action--view"
            aria-label="View row details"
          >
            <Eye size={17} />
          </button>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip label="Edit" side="top">
          <button
            type="button"
            onClick={() => onEdit(row)}
            className="data-table-action data-table-action--edit"
            aria-label="Edit row"
          >
            <Pencil size={17} />
          </button>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip label="Delete" side="top">
          <button
            type="button"
            onClick={() => onDeleteClick(row)}
            className="data-table-action data-table-action--delete"
            aria-label="Delete row"
          >
            <Trash size={17} />
          </button>
        </Tooltip>
      )}
    </div>
  );
}

function MobileRowCard<T extends Record<string, unknown> & { id?: number }>({
  row,
  rowNumber,
  columns,
  columnAligns,
  showRowNumbers,
  onView,
  onEdit,
  onDelete,
  onDeleteClick,
}: {
  row: T;
  rowNumber: number;
  columns: Column<T>[];
  columnAligns: Map<string, "left" | "right">;
  showRowNumbers: boolean;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onDeleteClick: (row: T) => void;
}) {
  const primary = columns[0];
  const hasActions = onView || onEdit || onDelete;

  return (
    <article
      className="data-table-mobile-card p-4 space-y-3"
      aria-label={`Row ${rowNumber}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {showRowNumbers && (
            <p className="text-[10px] font-medium uppercase tracking-wide text-[color:var(--muted)]">
              #{rowNumber}
            </p>
          )}
          <p className="text-sm font-semibold text-[color:var(--foreground)] truncate">
            {primary.render
              ? primary.render(row)
              : String(row[primary.key] ?? "")}
          </p>
        </div>
        {hasActions && (
          <div className="flex shrink-0 items-center gap-0.5" aria-label="Actions">
            <RowActions
              row={row}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onDeleteClick={onDeleteClick}
            />
          </div>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        {columns.slice(1).map((col) => {
          const align = columnAligns.get(String(col.key)) ?? "left";
          return (
            <div
              key={String(col.key)}
              className={cn(align === "right" && "col-span-2 text-right sm:col-span-1")}
            >
              <dt className="text-[10px] font-medium uppercase tracking-wide text-[color:var(--muted)]">
                {col.label}
              </dt>
              <dd
                className={cn(
                  "mt-0.5 text-sm text-[color:var(--foreground)]",
                  align === "right" && "tabular-nums font-medium"
                )}
              >
                {col.render ? col.render(row) : String(row[col.key] ?? "")}
              </dd>
            </div>
          );
        })}
      </dl>
    </article>
  );
}

export default function DataTable<T extends Record<string, unknown> & { id?: number }>({
  data,
  columns,
  searchableKey,
  serverSide,
  query,
  onQueryChange,
  loading = false,
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
  entityLabel = "Item",
  deleteTitle = "Delete item?",
  deleteDescription = "This action cannot be undone. The item will be permanently removed.",
  showRowNumbers = true,
}: Props<T>) {
  const [internalQuery, setInternalQuery] = useState("");
  const [deleteRow, setDeleteRow] = useState<T | null>(null);
  const [internalPage, setInternalPage] = useState(page ?? 1);
  const [internalPageSize, setInternalPageSize] = useState(pageSize ?? 10);
  const [internalSortKey, setInternalSortKey] = useState<keyof T | null>(sortKey ?? null);
  const [internalSortDir, setInternalSortDir] = useState<"asc" | "desc" | null>(sortDir ?? null);

  const hasRowActions = !!(onView || onEdit || onDelete);
  const isMobile = useMediaQuery("(max-width: 639px)");

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
    copy.sort((a, b) => {
      const av = a[internalSortKey];
      const bv = b[internalSortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return internalSortDir === "asc" ? av - bv : bv - av;
      }
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

  const columnAligns = useMemo(() => {
    const map = new Map<string, "left" | "right">();
    const sample = pageData[0] ?? data[0];
    for (const col of columns) {
      const value = sample ? sample[col.key] : undefined;
      map.set(String(col.key), getColumnAlign(col, value));
    }
    return map;
  }, [columns, pageData, data]);

  const skeletonRows = Math.min(pageSizeInternal, 6);

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
    const rowAny = deleteRow as Record<string, unknown>;
    const keys = [
      searchableKey ? String(searchableKey) : undefined,
      columns[0]?.key ? String(columns[0].key) : undefined,
      "name",
      "title",
      "customer",
      "email",
    ].filter(Boolean) as string[];
    for (const k of keys) {
      const v = rowAny[k];
      if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
    }
    return undefined;
  }, [deleteRow, getDeleteLabel, searchableKey, columns]);

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {searchableKey && (
        <SearchField
          className="w-full max-w-xl flex-1 min-w-[220px]"
          value={effectiveQuery}
          onChange={(v) => {
            if (onQueryChange) return onQueryChange(v);
            setInternalQuery(v);
          }}
          placeholder={`Search ${String(searchableKey)}…`}
        />
      )}
      {onCreate && (
        <button type="button" onClick={onCreate} className="btn-primary ml-auto px-4 py-2 text-sm font-medium shrink-0">
          New
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {!isMobile && <div>{toolbar}</div>}

      <div
        className={cn(ui.table.shell, containerClassName)}
        style={{
          ...(containerStyle ?? {}),
          ...(height ? { height } : { height: "60vh" }),
        }}
      >
        <ConfirmModal
          open={!!deleteRow}
          title={deleteTitle}
          description={deleteDescription}
          entityLabel={entityLabel}
          itemName={deleteLabel}
          onCancel={() => setDeleteRow(null)}
          onConfirm={() => {
            if (deleteRow) onDelete?.(deleteRow);
            setDeleteRow(null);
          }}
        />

        {isMobile && (
          <div className="sticky top-0 z-30 shrink-0 border-b border-[color:var(--table-row-border)] bg-[color:var(--card-bg)] px-3 py-3 backdrop-blur-md">
            {toolbar}
          </div>
        )}

        {isMobile ? (
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
          {loading ? (
            <MobileTableSkeleton rows={skeletonRows} />
          ) : pageData.length === 0 ? (
            <EmptyState title="No results" description="Try adjusting your search or filters." />
          ) : (
            pageData.map((row, i) => (
              <MobileRowCard
                key={row.id ?? i}
                row={row}
                rowNumber={pageStart + i + 1}
                columns={columns}
                columnAligns={columnAligns}
                showRowNumbers={showRowNumbers}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onDeleteClick={setDeleteRow}
              />
            ))
          )}
        </div>
        ) : (
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
          <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0">
            {loading ? (
              <TableSkeleton
                rows={skeletonRows}
                columns={columns.length}
                showActions={hasRowActions}
                showRowNumbers={showRowNumbers}
              />
            ) : (
              <table className={ui.table.table}>
                <colgroup>
                  {showRowNumbers && (
                    <col className={columnWidthClass("index")} />
                  )}
                  {columns.map((col, colIndex) => {
                    const align =
                      columnAligns.get(String(col.key)) ??
                      getColumnAlign(col, undefined);
                    const kind = getColumnWidthKind(col, colIndex, align);
                    return (
                      <col
                        key={String(col.key)}
                        className={columnWidthClass(kind)}
                      />
                    );
                  })}
                  {hasRowActions && (
                    <col className={columnWidthClass("actions")} />
                  )}
                </colgroup>
                <thead className="sticky top-0 z-10 bg-[color:var(--table-head-bg)] backdrop-blur-sm">
                  <tr>
                    {showRowNumbers && (
                      <th scope="col" className={cn(headerAlignClass("right"), "tabular-nums")}>#</th>
                    )}
                    {columns.map((col, colIndex) => {
                      const align =
                        columnAligns.get(String(col.key)) ??
                        getColumnAlign(col, undefined);
                      const isSortable = !!col.sortable;
                      const isSorted = internalSortKey === col.key;
                      const sortSymbol = isSorted
                        ? internalSortDir === "asc"
                          ? "▲"
                          : "▼"
                        : "↕";
                      const ariaSort = !isSortable
                        ? "none"
                        : isSorted
                          ? internalSortDir === "asc"
                            ? "ascending"
                            : "descending"
                          : "none";
                      return (
                        <th
                          key={String(col.key)}
                          scope="col"
                          aria-sort={ariaSort}
                          className={cn(
                            headerAlignClass(align)
                          )}
                        >
                          {isSortable ? (
                            <button
                              type="button"
                              onClick={() => handleSortToggle(col.key, true)}
                              className={cn(
                                "group inline-flex w-full select-none items-center gap-1.5 rounded-md px-0.5 py-0.5 hover:text-[color:var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]",
                                headerFlexClass(align)
                              )}
                              aria-label={`Sort by ${col.label}${isSorted ? ` (${ariaSort})` : ""}`}
                            >
                              <span>{col.label}</span>
                              <span className="text-[10px] opacity-70 group-hover:opacity-100">
                                {sortSymbol}
                              </span>
                            </button>
                          ) : (
                            <div className={cn("flex items-center gap-1.5", headerFlexClass(align))}>
                              <span>{col.label}</span>
                            </div>
                          )}
                        </th>
                      );
                    })}
                    {hasRowActions && (
                      <th className="text-right">
                        <span className="sr-only">Actions</span>
                        <MoreHorizontal size={14} className="inline opacity-40" aria-hidden />
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {pageData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={
                          columns.length + (hasRowActions ? 1 : 0) + (showRowNumbers ? 1 : 0)
                        }
                        className="!border-0 py-12"
                      >
                        <EmptyState
                          title="No data available"
                          description="Once data is added, it will appear here."
                        />
                      </td>
                    </tr>
                  ) : (
                    pageData.map((row, i) => (
                      <tr
                        key={row.id ?? i}
                        className={cn(
                          "data-table-row",
                          i % 2 === 0
                            ? "bg-[color:var(--table-zebra-odd)]"
                            : "bg-[color:var(--table-zebra-even)]"
                        )}
                      >
                        {showRowNumbers && (
                          <td className="tabular-nums text-right text-[color:var(--muted)] text-xs">
                            {pageStart + i + 1}
                          </td>
                        )}
                        {columns.map((col) => {
                          const align =
                            columnAligns.get(String(col.key)) ??
                            getColumnAlign(col, row[col.key]);
                          return (
                            <td
                              key={String(col.key)}
                              className={cn(
                                headerAlignClass(align),
                                align === "right" && "tabular-nums font-medium",
                                "truncate max-w-0"
                              )}
                              title={
                                col.render
                                  ? undefined
                                  : String(row[col.key] ?? "")
                              }
                            >
                              <span className="block truncate">
                                {col.render ? col.render(row) : String(row[col.key] ?? "")}
                              </span>
                            </td>
                          );
                        })}
                        {hasRowActions && (
                          <td className="text-right">
                            <RowActions
                              row={row}
                              onView={onView}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              onDeleteClick={setDeleteRow}
                            />
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
        )}

        {/* Footer */}
        <div
          className={cn(
            ui.table.footer,
            "px-4 py-3 text-xs text-[color:var(--muted)] flex flex-wrap items-center justify-between gap-3 shrink-0"
          )}
        >
          <div>
            {loading ? (
              <span className="animate-pulse">Loading…</span>
            ) : (
              <>
                Showing{" "}
                <span className="font-medium text-[color:var(--foreground)]">{pageData.length}</span> of{" "}
                <span className="font-medium text-[color:var(--foreground)]">{totalItems}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={pageSizeInternal}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              disabled={loading}
              className="input !w-auto py-1.5 px-2 text-sm"
              aria-label="Rows per page"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
            <button
              type="button"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1 || loading}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium border border-[color:var(--glass-border)]",
                "text-[color:var(--foreground)] hover:bg-[var(--primary-soft)]",
                "disabled:opacity-40 disabled:pointer-events-none transition-colors"
              )}
            >
              Prev
            </button>
            <span className="min-w-[4rem] text-center tabular-nums text-[color:var(--foreground)]">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages || loading}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium border border-[color:var(--glass-border)]",
                "text-[color:var(--foreground)] hover:bg-[var(--primary-soft)]",
                "disabled:opacity-40 disabled:pointer-events-none transition-colors"
              )}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

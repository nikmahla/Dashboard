'use client';

import { cn } from '@/lib/ui';

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
  showActions?: boolean;
  showRowNumbers?: boolean;
  className?: string;
};

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-md bg-[color:var(--table-row-border)] animate-pulse',
        className
      )}
      aria-hidden
    />
  );
}

/** Desktop table skeleton */
export function TableSkeleton({
  rows = 6,
  columns = 4,
  showActions = true,
  showRowNumbers = true,
  className,
}: TableSkeletonProps) {
  const colCount =
    columns + (showRowNumbers ? 1 : 0) + (showActions ? 1 : 0);

  return (
    <div className={cn('w-full', className)} role="status" aria-label="Loading table data">
      <table className="data-table min-w-full">
        <thead>
          <tr>
            {Array.from({ length: colCount }).map((_, i) => (
              <th key={i}>
                <Shimmer className="mx-auto h-3 w-16 max-w-full" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="data-table-row">
              {Array.from({ length: colCount }).map((_, colIdx) => (
                <td key={colIdx}>
                  <Shimmer
                    className={cn(
                      'h-4',
                      colIdx === colCount - 1 && showActions ? 'w-20 ml-auto' : 'w-full max-w-[140px]',
                      colIdx > 0 && colIdx < colCount - 1 && 'max-w-[100px]'
                    )}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/** Mobile card skeleton */
export function MobileTableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-2" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-[color:var(--table-row-border)] bg-[color:var(--card-bg)] p-4 space-y-3"
        >
          <Shimmer className="h-4 w-[70%]" />
          <Shimmer className="h-3 w-full" />
          <Shimmer className="h-3 w-[85%]" />
          <div className="flex gap-2 pt-1">
            <Shimmer className="h-8 w-16" />
            <Shimmer className="h-8 w-16" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

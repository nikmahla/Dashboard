'use client';

import Section from '@/components/dashboard/Section';
import StatusBadge from '@/components/ui/StatusBadge';
import { useDashboardSummary } from '@/hooks/useDashboard';
import { LOW_STOCK_LIMIT } from '@/lib/dashboard-summary-constants';

export default function LowStockList() {
  const { data } = useDashboardSummary();
  const items = data?.lowStock ?? [];

  return (
    <Section
      title="Needs restocking"
      description={`Fewer than ${LOW_STOCK_LIMIT} units left`}
      action={{ href: '/admin/inventory', label: 'View inventory' }}
      flush
    >
      {items.length === 0 ? (
        <p className="px-5 pb-5 text-sm text-[color:var(--muted)]">Everything is stocked. Nothing to reorder.</p>
      ) : (
        <ul className="divide-y divide-[color:var(--border-muted)] border-t border-[color:var(--border-muted)]">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[color:var(--foreground)]">{item.name}</p>
                <p className="text-xs text-[color:var(--muted)]">{item.sku}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm font-semibold tabular-nums text-[color:var(--foreground)]">{item.stock} left</span>
                <StatusBadge status="Low" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

'use client';

import Section from '@/components/dashboard/Section';
import StatusBadge from '@/components/ui/StatusBadge';
import { useDashboardSummary } from '@/hooks/useDashboard';
import { money, shortDate } from '@/lib/format';

const SEGMENT_COLOR: Record<string, string> = {
  Completed: 'var(--success)',
  Pending: 'var(--warning)',
  Cancelled: 'var(--danger)',
};

export default function RecentOrders() {
  const { data } = useDashboardSummary();
  const orders = data?.recentOrders ?? [];
  const byStatus = data?.ordersByStatus ?? [];
  const total = byStatus.reduce((s, x) => s + x.count, 0);

  return (
    <Section title="Recent orders" action={{ href: '/admin/orders', label: 'View all orders' }} flush>
      {total > 0 && (
        <div className="px-5 pb-4">
          <div className="flex h-2 overflow-hidden rounded-full bg-[color:var(--border-muted)]" role="img"
            aria-label={byStatus.map((s) => `${s.count} ${s.status.toLowerCase()}`).join(', ')}>
            {byStatus.map((s) => (
              <span key={s.status} style={{ width: `${(s.count / total) * 100}%`, background: SEGMENT_COLOR[s.status] }} />
            ))}
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[color:var(--muted)]">
            {byStatus.map((s) => (
              <li key={s.status} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: SEGMENT_COLOR[s.status] }} aria-hidden />
                {s.status} <span className="font-semibold tabular-nums text-[color:var(--foreground)]">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-x-auto border-t border-[color:var(--border-muted)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-[color:var(--muted)]">
              <th scope="col" className="px-5 py-2.5">Customer</th>
              <th scope="col" className="hidden px-3 py-2.5 sm:table-cell">Date</th>
              <th scope="col" className="px-3 py-2.5">Status</th>
              <th scope="col" className="px-5 py-2.5 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-[color:var(--border-muted)]">
                <td className="px-5 py-2.5 font-medium text-[color:var(--foreground)]">{o.customer}</td>
                <td className="hidden whitespace-nowrap px-3 py-2.5 text-[color:var(--muted)] sm:table-cell">{shortDate(o.date)}</td>
                <td className="px-3 py-2.5"><StatusBadge status={o.status} /></td>
                <td className="px-5 py-2.5 text-right font-medium tabular-nums">{money(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

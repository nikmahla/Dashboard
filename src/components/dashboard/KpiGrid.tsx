'use client';

import { Banknote, Receipt, Users, PackageMinus } from 'lucide-react';
import KpiCard from '@/components/KpiCard';
import Panel from '@/components/ui/Panel';
import { useDashboardSummary } from '@/hooks/useDashboard';
import { LOW_STOCK_LIMIT } from '@/lib/dashboard-summary-constants';
import { money, pctChange } from '@/lib/format';
import { ui } from '@/lib/ui';

const icon = { size: ui.icon.md, strokeWidth: 1.75, 'aria-hidden': true } as const;

export default function KpiGrid() {
  const { data, isLoading, isError } = useDashboardSummary();
  const days = data?.days ?? 30;

  if (isError) {
    return (
      <Panel className="p-5 text-sm text-[color:var(--muted)]">
        Could not load the numbers. Refresh the page to try again.
      </Panel>
    );
  }

  if (isLoading || !data) {
    return (
      <Panel className="grid animate-pulse grid-cols-1 gap-px overflow-hidden bg-[color:var(--border-default)] sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[132px] bg-[color:var(--card-bg)]" />
        ))}
      </Panel>
    );
  }

  const { revenue, orders, customers, lowStock } = data.kpis;
  const tone = (pct: number | null) => (pct === null || pct === 0 ? 'flat' : pct > 0 ? 'good' : 'bad') as 'good' | 'bad' | 'flat';
  const revenuePct = pctChange(revenue.value, revenue.previous);
  const ordersPct = pctChange(orders.value, orders.previous);

  return (
    <Panel className="overflow-hidden">
      <section
        aria-label="Key numbers"
        className="grid grid-cols-1 gap-px bg-[color:var(--border-default)] sm:grid-cols-2 xl:grid-cols-4 [&>article]:bg-[color:var(--card-bg)]"
      >
        <KpiCard
          label={`Revenue, ${days} days`}
          value={revenue.value}
          valueText={money(revenue.value)}
          icon={<Banknote {...icon} />}
          color="blue"
          trend={revenue.spark}
          delta={{ pct: revenuePct, tone: tone(revenuePct), caption: `vs prior ${days} days` }}
        />
        <KpiCard
          label={`Orders, ${days} days`}
          value={orders.value}
          icon={<Receipt {...icon} />}
          color="blue"
          trend={orders.spark}
          delta={{ pct: ordersPct, tone: tone(ordersPct), caption: `vs prior ${days} days` }}
        />
        <KpiCard
          label="Customers"
          value={customers.value}
          icon={<Users {...icon} />}
          color="blue"
          showTrend={false}
          note="All time"
        />
        <KpiCard
          label="Low stock items"
          value={lowStock.value}
          icon={<PackageMinus {...icon} />}
          color="orange"
          showTrend={false}
          note={`Fewer than ${LOW_STOCK_LIMIT} units left`}
        />
      </section>
    </Panel>
  );
}

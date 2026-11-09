'use client';

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Section from '@/components/dashboard/Section';
import { useDashboardSummary } from '@/hooks/useDashboard';
import { money, moneyCompact } from '@/lib/format';
import { ui } from '@/lib/ui';

type Point = { label: string; revenue: number; orders: number };

function RevenueTooltip({ active, payload }: { active?: boolean; payload?: { payload: Point }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div role="tooltip" className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--card-bg)] px-3 py-2 text-sm shadow-[var(--shadow-md)]">
      <p className="font-semibold text-[color:var(--foreground)]">{p.label}</p>
      <p className="tabular-nums text-[color:var(--foreground)]">{money(p.revenue)}</p>
      <p className="text-xs text-[color:var(--muted)]">{p.orders} orders</p>
    </div>
  );
}

export default function RevenueChart() {
  const { data } = useDashboardSummary();
  const points = data?.trend ?? [];
  const last = points.length - 1;

  return (
    <Section
      title="Revenue"
      description={`Completed orders, ${data?.bucketDays === 1 ? 'per day' : `per ${data?.bucketDays ?? 5} days`}. The latest bar is still in progress.`}
    >
      <div className={ui.chart.height} role="img" aria-label={`Bar chart of revenue for the last ${data?.days ?? 30} days`}>
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 480, height: 240 }}>
          <BarChart data={points} margin={{ top: 8, right: 0, left: 0, bottom: 0 }} barCategoryGap="28%">
            <CartesianGrid stroke={ui.chart.gridStroke} vertical={false} />
            <XAxis dataKey="label" tick={ui.chart.axisTick} tickLine={false} axisLine={false} />
            <YAxis tick={ui.chart.axisTick} tickLine={false} axisLine={false} width={48} tickFormatter={moneyCompact} />
            <Tooltip content={<RevenueTooltip />} cursor={{ fill: 'var(--surface-hover)' }} />
            <Bar dataKey="revenue" radius={[3, 3, 0, 0]} isAnimationActive={false}>
              {points.map((_, i) => (
                <Cell key={i} fill="var(--primary)" fillOpacity={i === last ? 0.45 : 1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Section>
  );
}

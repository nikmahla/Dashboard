'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Section from '@/components/dashboard/Section';
import { useDashboardSummary } from '@/hooks/useDashboard';
import { ui } from '@/lib/ui';

export default function StockChart() {
  const { data } = useDashboardSummary();
  const rows = data?.stockByCategory ?? [];

  return (
    <Section title="Units in stock" description="By category">
      <div className="h-full min-h-[220px]" role="img" aria-label={`Units in stock: ${rows.map((r) => `${r.name} ${r.units}`).join(', ')}`}>
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 480, height: 240 }}>
          <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 32, left: 0, bottom: 0 }} barCategoryGap="30%">
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" tick={ui.chart.axisTick} tickLine={false} axisLine={false} width={86} />
            <Tooltip cursor={{ fill: 'var(--surface-hover)' }}
              formatter={(v) => [`${v} units`, 'In stock']}
              contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 13 }} />
            <Bar dataKey="units" fill="var(--primary)" maxBarSize={28} radius={[0, 3, 3, 0]} isAnimationActive={false} label={{ position: 'right', fill: 'var(--foreground)', fontSize: 12 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Section>
  );
}

'use client';

import { useMemo, type ReactNode } from 'react';
import KpiChart from '@/components/KpiChart';
import Panel from '@/components/ui/Panel';
import { kpiColors, ui, cn, type KpiColor } from '@/lib/ui';

type KpiCardProps = {
  label: string;
  value: number;
  icon: ReactNode;
  trend?: number[];
  color?: KpiColor;
};

function buildFallbackTrend(base: number, points = 8): number[] {
  const out: number[] = [];
  const scale = Math.max(1, Math.round(Math.abs(base) / 50));

  for (let i = 0; i < points; i++) {
    const jitter = (Math.sin(i * 1.3) + 0.3) * scale;
    out.push(Math.max(0, Math.round(base - scale * 3 + jitter)));
  }

  return out;
}

export default function KpiCard({
  label,
  value,
  icon,
  trend,
  color = 'purple',
}: KpiCardProps) {
  const palette = kpiColors[color];
  const chartData = useMemo(
    () => (trend?.length ? trend : buildFallbackTrend(value)),
    [trend, value]
  );

  return (
    <Panel
      hover
      className={cn(
        ui.spacing.cardPadding,
        'hover:-translate-y-0.5 transition-transform duration-200'
      )}
    >
      <article aria-label={`${label}: ${value.toLocaleString()}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={ui.typography.label}>{label}</p>
            <p className={cn(ui.typography.value, palette.value)}>
              {value.toLocaleString()}
            </p>
          </div>

          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center',
              ui.radius.md,
              palette.iconBg
            )}
            aria-hidden
          >
            {icon}
          </div>
        </div>

        <div className="mt-3 h-12" aria-hidden>
          <KpiChart data={chartData} color={color} />
        </div>
      </article>
    </Panel>
  );
}

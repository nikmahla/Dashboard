'use client';

import { ui } from '@/lib/ui';

type TooltipEntry = {
  name?: string;
  dataKey?: string;
  value?: number;
  color?: string;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
};

export default function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={`${ui.radius.md} glass-soft border border-[color:var(--glass-border)] p-3 text-sm shadow-[0_18px_45px_rgba(0,0,0,0.08)] min-w-[190px]`}
      role="tooltip"
    >
      {label && (
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
          {label}
        </p>
      )}

      <ul className="space-y-2">
        {payload.map((item) => (
          <li key={String(item.dataKey)} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: item.color ?? 'currentColor' }}
              />
              <span className="capitalize text-[color:var(--foreground)]">{item.name}</span>
            </div>
            <span className="font-semibold tabular-nums" style={{ color: item.color }}>
              {item.dataKey === 'revenue' ? `$${item.value?.toLocaleString()}` : item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

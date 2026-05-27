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
      className={`${ui.radius.md} glass-soft border border-[color:var(--glass-border)] p-3 text-sm shadow-md`}
      role="tooltip"
    >
      {label && (
        <p className={`mb-2 font-semibold ${ui.typography.sectionTitle}`}>{label}</p>
      )}

      <ul className={ui.spacing.stackSm}>
        {payload.map((item) => (
          <li key={String(item.dataKey)} className="flex justify-between gap-4">
            <span className="capitalize text-[color:var(--muted)]">{item.name}</span>
            <span className="font-medium tabular-nums" style={{ color: item.color }}>
              {item.dataKey === 'revenue' ? `$${item.value?.toLocaleString()}` : item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

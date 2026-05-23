'use client';

type TooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

export default function ChartTooltip({
  active,
  payload,
  label,
}: TooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-soft border p-4 text-sm rounded-lg shadow-md">
      <p className="font-semibold mb-2 text-[color:var(--foreground)]">{label}</p>

      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.dataKey} className="flex justify-between gap-4">
            <span className="capitalize text-[color:var(--muted)]">
              {item.name}
            </span>
            <span className="font-medium" style={{ color: item.color }}>
              {item.dataKey === 'revenue'
                ? `$${item.value}`
                : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

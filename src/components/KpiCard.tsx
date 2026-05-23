'use client';

import React from 'react';
import KpiChart from './KpiChart';

type Props = {
  label: string;
  value: number;
  icon: React.ReactNode;
  trend?: number[];
  color?: 'purple' | 'blue' | 'green' | 'orange';
};

const colors = {
  purple: {
    iconBg: 'bg-[var(--primary-soft)] text-[color:var(--primary)]',
    value: 'text-[color:var(--primary)]',
  },
  blue: {
    iconBg: 'bg-[var(--primary-soft)] text-[color:var(--support-a)]',
    value: 'text-[color:var(--support-a)]',
  },
  green: {
    iconBg: 'bg-[var(--teal-soft)] text-[color:var(--teal)]',
    value: 'text-[color:var(--teal)]',
  },
  orange: {
    iconBg: 'bg-[var(--primary-soft)] text-[color:var(--support-b)]',
    value: 'text-[color:var(--support-b)]',
  },
};

export default function KpiCard({
  label,
  value,
  icon,
  color = 'purple',
}: Props) {
  const c = colors[color];

  // generate a small realistic trend if none is provided
  const generateTrend = (base: number, points = 8) => {
    const out: number[] = [];
    for (let i = 0; i < points; i++) {
      // small random walk around base, scaled for magnitude
      const scale = Math.max(1, Math.round(Math.abs(base) / 50));
      const jitter = (Math.sin(i * 1.3) + Math.random() * 0.6) * scale;
      const val = Math.max(0, Math.round(base - scale * 3 + jitter));
      out.push(val);
    }
    return out;
  };

  const trend = ((): number[] => {
    if (Array.isArray((arguments as any)[0]?.trend)) return (arguments as any)[0].trend;
    return generateTrend(value);
  })();

  return (
    <div
      className="
        rounded-2xl glass-soft
        p-4 transition
        hover:-translate-y-1 hover:shadow-lg
      "
    >
      {/* Top */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[color:var(--muted)]">
            {label}
          </p>
          <p className={`text-xl font-semibold ${c.value}`}>
            {value.toLocaleString()}
          </p>
        </div>

        <div
          className={`
            h-10 w-10 rounded-xl
            flex items-center justify-center
            ${c.iconBg}
          `}
          aria-hidden
        >
          {icon}
        </div>
      </div>

      {/* Chart */}
      <div className="h-12 mt-3">
        <KpiChart data={trend} color={color} />
      </div>
    </div>
  );
}

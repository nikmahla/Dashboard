'use client';

import { LineChart, Line, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useMemo } from 'react';

type Props = {
  data?: number[];
  color?: 'purple' | 'blue' | 'green' | 'orange';
};

const chartColors: Record<string, string> = {
  purple: 'var(--primary)',
  blue: 'var(--primary-2)',
  green: 'var(--teal)',
  orange: 'var(--support-b)',
};

export default function KpiChart({ data = [], color = 'purple' }: Props) {
  const chartData = Array.isArray(data) ? data.map((v, i) => ({ i, v })) : [];
  const strokeColor = chartColors[color];

  // Create gradient ID based on color
  const gradientId = useMemo(() => `gradient-${color}-${Math.random()}`, [color]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        {/* Gradient definition */}
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.45} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Smooth filled sparkline */}
        <Area
          type="monotone"
          dataKey="v"
          stroke={strokeColor}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          fillOpacity={1}
          isAnimationActive={true}
          animationDuration={700}
        />

        {/* Optional: subtle glow line on top */}
        <Line
          type="monotone"
          dataKey="v"
          stroke={strokeColor}
          strokeWidth={2.2}
          dot={false}
          strokeOpacity={0.9}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

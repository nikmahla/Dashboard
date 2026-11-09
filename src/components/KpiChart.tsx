'use client';

import { useId, useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { kpiColors, type KpiColor } from '@/lib/ui';

type KpiChartProps = {
  data?: number[];
  color?: KpiColor;
};

export default function KpiChart({ data = [], color = 'purple' }: KpiChartProps) {
  const gradientId = useId();
  const strokeColor = kpiColors[color].stroke;

  const chartData = useMemo(
    () => (Array.isArray(data) ? data.map((v, i) => ({ i, v })) : []),
    [data]
  );

  if (chartData.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 96, height: 36 }}>
      <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.18} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={strokeColor}
          strokeWidth={1.75}
          fill={`url(#${gradientId})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

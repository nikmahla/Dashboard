'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import ChartTooltip from '@/components/ChartTooltip';
import ChartPanel from '@/components/dashboard/ChartPanel';
import { growthChartData } from '@/data/dashboard';
import { ui } from '@/lib/ui';

const legendStyle = { paddingBottom: 12, fontSize: 12, color: 'var(--muted)' };

export default function GrowthChart() {
  return (
    <ChartPanel
      title="Business growth"
      description="Orders, customers, and revenue over the last 6 months"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={[...growthChartData]} margin={ui.chart.margin}>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke={ui.chart.gridStroke}
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={ui.chart.axisTick}
            tickLine={false}
            axisLine={false}
            minTickGap={16}
          />
          <YAxis
            yAxisId="left"
            tick={ui.chart.axisTick}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(v) => `$${v / 1000}k`}
            tick={ui.chart.axisTick}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: 'var(--primary-soft)', strokeWidth: 2, fill: 'transparent' }}
          />
          <Legend
            verticalAlign="top"
            align="left"
            iconType="circle"
            iconSize={8}
            wrapperStyle={legendStyle}
          />
          <Line
            yAxisId="left"
            name="Customers"
            dataKey="customers"
            stroke="var(--teal)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            yAxisId="left"
            name="Orders"
            dataKey="orders"
            stroke="var(--primary)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            yAxisId="right"
            name="Revenue"
            dataKey="revenue"
            stroke="var(--support-b)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}

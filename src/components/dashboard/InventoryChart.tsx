'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import ChartTooltip from '@/components/ChartTooltip';
import ChartPanel from '@/components/dashboard/ChartPanel';
import { inventoryChartData } from '@/data/dashboard';
import { ui } from '@/lib/ui';

const legendStyle = { paddingBottom: 12, fontSize: 12 };
const barRadius: [number, number, number, number] = [6, 6, 0, 0];

export default function InventoryChart() {
  return (
    <ChartPanel
      title="Inventory overview"
      description="Stock on hand vs units sold by category"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={[...inventoryChartData]} margin={ui.chart.margin}>
          <CartesianGrid strokeDasharray="3 3" stroke={ui.chart.gridStroke} vertical={false} />
          <XAxis dataKey="name" tick={ui.chart.axisTick} tickLine={false} />
          <YAxis tick={ui.chart.axisTick} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--primary-soft)' }} />
          <Legend
            verticalAlign="top"
            align="left"
            iconType="circle"
            iconSize={8}
            wrapperStyle={legendStyle}
          />
          <Bar name="In stock" dataKey="stock" fill="var(--primary)" radius={barRadius} />
          <Bar name="Sold" dataKey="sold" fill="var(--teal)" radius={barRadius} />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}

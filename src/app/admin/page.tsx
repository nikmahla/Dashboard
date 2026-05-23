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
  BarChart,
  Bar,
} from 'recharts';
import {
  Users,
  ShoppingCart,
  CheckCircle,
  DollarSign,
} from 'lucide-react';
import ChartTooltip from '@/components/ChartTooltip';
import KpiCard from '@/components/KpiCard';

/* ---------------- Fake Data ---------------- */

const lineChartData = [
  { month: 'Jan', orders: 40, customers: 24, revenue: 4000 },
  { month: 'Feb', orders: 32, customers: 20, revenue: 3500 },
  { month: 'Mar', orders: 55, customers: 36, revenue: 6200 },
  { month: 'Apr', orders: 70, customers: 48, revenue: 8100 },
  { month: 'May', orders: 90, customers: 60, revenue: 10400 },
  { month: 'Jun', orders: 110, customers: 75, revenue: 13200 },
];

const barChartData = [
  { name: 'Laptops', stock: 120, sold: 80 },
  { name: 'Phones', stock: 200, sold: 150 },
  { name: 'Accessories', stock: 300, sold: 210 },
  { name: 'Monitors', stock: 80, sold: 50 },
  { name: 'Keyboards', stock: 150, sold: 100 },
];

/* ---------------- Page ---------------- */

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">
        Dashboard
      </h2>

      {/* KPI Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <KpiCard
    label="Users"
    value={1245}
    icon={<Users size={20} />}
    color="purple"
    trend={[1100, 1150, 1200, 1230, 1245, 1255, 1260, 1245]}
  />
  <KpiCard
    label="Orders"
    value={397}
    icon={<ShoppingCart size={20} />}
    color="blue"
    trend={[320, 340, 360, 380, 390, 397, 405, 410]}
  />
  <KpiCard
    label="Tasks"
    value={87}
    icon={<CheckCircle size={20} />}
    color="green"
    trend={[70, 72, 76, 80, 84, 87, 90, 88]}
  />
  <KpiCard
    label="Revenue"
    value={45300}
    icon={<DollarSign size={20} />}
    color="orange"
    trend={[30000, 32000, 36000, 40000, 42000, 45000, 46000, 45300]}
  />
</div>

        

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="glass-soft p-6 rounded-2xl shadow-sm h-[420px]">
          <h3 className="font-semibold text-[color:var(--foreground)] mb-4">
            Business Growth
          </h3>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineChartData}
              margin={{ top: 20, right: 40, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--table-row-border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--muted)' }} />
              <YAxis yAxisId="left" tick={{ fill: 'var(--muted)' }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(v) => `$${v / 1000}k`}
                tick={{ fill: 'var(--muted)' }}
              />

              <Tooltip content={<ChartTooltip />} />

              <Legend
                verticalAlign="top"
                align="left"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 20 }}
              />

              <Line
                yAxisId="left"
                dataKey="customers"
                stroke="var(--teal)"
                strokeWidth={3}
                dot={false}
              />
              <Line
                yAxisId="left"
                dataKey="orders"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={false}
              />
              <Line
                yAxisId="right"
                dataKey="revenue"
                stroke="var(--support-b)"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="glass-soft p-6 rounded-2xl shadow-sm h-[420px]">
          <h3 className="font-semibold text-[color:var(--foreground)] mb-4">
            Inventory Overview
          </h3>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--table-row-border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--muted)' }} />
              <YAxis tick={{ fill: 'var(--muted)' }} />

              <Tooltip content={<ChartTooltip />} />

              <Legend
                verticalAlign="top"
                align="left"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 20 }}
              />

              <Bar dataKey="stock" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="sold" fill="var(--teal)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

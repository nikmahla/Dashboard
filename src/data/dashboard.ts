export const growthChartData = [
  { month: 'Jan', orders: 40, customers: 24, revenue: 4000 },
  { month: 'Feb', orders: 32, customers: 20, revenue: 3500 },
  { month: 'Mar', orders: 55, customers: 36, revenue: 6200 },
  { month: 'Apr', orders: 70, customers: 48, revenue: 8100 },
  { month: 'May', orders: 90, customers: 60, revenue: 10400 },
  { month: 'Jun', orders: 110, customers: 75, revenue: 13200 },
] as const;

export const inventoryChartData = [
  { name: 'Laptops', stock: 120, sold: 80 },
  { name: 'Phones', stock: 200, sold: 150 },
  { name: 'Accessories', stock: 300, sold: 210 },
  { name: 'Monitors', stock: 80, sold: 50 },
  { name: 'Keyboards', stock: 150, sold: 100 },
] as const;

export type KpiMetric = {
  id: string;
  label: string;
  value: number;
  color: 'purple' | 'blue' | 'green' | 'orange';
  trend: number[];
};

export const kpiMetrics: KpiMetric[] = [
  {
    id: 'users',
    label: 'Users',
    value: 1245,
    color: 'purple',
    trend: [1100, 1150, 1200, 1230, 1245, 1255, 1260, 1245],
  },
  {
    id: 'orders',
    label: 'Orders',
    value: 397,
    color: 'blue',
    trend: [320, 340, 360, 380, 390, 397, 405, 410],
  },
  {
    id: 'tasks',
    label: 'Tasks',
    value: 87,
    color: 'green',
    trend: [70, 72, 76, 80, 84, 87, 90, 88],
  },
  {
    id: 'revenue',
    label: 'Revenue',
    value: 45300,
    color: 'orange',
    trend: [30000, 32000, 36000, 40000, 42000, 45000, 46000, 45300],
  },
];

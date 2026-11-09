'use client';

import KpiGrid from '@/components/dashboard/KpiGrid';
import LowStockList from '@/components/dashboard/LowStockList';
import RangeSelect from '@/components/dashboard/RangeSelect';
import RecentOrders from '@/components/dashboard/RecentOrders';
import RevenueChart from '@/components/dashboard/RevenueChart';
import StockChart from '@/components/dashboard/StockChart';
import { RangeProvider, useRange } from '@/context/RangeContext';
import { ui } from '@/lib/ui';

function Dashboard() {
  const { days } = useRange();
  return (
    <div className={ui.spacing.pageY}>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className={ui.typography.pageTitle}>Dashboard</h1>
          <p className={`mt-1 ${ui.typography.pageSubtitle}`}>How the store is doing over the last {days} days.</p>
        </div>
        <RangeSelect />
      </header>

      <KpiGrid />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2"><RevenueChart /></div>
        <LowStockList />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2"><RecentOrders /></div>
        <StockChart />
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <RangeProvider>
      <Dashboard />
    </RangeProvider>
  );
}

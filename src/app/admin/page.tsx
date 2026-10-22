import DashboardHeader from '@/components/dashboard/DashboardHeader';
import GrowthChart from '@/components/dashboard/GrowthChart';
import InventoryChart from '@/components/dashboard/InventoryChart';
import KpiGrid from '@/components/dashboard/KpiGrid';
import { ui } from '@/lib/ui';

export default function AdminPage() {
  return (
    <div className={ui.spacing.pageY}>
      <DashboardHeader />
      <KpiGrid />
      <section aria-label="Analytics charts" className={ui.layout.chartGrid}>
        <GrowthChart />
        <InventoryChart />
      </section>
    </div>
  );
}

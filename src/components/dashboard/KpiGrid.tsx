'use client';

import {
  Users,
  ShoppingCart,
  ListChecks,
  CircleDollarSign,
  type LucideIcon,
} from 'lucide-react';
import KpiCard from '@/components/KpiCard';
import { kpiMetrics, type KpiMetric } from '@/data/dashboard';
import { ui } from '@/lib/ui';

const kpiIcons: Record<KpiMetric['id'], LucideIcon> = {
  users: Users,
  orders: ShoppingCart,
  tasks: ListChecks,
  revenue: CircleDollarSign,
};

export default function KpiGrid() {
  return (
    <section aria-label="Key performance indicators" className={ui.layout.kpiGrid}>
      {kpiMetrics.map((metric) => {
        const Icon = kpiIcons[metric.id];
        return (
          <KpiCard
            key={metric.id}
            label={metric.label}
            value={metric.value}
            icon={<Icon size={ui.icon.lg} strokeWidth={1.75} aria-hidden />}
            color={metric.color}
            trend={metric.trend}
          />
        );
      })}
    </section>
  );
}

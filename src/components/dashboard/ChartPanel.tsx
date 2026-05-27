import { type ReactNode } from 'react';
import Panel from '@/components/ui/Panel';
import { ui, cn } from '@/lib/ui';

type ChartPanelProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function ChartPanel({
  title,
  description,
  children,
  className,
}: ChartPanelProps) {
  return (
    <Panel className={cn(ui.spacing.cardPadding, 'flex flex-col', className)}>
      <div className="mb-4 shrink-0">
        <h2 className={ui.typography.sectionTitle}>{title}</h2>
        {description && (
          <p className={`mt-0.5 ${ui.typography.caption}`}>{description}</p>
        )}
      </div>
      <div className={cn('flex-1 w-full min-h-0', ui.chart.height)}>{children}</div>
    </Panel>
  );
}

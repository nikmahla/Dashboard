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
    <Panel
      className={cn(
        ui.spacing.cardPadding,
        'flex flex-col gap-4 overflow-hidden',
        className
      )}
    >
      <div className="mb-1 border-b border-[color:var(--glass-border)] pb-4">
        <h2 className={ui.typography.sectionTitle}>{title}</h2>
        {description && (
          <p className={`mt-2 ${ui.typography.caption}`}>{description}</p>
        )}
      </div>
      <div className={cn('flex-1 w-full min-h-0', ui.chart.height)}>{children}</div>
    </Panel>
  );
}

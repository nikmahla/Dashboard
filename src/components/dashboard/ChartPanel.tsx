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
        'group overflow-hidden transition-shadow duration-300 hover:shadow-xl',
        'flex flex-col gap-5 bg-[color:var(--card-bg)]',
        className
      )}
    >
      <div className="mb-2 border-b border-[color:var(--glass-border)] pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className={ui.typography.sectionTitle}>{title}</h2>
            {description && (
              <p className={`mt-2 ${ui.typography.caption}`}>{description}</p>
            )}
          </div>
          <span className="rounded-full border border-[color:var(--glass-border)] bg-[color:var(--background)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[color:var(--muted)]">
            Performance
          </span>
        </div>
      </div>
      <div className={cn('flex-1 w-full min-h-0 overflow-hidden rounded-[1.75rem] bg-[color:var(--background)] p-3', ui.chart.height)}>
        {children}
      </div>
    </Panel>
  );
}

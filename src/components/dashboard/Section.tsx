import Link from 'next/link';
import type { ReactNode } from 'react';
import Panel from '@/components/ui/Panel';
import { cn } from '@/lib/ui';

type SectionProps = {
  title: string;
  description?: string;
  action?: { href: string; label: string };
  children: ReactNode;
  className?: string;
  flush?: boolean;
};

/** One consistent frame for every block on the dashboard: title row, then content. */
export default function Section({ title, description, action, children, className, flush }: SectionProps) {
  return (
    <Panel className={cn('flex min-w-0 flex-col', className)}>
      <header className="flex items-start justify-between gap-3 px-5 pb-3 pt-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-[color:var(--foreground)]">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-[color:var(--muted)]">{description}</p>}
        </div>
        {action && (
          <Link
            href={action.href}
            className="shrink-0 rounded-md text-sm font-medium text-[color:var(--primary)] hover:underline focus-visible:outline-2"
          >
            {action.label}
          </Link>
        )}
      </header>
      <div className={cn('min-h-0 flex-1', flush ? '' : 'px-5 pb-5')}>{children}</div>
    </Panel>
  );
}

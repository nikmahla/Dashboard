import { type ReactNode } from 'react';
import Panel from '@/components/ui/Panel';
import { ui, cn } from '@/lib/ui';

type PageLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function PageLayout({ title, description, children }: PageLayoutProps) {
  return (
    <div className={ui.spacing.pageY}>
      <header>
        <h1 className={ui.typography.pageTitle}>{title}</h1>
        {description && (
          <p className={`mt-1 ${ui.typography.pageSubtitle}`}>{description}</p>
        )}
      </header>

      <Panel className={cn(ui.spacing.cardPadding, 'transition-shadow duration-200')}>
        {children}
      </Panel>
    </div>
  );
}

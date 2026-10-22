import { type ReactNode } from 'react';
import { ui, cn } from '@/lib/ui';

type PanelProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export default function Panel({ children, className, hover }: PanelProps) {
  return (
    <div
      className={cn(
        ui.radius.lg,
        ui.surface.panel,
        hover && ui.surface.panelHover,
        className
      )}
    >
      {children}
    </div>
  );
}

import { ui } from '@/lib/ui';

type DashboardHeaderProps = {
  title?: string;
  description?: string;
};

export default function DashboardHeader({
  title = 'Dashboard',
  description = 'Overview of your store performance and inventory',
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className={ui.typography.pageTitle}>{title}</h1>
        <p className={`mt-1 ${ui.typography.pageSubtitle}`}>{description}</p>
      </div>
    </header>
  );
}

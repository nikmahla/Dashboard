import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No data',
  description = 'There is nothing to show here yet.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Inbox size={40} className="text-[color:var(--muted)]" />

      <h3 className="mt-4 text-sm font-semibold text-[color:var(--foreground)]">
        {title}
      </h3>

      <p className="mt-1 text-sm text-[color:var(--muted)] max-w-xs">
        {description}
      </p>
    </div>
  );
}

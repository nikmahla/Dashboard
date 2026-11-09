'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { getBreadcrumbs } from '@/lib/breadcrumbs';
import { ui, cn } from '@/lib/ui';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const items = getBreadcrumbs(pathname);

  // Nothing to navigate back to on the dashboard itself.
  if (items.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm sm:gap-2">
        {items.map((item, index) => {
          return (
            <li key={item.href} className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              {index > 0 && (
                <ChevronRight
                  size={14}
                  className="shrink-0 text-[color:var(--muted)] opacity-70"
                  aria-hidden
                />
              )}

              {item.isCurrent ? (
                <span
                  className="flex items-center gap-1.5 truncate font-medium text-[color:var(--foreground)]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 truncate transition-colors',
                    'text-[color:var(--muted)] hover:text-[color:var(--foreground)]',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]',
                    ui.radius.sm
                  )}
                >
                  <span className="truncate">{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

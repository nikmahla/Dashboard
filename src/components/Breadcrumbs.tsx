'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, LayoutDashboard } from 'lucide-react';
import { getBreadcrumbs } from '@/lib/breadcrumbs';
import { ui, cn } from '@/lib/ui';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const items = getBreadcrumbs(pathname);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-5 sm:mb-6">
      <ol
        className={cn(
          'flex flex-wrap items-center gap-1.5 sm:gap-2',
          ui.radius.md,
          'border border-[color:var(--breadcrumb-border)] bg-[color:var(--breadcrumb-bg)]',
          'px-3 py-2.5 text-sm',
          ui.shadow.sm
        )}
      >
        {items.map((item, index) => {
          const isFirst = index === 0;

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
                  className="flex items-center gap-1.5 truncate font-medium text-[color:var(--primary)]"
                  aria-current="page"
                >
                  {isFirst && (
                    <LayoutDashboard size={14} className="shrink-0" aria-hidden />
                  )}
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
                  {isFirst && (
                    <LayoutDashboard size={14} className="shrink-0" aria-hidden />
                  )}
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

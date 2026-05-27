/** Route segment → display label for breadcrumbs */
export const BREADCRUMB_LABELS: Record<string, string> = {
  products: 'Products',
  orders: 'Orders',
  customers: 'Customers',
  users: 'Users',
  tasks: 'Tasks',
  profile: 'Profile',
  settings: 'Settings',
};

export type BreadcrumbItem = {
  label: string;
  href: string;
  isCurrent: boolean;
};

export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const normalized = pathname.replace(/\/$/, '') || '/admin';

  if (normalized === '/admin') {
    return [{ label: 'Dashboard', href: '/admin', isCurrent: true }];
  }

  const segments = normalized.split('/').filter(Boolean);
  if (segments[0] !== 'admin') {
    return [{ label: 'Dashboard', href: '/admin', isCurrent: true }];
  }

  const items: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/admin', isCurrent: false },
  ];

  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    const href = '/' + segments.slice(0, i + 1).join('/');
    const label =
      BREADCRUMB_LABELS[segment] ??
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

    items.push({
      label,
      href,
      isCurrent: i === segments.length - 1,
    });
  }

  return items;
}

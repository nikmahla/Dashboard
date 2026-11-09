'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Users,
  Settings,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ListTodo,
  UserCircle,
  UserCog,
  Receipt,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Tooltip from '@/components/Tooltip';
import { ui, cn } from '@/lib/ui';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const NAV_GROUPS: { label?: string; items: NavItem[] }[] = [
  { items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }] },
  {
    label: 'Sales',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: Receipt },
      { href: '/admin/customers', label: 'Customers', icon: Users },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { href: '/admin/products', label: 'Products', icon: Package },
      { href: '/admin/inventory', label: 'Inventory', icon: Warehouse },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { href: '/admin/tasks', label: 'Tasks', icon: ListTodo },
      { href: '/admin/users', label: 'Users', icon: UserCog },
    ],
  },
];

const ACCOUNT_ITEMS: NavItem[] = [
  { href: '/admin/profile', label: 'Profile', icon: UserCircle },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

type SidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (isMobile) setCollapsed(false);
  }, [isMobile]);

  const closeMobile = () => isMobile && setOpen(false);

  const linkClass = (active: boolean, centered: boolean) =>
    cn(
      'sidebar-item',
      active && 'sidebar-item-active',
      centered && 'justify-center'
    );

  const showLabels = isMobile || !collapsed;

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = pathname === item.href;

    const link = (
      <Link
        href={item.href}
        onClick={closeMobile}
        className={linkClass(active, !showLabels)}
        aria-current={active ? 'page' : undefined}
      >
        <Icon size={ui.icon.md} className="shrink-0" aria-hidden />
        {showLabels && <span>{item.label}</span>}
      </Link>
    );

    return (
      <div key={item.href} className="relative">
        {!showLabels ? (
          <Tooltip label={item.label} side="right">
            {link}
          </Tooltip>
        ) : (
          link
        )}
      </div>
    );
  };

  return (
    <>
      {open && isMobile && (
        <button
          type="button"
          aria-label="Dismiss menu overlay"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-[color:var(--overlay)] md:hidden"
        />
      )}

      <aside
        className={cn(
          'z-40 overflow-visible bg-[color:var(--sidebar-bg)] text-[color:var(--sidebar-text)]',
          'border-r border-[color:var(--border-default)]',
          'transition-[transform,width] duration-200 ease-out',
          isMobile
            ? 'fixed bottom-0 left-0 top-14 w-60 max-w-[85vw]'
            : 'md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:flex md:flex-col',
          isMobile && (open ? 'translate-x-0' : '-translate-x-full'),
          !isMobile && (collapsed ? 'md:w-[4.5rem]' : 'md:w-60')
        )}
      >
        {isMobile && (
          <div className="flex items-center justify-between border-b border-[color:var(--glass-border)] px-4 py-3 md:hidden">
            <span className="text-sm font-semibold">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className={cn(ui.radius.md, 'p-1 hover:bg-[var(--sidebar-hover)]')}
            >
              <X size={20} />
            </button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 pb-3 pt-2" aria-label="Main navigation">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label ?? gi} className="space-y-0.5">
              {group.label && showLabels && <p className="sidebar-group">{group.label}</p>}
              {group.label && !showLabels && <div className="mx-3 my-3 border-t border-[color:var(--border-default)]" />}
              {group.items.map((item) => renderItem(item))}
            </div>
          ))}
        </nav>

        <div className="space-y-0.5 border-t border-[color:var(--border-default)] px-3 py-3">
          {ACCOUNT_ITEMS.map((item) => renderItem(item))}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className={cn('sidebar-item hidden w-full md:flex', !showLabels && 'justify-center')}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={ui.icon.md} aria-hidden /> : <PanelLeftClose size={ui.icon.md} aria-hidden />}
            {showLabels && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

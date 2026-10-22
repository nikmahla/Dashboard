'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  ListTodo,
  UserCircle,
  UserCog,
  ClipboardList,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Tooltip from '@/components/Tooltip';
import { ui, cn } from '@/lib/ui';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/users', label: 'Users', icon: UserCog },
  { href: '/admin/tasks', label: 'Tasks', icon: ListTodo },
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
          'border-r border-[color:var(--glass-border)] shadow-sm',
          'transition-[transform,width] duration-300 ease-in-out',
          isMobile
            ? 'fixed bottom-0 left-0 top-16 w-64 max-w-[85vw]'
            : 'md:sticky md:top-16 md:h-[calc(100vh-4rem)]',
          isMobile && (open ? 'translate-x-0' : '-translate-x-full'),
          !isMobile && (collapsed ? 'md:w-20' : 'md:w-64')
        )}
      >
        <div className="hidden justify-end pb-2 pr-2 pt-4 md:flex">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              ui.radius.md,
              'p-1.5 text-[color:var(--sidebar-text)]/70 transition-colors hover:bg-[var(--sidebar-hover)] hover:text-[color:var(--sidebar-text)]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

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

        <nav className="space-y-1 px-2 pb-6 pt-3" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            const showLabel = isMobile || !collapsed;

            const link = (
              <Link
                href={item.href}
                onClick={closeMobile}
                className={linkClass(active, !showLabel)}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={ui.icon.md} className="shrink-0" aria-hidden />
                {showLabel && <span>{item.label}</span>}
              </Link>
            );

            return (
              <div key={item.href} className="relative">
                {!isMobile && collapsed ? (
                  <Tooltip label={item.label} side="right">
                    {link}
                  </Tooltip>
                ) : (
                  link
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

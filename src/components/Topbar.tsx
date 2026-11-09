'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, LogOut, Sun, Moon, Settings, User, Boxes, Palette } from 'lucide-react';
import IconButton from '@/components/ui/IconButton';
import { DropdownButton, DropdownLink } from '@/components/ui/DropdownItem';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import { ui, cn } from '@/lib/ui';

type TopbarProps = {
  onToggleSidebar: () => void;
};

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const { user: settingsUser, theme, toggleTheme, accent, toggleAccent } = useSettings();
  const { user: authUser, logout } = useAuth();
  const displayName = authUser?.name ?? settingsUser?.name ?? 'User';
  const displayEmail = authUser?.email ?? settingsUser?.email ?? '';
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', closeOnOutsideClick);
    return () => document.removeEventListener('click', closeOnOutsideClick);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logout();
    router.replace('/login');
    router.refresh();
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 flex h-14 items-center border-b bg-[color:var(--card-bg)]'
      )}
      style={{ borderColor: 'var(--glass-border)' }}
    >
      <div className="flex w-full items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <IconButton
            className="md:hidden"
            variant="ghost"
            onClick={onToggleSidebar}
            aria-label="Open navigation menu"
          >
            <Menu size={ui.icon.md} aria-hidden />
          </IconButton>

          <Link href="/admin" className="flex min-w-0 items-center gap-2.5" aria-label="Stockroom home">
            <span
              className={cn('flex h-8 w-8 items-center justify-center bg-[color:var(--foreground)] text-[color:var(--card-bg)]', ui.radius.md)}
              aria-hidden
            >
              <Boxes size={17} strokeWidth={2} />
            </span>
            <span className="truncate text-base font-semibold tracking-tight text-[color:var(--foreground)]">
              Stockroom
            </span>
          </Link>
        </div>

        <div className="relative flex shrink-0 items-center gap-2 sm:gap-3" ref={menuRef}>
          <IconButton
            onClick={toggleAccent}
            aria-label={accent === 'amber' ? 'Switch to blue accent' : 'Switch to amber accent'}
            title={accent === 'amber' ? 'Accent: amber' : 'Accent: blue'}
          >
            <Palette size={ui.icon.md} aria-hidden />
          </IconButton>

          <IconButton
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun size={ui.icon.md} aria-hidden />
            ) : (
              <Moon size={ui.icon.md} aria-hidden />
            )}
          </IconButton>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition-colors',
              'hover:bg-[var(--surface-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]'
            )}
            aria-label="Open account menu"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <span className="hidden max-w-[120px] truncate text-sm font-medium text-[color:var(--foreground)] sm:block">
              {displayName}
            </span>
            {settingsUser?.avatar ? (
              <img
                src={settingsUser.avatar}
                alt=""
                className={cn('h-9 w-9 object-cover', ui.radius.md)}
              />
            ) : (
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center bg-[color:var(--primary)] text-sm font-semibold text-[color:var(--primary-contrast)]',
                  ui.radius.md
                )}
                aria-hidden
              >
                {displayName.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </button>

          <div
            role="menu"
            className={cn(
              'absolute right-0 top-[calc(100%+0.5rem)] w-56 origin-top-right overflow-hidden',
              ui.radius.md,
              'border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] shadow-[var(--shadow-lg)]',
              'transition-[opacity,transform] duration-150',
              menuOpen
                ? 'pointer-events-auto scale-100 opacity-100'
                : 'pointer-events-none scale-95 opacity-0'
            )}
          >
            <div className="border-b border-[color:var(--glass-border)] px-4 py-3">
              <p className="truncate text-sm font-semibold text-[color:var(--foreground)]">
                {displayName}
              </p>
              <p className="truncate text-xs text-[color:var(--muted)]">
                {displayEmail || 'user@email.com'}
              </p>
              {authUser?.role && (
                <span className="badge badge-neutral mt-2">{authUser.role}</span>
              )}
            </div>

            <DropdownLink
              href="/admin/profile"
              icon={User}
              label="My profile"
              onClick={closeMenu}
            />
            <DropdownLink
              href="/admin/settings"
              icon={Settings}
              label="Settings"
              onClick={closeMenu}
            />

            <div className="my-1 border-t border-[color:var(--glass-border)]" role="separator" />

            <DropdownButton
              icon={LogOut}
              label="Log out"
              onClick={handleLogout}
              destructive
            />
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  LogOut,
  Sun,
  Moon,
  Bell,
  Settings,
  HelpCircle,
  Keyboard,
  Shield,
  User,
} from 'lucide-react';
import IconButton from '@/components/ui/IconButton';
import { DropdownButton, DropdownLink } from '@/components/ui/DropdownItem';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import { ui, cn } from '@/lib/ui';

type TopbarProps = {
  onToggleSidebar: () => void;
};

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const { user: settingsUser, theme, toggleTheme } = useSettings();
  const { user: authUser, logout } = useAuth();
  const displayName = authUser?.name ?? settingsUser?.name ?? 'User';
  const displayEmail = authUser?.email ?? settingsUser?.email ?? '';
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const notificationCount = 3;

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
        'fixed inset-x-0 top-0 z-50 flex h-16 items-center glass border-b backdrop-blur-xl',
        'supports-[backdrop-filter]:bg-[color:var(--background)/0.6]'
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

          <div className="min-w-0">
            <p className="truncate text-lg font-semibold tracking-tight text-[color:var(--foreground)]">
              Admin Panel
            </p>
            <p className="hidden truncate text-xs text-[color:var(--muted)] sm:block">
              Store management
            </p>
          </div>
        </div>

        <div className="relative flex shrink-0 items-center gap-2 sm:gap-3" ref={menuRef}>
          <IconButton
            aria-label={`Notifications, ${notificationCount} unread`}
            onClick={closeMenu}
            badge={notificationCount}
          >
            <Bell size={ui.icon.md} aria-hidden />
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
              'flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1 transition-colors',
              'hover:bg-[var(--primary-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]'
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
                className={cn('h-9 w-9 object-cover shadow-sm', ui.radius.md)}
              />
            ) : (
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center bg-[color:var(--primary)] text-sm font-semibold text-white shadow-sm',
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
              'border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] shadow-xl backdrop-blur-xl',
              'transition-all duration-200',
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
            </div>

            <DropdownLink
              href="/admin/profile"
              icon={User}
              label="My profile"
              onClick={closeMenu}
            />
            <DropdownButton icon={Settings} label="Account settings" onClick={closeMenu} />
            <DropdownButton icon={Shield} label="Security" onClick={closeMenu} />
            <DropdownButton icon={Keyboard} label="Keyboard shortcuts" onClick={closeMenu} />
            <DropdownButton icon={HelpCircle} label="Help & support" onClick={closeMenu} />

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

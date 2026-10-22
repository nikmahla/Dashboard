'use client';

import LoginForm from '@/components/LoginForm';
import { useSettings } from '@/context/SettingsContext';
import { Moon, Sun } from 'lucide-react';

export default function LoginPage() {
  const { theme, toggleTheme } = useSettings();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[color:var(--background)] px-4 py-10 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -left-1/4 top-0 h-[420px] w-[420px] rounded-full bg-[var(--primary-soft)] blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-[360px] w-[360px] rounded-full bg-[var(--teal-soft)] blur-3xl" />
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-xl border border-[color:var(--glass-border)] bg-[var(--card-bg)] px-3 py-2 text-sm font-medium text-[color:var(--foreground)] shadow-sm transition-colors hover:bg-[var(--primary-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] sm:right-6 sm:top-6"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
        <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>

      <div className="relative z-[1] w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

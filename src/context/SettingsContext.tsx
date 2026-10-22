'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type User = {
  name: string;
  email: string;
  avatar?: string;
};

export type Settings = {
  name: string;
  email: string;
  language: string;
  timezone: string;
  notifications: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  compactDensity: boolean;
};

type Ctx = {
  user: User | null;
  setUser: (u: User | null) => void;
  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  toggleTheme: () => void;
};

export const defaultSettings: Settings = {
  name: '',
  email: '',
  language: 'English',
  timezone: 'UTC',
  notifications: true,
  securityAlerts: true,
  marketingEmails: false,
  compactDensity: false,
};

function loadStoredSettings(): Settings {
  try {
    const raw = localStorage.getItem('settings');
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSettings(loadStoredSettings());
    try {
      const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (saved === 'dark' || saved === 'light') setTheme(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        const data = await res.json();
        const sessionUser = data?.user;

        if (!sessionUser) throw new Error('not auth');

        setUser({
          name: sessionUser.name,
          email: sessionUser.email,
          avatar: sessionUser.avatar,
        });
        setSettings((s) => ({
          ...s,
          name: sessionUser.name ?? s.name,
          email: sessionUser.email ?? s.email,
        }));
      } catch {
        setUser(null);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('settings', JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch {
      /* ignore */
    }
  }, [theme]);

  const updateSettings = (patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));

    if (patch.name !== undefined || patch.email !== undefined) {
      setUser((prevUser) => ({
        name: patch.name ?? prevUser?.name ?? '',
        email: patch.email ?? prevUser?.email ?? '',
        avatar: prevUser?.avatar,
      }));
    }
  };

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  if (!ready) return null;

  return (
    <SettingsContext.Provider
      value={{ user, setUser, settings, updateSettings, theme, setTheme, toggleTheme }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings outside provider');
  return ctx;
}

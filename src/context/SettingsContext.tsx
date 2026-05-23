'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  name: string;
  email: string;
  avatar?: string;
};

type Settings = {
  name: string;
  email: string;
  language: string;
  notifications: boolean;
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

const defaultSettings: Settings = {
  name: '',
  email: '',
  language: 'English',
  notifications: true,
};

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem('settings');
      return raw ? JSON.parse(raw) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  const [ready, setReady] = useState(false);

  // ✅ Load current user from cookie (NO localStorage token)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' });
        if (!res.ok) throw new Error('not auth');
        const data = await res.json();

        setUser(data);
        setSettings((s) => ({
          ...s,
          name: data?.name ?? s.name,
          email: data?.email ?? s.email,
        }));
      } catch {
        setUser(null);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // persist settings
  useEffect(() => {
    try {
      localStorage.setItem('settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // persist theme + apply html class
  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch {}
  }, [theme]);

  const updateSettings = (s: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...s }));

    // keep user in sync (optional)
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      return {
        ...prevUser,
        name: s.name ?? prevUser.name,
        email: s.email ?? prevUser.email,
      };
    });
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
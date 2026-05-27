'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ToastContext';
import { ui, cn } from '@/lib/ui';
import {
  Sun,
  Moon,
  Save,
  User,
  Globe,
  Bell,
  Shield,
  Palette,
  Loader2,
  Check,
  Mail,
  ChevronRight,
} from 'lucide-react';

type SettingsForm = {
  name: string;
  email: string;
  language: string;
  timezone: string;
  notifications: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  compactDensity: boolean;
};

const btnBase =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Tokyo',
];

export default function SettingsPage() {
  const { settings, updateSettings, theme, setTheme } = useSettings();
  const { user: authUser, updateProfile } = useAuth();
  const { notify } = useToast();

  const [form, setForm] = useState<SettingsForm>({
    name: '',
    email: '',
    language: 'English',
    timezone: 'UTC',
    notifications: true,
    securityAlerts: true,
    marketingEmails: false,
    compactDensity: false,
  });
  const [saving, setSaving] = useState(false);

  const sessionName = authUser?.name ?? settings.name ?? '';
  const sessionEmail = authUser?.email ?? settings.email ?? '';
  const sessionRole = authUser?.role ?? 'User';

  useEffect(() => {
    setForm({
      name: sessionName,
      email: sessionEmail,
      language: settings.language,
      timezone: settings.timezone,
      notifications: settings.notifications,
      securityAlerts: settings.securityAlerts,
      marketingEmails: settings.marketingEmails,
      compactDensity: settings.compactDensity,
    });
  }, [sessionName, sessionEmail, settings]);

  const isDirty = useMemo(() => {
    return (
      form.name.trim() !== sessionName ||
      form.email.trim() !== sessionEmail ||
      form.language !== settings.language ||
      form.timezone !== settings.timezone ||
      form.notifications !== settings.notifications ||
      form.securityAlerts !== settings.securityAlerts ||
      form.marketingEmails !== settings.marketingEmails ||
      form.compactDensity !== settings.compactDensity
    );
  }, [form, sessionName, sessionEmail, settings]);

  const emailValid = useMemo(() => {
    const e = form.email.trim();
    return e.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }, [form.email]);

  const profileDirty =
    form.name.trim() !== sessionName || form.email.trim() !== sessionEmail;

  const saveSettings = async () => {
    if (!emailValid) {
      notify({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    if (!form.name.trim()) {
      notify({ type: 'error', message: 'Name is required.' });
      return;
    }

    setSaving(true);
    try {
      const name = form.name.trim();
      const email = form.email.trim();

      if (profileDirty) {
        await updateProfile({ name, email });
      }

      updateSettings({
        name,
        email,
        language: form.language,
        timezone: form.timezone,
        notifications: form.notifications,
        securityAlerts: form.securityAlerts,
        marketingEmails: form.marketingEmails,
        compactDensity: form.compactDensity,
      });

      notify({
        type: 'success',
        message: profileDirty
          ? 'Settings saved — your profile is updated across the dashboard'
          : 'Preferences saved',
      });
    } catch (err) {
      notify({
        type: 'error',
        message: err instanceof Error ? err.message : 'Could not save settings',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={cn(ui.spacing.pageY, 'max-w-5xl pb-24')}>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className={ui.typography.pageTitle}>Settings</h1>
          <p className={`mt-1 ${ui.typography.pageSubtitle}`}>
            Manage your account, appearance, and notification preferences.
          </p>
        </div>
        {isDirty && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[color:var(--primary)]/30 bg-[var(--primary-soft)] px-3 py-1 text-xs font-medium text-[color:var(--primary)]">
            Unsaved changes
          </span>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          {/* Appearance */}
          <SettingsSection
            icon={<Palette size={18} />}
            title="Appearance"
            description="Theme applies instantly across the admin panel."
          >
            <div className="grid grid-cols-2 gap-3">
              <ThemeCard
                label="Light"
                active={theme === 'light'}
                onClick={() => setTheme('light')}
                preview={
                  <div className="h-14 rounded-lg border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] p-2">
                    <div className="h-2 w-8 rounded bg-[color:var(--primary)]" />
                    <div className="mt-2 h-1.5 w-full rounded bg-[color:var(--surface-hover)]" />
                    <div className="mt-1 h-1.5 w-3/4 rounded bg-[color:var(--surface-hover)]" />
                  </div>
                }
                icon={<Sun size={18} />}
              />
              <ThemeCard
                label="Dark"
                active={theme === 'dark'}
                onClick={() => setTheme('dark')}
                preview={
                  <div className="h-14 rounded-lg border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] p-2">
                    <div className="h-2 w-8 rounded bg-[color:var(--primary)]" />
                    <div className="mt-2 h-1.5 w-full rounded bg-[color:var(--surface-hover)]" />
                    <div className="mt-1 h-1.5 w-3/4 rounded bg-[color:var(--surface-hover)]" />
                  </div>
                }
                icon={<Moon size={18} />}
              />
            </div>

            <ToggleRow
              label="Compact density"
              description="Tighter spacing in lists and tables"
              checked={form.compactDensity}
              onChange={() => setForm((f) => ({ ...f, compactDensity: !f.compactDensity }))}
            />
          </SettingsSection>

          {/* Account */}
          <SettingsSection
            icon={<User size={18} />}
            title="Account"
            description="Synced with your session — updates the header and profile."
          >
            <Field label="Full name">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                placeholder="Your name"
              />
            </Field>
            <Field label="Email address">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={cn('input', !emailValid && form.email && 'border-[color:var(--danger)]')}
                placeholder="you@example.com"
              />
              {!emailValid && form.email && (
                <p className="mt-1 text-xs text-[color:var(--danger)]">Enter a valid email.</p>
              )}
            </Field>
            <div className="flex items-center gap-2 rounded-lg bg-[var(--primary-soft)]/50 px-3 py-2 text-xs text-[color:var(--muted)]">
              <Shield size={14} className="shrink-0 text-[color:var(--primary)]" />
              Signed in as <span className="font-medium text-[color:var(--foreground)]">{sessionRole}</span>
            </div>
          </SettingsSection>

          {/* Regional */}
          <SettingsSection
            icon={<Globe size={18} />}
            title="Regional"
            description="Language and timezone for dates and copy."
          >
            <Field label="Language">
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="input cursor-pointer"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>German</option>
                <option>French</option>
              </select>
            </Field>
            <Field label="Timezone">
              <select
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className="input cursor-pointer"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </Field>
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection
            icon={<Bell size={18} />}
            title="Notifications"
            description="Choose what you want to be notified about."
          >
            <ToggleRow
              label="Product updates"
              description="New features and dashboard improvements"
              checked={form.notifications}
              onChange={() => setForm((f) => ({ ...f, notifications: !f.notifications }))}
            />
            <ToggleRow
              label="Security alerts"
              description="Login activity and permission changes"
              checked={form.securityAlerts}
              onChange={() => setForm((f) => ({ ...f, securityAlerts: !f.securityAlerts }))}
            />
            <ToggleRow
              label="Marketing emails"
              description="Tips, offers, and newsletters"
              checked={form.marketingEmails}
              onChange={() => setForm((f) => ({ ...f, marketingEmails: !f.marketingEmails }))}
            />
          </SettingsSection>
        </div>

        {/* Sidebar summary */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div
            className={cn(
              'rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] p-5 shadow-sm',
              'transition-shadow hover:shadow-md'
            )}
          >
            <p className={ui.typography.caption}>Preview</p>
            <p className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">
              {form.name.trim() || 'Your name'}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[color:var(--muted)]">
              <Mail size={14} />
              {form.email.trim() || 'email@example.com'}
            </p>
            <ul className="mt-4 space-y-2 border-t border-[color:var(--glass-border)] pt-4 text-xs text-[color:var(--muted)]">
              <li className="flex justify-between">
                <span>Theme</span>
                <span className="font-medium capitalize text-[color:var(--foreground)]">{theme}</span>
              </li>
              <li className="flex justify-between">
                <span>Language</span>
                <span className="font-medium text-[color:var(--foreground)]">{form.language}</span>
              </li>
              <li className="flex justify-between">
                <span>Timezone</span>
                <span className="font-medium text-[color:var(--foreground)]">{form.timezone}</span>
              </li>
            </ul>
          </div>

          <Link
            href="/admin/profile"
            className={cn(
              'flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-[color:var(--glass-border)]',
              'bg-[color:var(--card-bg)] p-4 text-sm transition-all hover:border-[color:var(--table-border-accent)] hover:bg-[var(--primary-soft)]'
            )}
          >
            <span className="flex items-center gap-2 text-[color:var(--foreground)]">
              <User size={16} className="text-[color:var(--primary)]" />
              Profile & avatar
            </span>
            <ChevronRight size={16} className="text-[color:var(--muted)]" />
          </Link>

          <div className="rounded-xl border border-[color:var(--glass-border)] bg-[var(--primary-soft)]/30 p-4 text-xs text-[color:var(--muted)] leading-relaxed">
            Account name and email are stored in your secure session cookie when you save.
            Preferences are kept in this browser.
          </div>
        </aside>
      </div>

      {/* Sticky save bar */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40 border-t border-[color:var(--glass-border)]',
          'bg-[color:var(--card-bg)]/95 backdrop-blur-md px-4 py-3 md:pl-[var(--sidebar-offset,0)]'
        )}
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[color:var(--muted)]">
            {isDirty ? 'You have unsaved changes' : 'All changes saved'}
          </p>
          <button
            type="button"
            onClick={() => void saveSettings()}
            disabled={!isDirty || !emailValid || saving}
            className={cn(
              btnBase,
              !isDirty || !emailValid
                ? 'cursor-not-allowed bg-[color:var(--glass-border)] text-[color:var(--muted)] opacity-60'
                : 'btn-primary focus-visible:ring-[color:var(--primary)]'
            )}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              <>
                <Save size={16} aria-hidden />
                Save changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] shadow-sm',
        'transition-shadow hover:shadow-md'
      )}
    >
      <div className="border-b border-[color:var(--glass-border)] bg-[var(--primary-soft)]/20 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[color:var(--primary)]">
            {icon}
          </span>
          <div>
            <h2 className={ui.typography.sectionTitle}>{title}</h2>
            <p className={`mt-0.5 ${ui.typography.caption}`}>{description}</p>
          </div>
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className={ui.typography.label}>{label}</span>
      {children}
    </label>
  );
}

function ThemeCard({
  label,
  active,
  onClick,
  preview,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  preview: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-xl border p-3 text-left transition-all active:scale-[0.98]',
        active
          ? 'border-[color:var(--primary)] bg-[var(--primary-soft)] ring-2 ring-[color:var(--primary)]/25'
          : 'border-[color:var(--glass-border)] bg-[color:var(--card-bg)] hover:border-[color:var(--table-border-accent)]'
      )}
    >
      {preview}
      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-[color:var(--foreground)]">
          {icon}
          {label}
        </span>
        {active && <Check size={16} className="text-[color:var(--primary)]" aria-hidden />}
      </div>
    </button>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[color:var(--glass-border)]/60 bg-[color:var(--background)]/50 px-4 py-3 transition-colors hover:border-[color:var(--table-border-accent)]">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[color:var(--foreground)]">{label}</p>
        {description && <p className={`mt-0.5 ${ui.typography.caption}`}>{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          'relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]',
          checked ? 'bg-[color:var(--primary)]' : 'bg-[color:var(--glass-border)]'
        )}
      >
        <span
          className={cn(
            'inline-block h-5 w-5 rounded-full bg-[color:var(--toggle-knob)] shadow transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
}

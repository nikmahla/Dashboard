'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Shield,
  Calendar,
  Pencil,
  LogOut,
  Save,
  BadgeCheck,
  Sparkles,
  Loader2,
} from 'lucide-react';
import Modal from '@/components/Modal';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ToastContext';
import { ui, cn } from '@/lib/ui';

function stringToHsl(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  return `hsl(${h} 70% 50%)`;
}

function Avatar({ name, email }: { name: string; email: string }) {
  const initials = useMemo(() => {
    const parts = name.trim().split(' ').filter(Boolean);
    const a = parts[0]?.[0] ?? 'U';
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
    return (a + b).toUpperCase();
  }, [name]);

  const seed = email.toLowerCase();
  const c1 = useMemo(() => stringToHsl(seed + 'a'), [seed]);
  const c2 = useMemo(() => stringToHsl(seed + 'b'), [seed]);

  return (
    <div className="relative shrink-0">
      <div
        className="absolute -inset-3 rounded-full blur-2xl opacity-50"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${c1}, transparent 60%), radial-gradient(circle at 70% 70%, ${c2}, transparent 60%)`,
        }}
        aria-hidden
      />
      <div
        className={cn(
          'relative grid h-28 w-28 place-items-center overflow-hidden rounded-full sm:h-32 sm:w-32',
          'text-xl font-semibold text-white ring-2 ring-[color:var(--primary)]/30 shadow-lg',
          ui.radius.full
        )}
        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
      >
        {initials}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className={cn(
        'group min-w-0 rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] p-4',
        'shadow-sm transition-all duration-200 hover:border-[color:var(--table-border-accent)] hover:shadow-md hover:-translate-y-0.5'
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            'bg-[var(--primary-soft)] text-[color:var(--primary)] transition-transform group-hover:scale-105'
          )}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className={ui.typography.caption}>{label}</p>
          <p className="mt-1 truncate text-sm font-semibold text-[color:var(--foreground)]" title={value}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

const btnBase =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

export default function ProfilePage() {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();
  const { user, updateProfile, logout } = useAuth();
  const { notify } = useToast();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const displayName = user?.name ?? settings.name ?? 'User';
  const displayEmail = user?.email ?? settings.email ?? '';
  const displayRole = user?.role ?? 'User';

  useEffect(() => {
    setName(displayName);
    setEmail(displayEmail);
  }, [displayName, displayEmail]);

  const openEdit = () => {
    setName(displayName);
    setEmail(displayEmail);
    setEditing(true);
  };

  const handleSave = async () => {
    const nextName = name.trim();
    const nextEmail = email.trim();

    if (!nextName) {
      notify({ type: 'error', message: 'Name is required' });
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ name: nextName, email: nextEmail });
      updateSettings({ name: nextName, email: nextEmail });
      notify({ type: 'success', message: 'Profile updated — visible across the dashboard' });
      setEditing(false);
    } catch (err) {
      notify({
        type: 'error',
        message: err instanceof Error ? err.message : 'Could not update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    notify({ type: 'success', message: 'Logged out successfully' });
    router.replace('/login');
    router.refresh();
  };

  return (
    <div className={cn(ui.spacing.pageY, 'max-w-6xl pb-10')}>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={ui.typography.pageTitle}>Profile</h1>
          <p className={`mt-1 ${ui.typography.pageSubtitle}`}>
            Your account details sync with the top bar and session.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openEdit}
            className={cn(btnBase, 'btn-primary shadow-md hover:opacity-95 focus-visible:ring-[color:var(--primary)]')}
          >
            <Pencil size={16} aria-hidden />
            Edit profile
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              btnBase,
              'bg-[color:var(--danger)] text-white shadow-sm hover:opacity-95 focus-visible:ring-[color:var(--danger)]'
            )}
          >
            <LogOut size={16} aria-hidden />
            Log out
          </button>
        </div>
      </header>

      <div
        className={cn(
          'overflow-hidden rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] shadow-sm',
          'transition-shadow hover:shadow-md'
        )}
      >
        <div className="relative h-24 sm:h-28 bg-gradient-to-r from-[color:var(--primary)]/20 via-[color:var(--primary)]/10 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_50%)]" />
          <div className="absolute bottom-3 right-4 flex items-center gap-1.5 rounded-full border border-[color:var(--glass-border)] bg-[color:var(--card-bg)]/80 px-3 py-1 text-xs text-[color:var(--muted)] backdrop-blur-sm">
            <Sparkles size={12} className="text-[color:var(--primary)]" aria-hidden />
            Active session
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="-mt-16 flex flex-col items-center gap-4 sm:-mt-20 lg:w-72 lg:items-start">
              <Avatar name={displayName} email={displayEmail} />
              <div className="text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                  <h2 className="text-xl font-semibold text-[color:var(--foreground)]">{displayName}</h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--primary)]">
                    <BadgeCheck size={14} aria-hidden />
                    {displayRole}
                  </span>
                </div>
                <p className="mt-2 flex items-center justify-center gap-2 text-sm text-[color:var(--muted)] lg:justify-start">
                  <Mail size={14} aria-hidden />
                  <span className="truncate">{displayEmail}</span>
                </p>
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatCard icon={<Shield size={18} />} label="Role" value={displayRole} />
                <StatCard icon={<Calendar size={18} />} label="Member since" value="Jan 2024" />
                <StatCard icon={<Mail size={18} />} label="Contact" value={displayEmail} />
              </div>

              <div
                className={cn(
                  'rounded-xl border border-[color:var(--glass-border)] bg-[var(--primary-soft)]/40 p-5',
                  'transition-colors hover:border-[color:var(--table-border-accent)]'
                )}
              >
                <h3 className={ui.typography.sectionTitle}>About</h3>
                <p className={`mt-2 ${ui.typography.pageSubtitle} leading-relaxed`}>
                  Changes you save here update your session and appear in the header, menus, and
                  anywhere your name is shown in this admin app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={editing}
        onClose={() => !saving && setEditing(false)}
        title="Edit profile"
        subtitle="Updates apply immediately across the dashboard"
        icon={<Pencil size={18} />}
      >
        <form
          className={ui.spacing.stackMd}
          onSubmit={(e) => {
            e.preventDefault();
            void handleSave();
          }}
        >
          <label className="block">
            <span className={ui.typography.label}>Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={cn('input mt-1.5')}
              placeholder="Your name"
            />
          </label>
          <label className="block">
            <span className={ui.typography.label}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={cn('input mt-1.5')}
              placeholder="you@example.com"
            />
          </label>

          <div className="flex flex-col-reverse gap-2 border-t border-[color:var(--glass-border)] pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={() => setEditing(false)}
              className={cn(
                btnBase,
                'border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] text-[color:var(--foreground)]',
                'hover:bg-[var(--primary-soft)] focus-visible:ring-[color:var(--primary)] disabled:opacity-50'
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={cn(btnBase, 'btn-primary focus-visible:ring-[color:var(--primary)] disabled:opacity-60')}
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
        </form>
      </Modal>
    </div>
  );
}

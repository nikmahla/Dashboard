'use client';

import { useState, useCallback, useId, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Loader2,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ui, cn } from '@/lib/ui';
import { useToast } from '@/components/ToastContext';

export const DEMO_CREDENTIALS = {
  email: 'admin@test.com',
  password: '1234',
} as const;

type FieldErrors = {
  email?: string;
  password?: string;
};

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  const trimmed = email.trim();

  if (!trimmed) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    errors.email = 'Enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return errors;
}

export default function LoginForm() {
  const router = useRouter();
  const toast = useToast();
  const { refresh } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const emailId = useId();
  const passwordId = useId();
  const emailErrorId = useId();
  const passwordErrorId = useId();

  const handleCopyCredentials = useCallback(async () => {
    const text = `Email: ${DEMO_CREDENTIALS.email}\nPassword: ${DEMO_CREDENTIALS.password}`;

    try {
      await navigator.clipboard.writeText(text);
      setEmail(DEMO_CREDENTIALS.email);
      setPassword(DEMO_CREDENTIALS.password);
      setErrors({});
      setCopied(true);
      toast.notify({ type: 'success', message: 'Demo credentials copied' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setEmail(DEMO_CREDENTIALS.email);
      setPassword(DEMO_CREDENTIALS.password);
      toast.notify({ type: 'info', message: 'Credentials filled in the form' });
    }
  }, [toast]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nextErrors = validate(email, password);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Login failed');
      }

      toast.notify({ type: 'success', message: 'Logged in successfully' });
      router.replace('/admin');
      router.refresh();
      await refresh();
    } catch {
      toast.notify({ type: 'error', message: 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-scaleIn">
      <div className={cn('glass-soft p-8 sm:p-10', ui.radius.lg, ui.shadow.lg)}>
        <div className="mb-8 text-center">
          <div
            className={cn(
              'mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-[var(--primary-soft)] text-[color:var(--primary)]',
              ui.radius.md
            )}
            aria-hidden
          >
            <LayoutDashboard size={24} strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-[color:var(--muted)]">
            Sign in to your admin dashboard
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyCredentials}
          className="mb-6 flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-[color:var(--glass-border)] bg-[var(--primary-soft)] px-4 py-3 text-left transition-colors hover:border-[color:var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2"
          aria-label="Copy demo credentials to clipboard and fill the form"
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--primary)]">
              Demo access
            </p>
            <p className="mt-0.5 truncate text-sm text-[color:var(--foreground)]">
              {DEMO_CREDENTIALS.email}
            </p>
            <p className="text-xs text-[color:var(--muted)]">
              Password: {DEMO_CREDENTIALS.password}
            </p>
          </div>
            <span className={cn('flex shrink-0 items-center gap-1.5 bg-[var(--card-bg)] px-2.5 py-1.5 text-xs font-medium text-[color:var(--foreground)]', ui.radius.sm, ui.shadow.sm)}>
            {copied ? (
              <>
                <Check size={14} className="text-[color:var(--success)]" aria-hidden />
                Copied
              </>
            ) : (
              <>
                <Copy size={14} aria-hidden />
                Copy
              </>
            )}
          </span>
        </button>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor={emailId}
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[color:var(--foreground)]"
            >
              <User size={15} className="text-[color:var(--muted)]" aria-hidden />
              Email
            </label>
            <input
              id={emailId}
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              disabled={loading}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? emailErrorId : undefined}
              placeholder="you@example.com"
              className="input disabled:cursor-not-allowed disabled:opacity-60"
            />
            {errors.email && (
              <p
                id={emailErrorId}
                role="alert"
                className="mt-1.5 text-xs text-[color:var(--danger)]"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={passwordId}
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[color:var(--foreground)]"
            >
              <Lock size={15} className="text-[color:var(--muted)]" aria-hidden />
              Password
            </label>
            <div className="relative">
              <input
                id={passwordId}
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                disabled={loading}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? passwordErrorId : undefined}
                placeholder="••••••••"
                className="input pr-11 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                disabled={loading}
                className={cn(
                  'absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[color:var(--muted)] transition-colors hover:bg-[var(--primary-soft)] hover:text-[color:var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] disabled:opacity-50',
                  ui.radius.sm
                )}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff size={18} aria-hidden />
                ) : (
                  <Eye size={18} aria-hidden />
                )}
              </button>
            </div>
            {errors.password && (
              <p
                id={passwordErrorId}
                role="alert"
                className="mt-1.5 text-xs text-[color:var(--danger)]"
              >
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 disabled:pointer-events-none disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-[color:var(--muted)]">
        Protected admin area · Demo credentials above
      </p>
    </div>
  );
}

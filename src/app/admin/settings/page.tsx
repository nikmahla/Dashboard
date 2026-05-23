"use client";

import { useEffect, useMemo, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { useToast } from "@/components/ToastContext";
import { Sun, Moon, Save } from "lucide-react";

type SettingsForm = {
  name: string;
  email: string;
  language: string;
  notifications: boolean;
};

export default function SettingsPage() {
  const { settings, updateSettings, theme, toggleTheme } = useSettings();
  const { notify } = useToast();

  const [form, setForm] = useState<SettingsForm>({
    name: "",
    email: "",
    language: "English",
    notifications: true,
  });

  // Sync form with global settings
  useEffect(() => {
    setForm({
      name: settings.name ?? "",
      email: settings.email ?? "",
      language: (settings as any).language ?? "English",
      notifications: (settings as any).notifications ?? true,
    });
  }, [settings]);

  // ✅ detect changes (professional UX)
  const isDirty = useMemo(() => {
    const s: any = settings;
    return (
      (form.name ?? "") !== (settings.name ?? "") ||
      (form.email ?? "") !== (settings.email ?? "") ||
      (form.language ?? "English") !== (s.language ?? "English") ||
      (form.notifications ?? true) !== (s.notifications ?? true)
    );
  }, [form, settings]);

  const emailLooksValid = useMemo(() => {
    if (!form.email.trim()) return true; // allow empty if you want
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  }, [form.email]);

  const saveSettings = () => {
    if (!emailLooksValid) {
      notify({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    updateSettings({
      name: form.name.trim(),
      email: form.email.trim(),
      language: form.language,
      notifications: form.notifications,
    } as any);

    notify({ type: "success", message: "Settings saved" });
  };

  return (
<div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold ">
            User Settings
          </h2>
          <p className="text-sm text-[color:var(--muted)] mt-1">
            Update your profile, preferences, and appearance.
          </p>
        </div>

        {/* Theme */}
       
      </div>

      {/* Profile */}
      <Section title="Profile">
        <Field label="Full name">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
            placeholder="John Doe"
          />
        </Field>

        <Field label="Email address">
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`input ${!emailLooksValid ? "border-red-500/60" : ""}`}
            placeholder="john@example.com"
            inputMode="email"
          />
          {!emailLooksValid && (
            <p className="text-xs text-red-400 mt-1">Please enter a valid email.</p>
          )}
        </Field>
      </Section>

      {/* Preferences */}
      <Section title="Preferences">
        <Field label="Language">
          <select
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            className="input"
          >
            <option>English</option>
            <option>Spanish</option>
            <option>German</option>
          </select>
        </Field>

        <Toggle
          label="Email notifications"
          checked={form.notifications}
          onChange={() => setForm({ ...form, notifications: !form.notifications })}
        />
      </Section>

      {/* Save */}
      <div className="pt-2">
        <button
          onClick={saveSettings}
          disabled={!isDirty || !emailLooksValid}
          className={`
            w-full rounded-xl py-2 text-sm font-medium
            inline-flex items-center justify-center gap-2
            transition
            ${!isDirty || !emailLooksValid
              ? "opacity-50 cursor-not-allowed bg-[color:var(--glass-border)] text-[color:var(--muted)]"
              : "btn-primary"}
          `}
        >
          <Save size={16} />
          Save changes
        </button>

        {!isDirty && (
          <p className="text-xs text-[color:var(--muted)] mt-2">
            No changes to save.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-soft rounded-2xl p-4 space-y-4 border border-[color:var(--glass-border)]">
      <h3 className="text-sm font-semibold text-[color:var(--foreground)]">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-[color:var(--muted)]">{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-[color:var(--foreground)]">{label}</span>

      <button
        type="button"
        onClick={onChange}
        role="switch"
        aria-checked={checked}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition
          border border-[color:var(--glass-border)]
          ${checked ? "bg-[color:var(--primary)]" : "bg-[color:var(--card-bg)]"}
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 rounded-full bg-white transition
            shadow-sm
            ${checked ? "translate-x-5" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
}

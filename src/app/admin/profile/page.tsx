"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";
import { useToast } from "@/components/ToastContext";
import {
  Mail,
  Shield,
  Calendar,
  Pencil,
  LogOut,
  X,
  Save,
  Sun,
  Moon,
  BadgeCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
/** stable gradient color from a string */
function stringToHsl(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  return `hsl(${h} 70% 50%)`;
}

/** Professional avatar: image if exists, else gradient initials */
function Avatar({
  src,
  name,
  email,
}: {
  src?: string;
  name?: string;
  email?: string;
}) {
  const initials = useMemo(() => {
    const n = (name || "User").trim();
    const parts = n.split(" ").filter(Boolean);
    const a = parts[0]?.[0] ?? "U";
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (a + b).toUpperCase();
  }, [name]);

  const seed = (email || name || "user").toLowerCase();
  const c1 = useMemo(() => stringToHsl(seed + "a"), [seed]);
  const c2 = useMemo(() => stringToHsl(seed + "b"), [seed]);


  return (
    <div className="relative shrink-0">
      <div
        className="absolute -inset-3 rounded-full blur-2xl opacity-60"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${c1}, transparent 60%), radial-gradient(circle at 70% 70%, ${c2}, transparent 60%)`,
        }}
      />

      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden ring-1 ring-[color:var(--glass-border)] bg-[color:var(--card-bg)] shadow-sm">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name || "Avatar"} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full grid place-items-center text-lg sm:text-xl font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
          >
            {initials}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  valueClassName = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] shadow-sm p-4">
      <div className="flex items-start gap-3 min-w-0">
        <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[color:var(--primary-soft)] text-[color:var(--foreground)]">
          {icon}
        </span>
        <div className="min-w-0">
          <div className="text-xs font-medium text-[color:var(--muted)]">{label}</div>
          <div
            className={`mt-1 text-sm font-semibold text-[color:var(--foreground)] truncate ${valueClassName}`}
            title={value}
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
const router = useRouter();
const { settings, updateSettings } = useSettings();
const { user, logout } = useAuth();
const { notify } = useToast();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(settings.name || "");
  const [email, setEmail] = useState(settings.email || "");

  useEffect(() => {
    setName(settings.name || user?.name || "");
    setEmail(settings.email || user?.email || "");
  }, [settings.name, settings.email, user?.name, user?.email]);

  const avatarSrc = undefined;

  const handleSave = () => {
  const nextName = name.trim();
  const nextEmail = email.trim();

  updateSettings({ name: nextName, email: nextEmail });
  notify({ type: "success", message: "Profile updated successfully" });
  setEditing(false);
};

const handleLogout = async () => {
  await logout();
  notify({ type: "success", message: "Logged out successfully" });
  router.replace("/login");
  router.refresh();
};
const displayName = user?.name ?? "Unknown User";
const displayEmail = user?.email ?? "No email";
const displayRole = user?.role ?? "User";

  return (
<div className="w-full max-w-6xl pb-10">
        {/* Header */}
      <div className="pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold ">Profile</h1>
          <p className="text-sm text-[color:var(--muted)] mt-1">
            Manage your account info and preferences.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          
        

          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[color:var(--primary)] text-white text-sm hover:opacity-95 transition"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[color:var(--danger)] text-white text-sm hover:opacity-95 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="mt-6 rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] shadow-sm overflow-hidden">
        <div className="h-20 sm:h-24 bg-[color:var(--primary)/0.12]" />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Left panel */}
            <div className="-mt-14 sm:-mt-16 flex flex-col sm:flex-row lg:flex-col items-center sm:items-start gap-4 lg:w-80">
              <Avatar src={avatarSrc} name={displayName} email={displayEmail} />

              <div className="min-w-0 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-[color:var(--foreground)] truncate">
                    {displayName}
                  </h2>

                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[color:var(--primary-soft)] text-[color:var(--foreground)]">
                    <BadgeCheck size={14} />
                    {displayRole}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-center sm:justify-start gap-2 text-sm text-[color:var(--muted)] min-w-0">
                  <Mail size={14} className="shrink-0" />
                  <span className="truncate">{displayEmail}</span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
<StatCard
  icon={<Shield size={16} />}
  label="Role"
  value={displayRole}
/>                <StatCard icon={<Calendar size={16} />} label="Member since" value="Jan 2024" />
                <StatCard icon={<Mail size={16} />} label="Contact" value={displayEmail} />
              </div>

              <div className="mt-4 rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] p-4">
                <h3 className="text-sm font-semibold text-[color:var(--foreground)]">About</h3>
                <p className="mt-2 text-sm text-[color:var(--muted)] leading-relaxed">
                  Keep this section short and useful. Mention your role, responsibilities, or a short
                  bio. This looks professional and helps readability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditing(false)}
          />

          <div className="relative w-full max-w-lg rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[color:var(--glass-border)]">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-[color:var(--foreground)]">
                  Edit Profile
                </h3>
                <p className="text-xs sm:text-sm text-[color:var(--muted)] mt-1">
                  Update your basic information.
                </p>
              </div>

              <button
                onClick={() => setEditing(false)}
                className="p-2 rounded-lg hover:bg-[color:var(--primary-soft)] transition"
                aria-label="Close"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              <label className="block">
                <span className="text-sm text-[color:var(--muted)]">Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[color:var(--glass-border)] bg-transparent px-3 py-2 text-sm text-[color:var(--foreground)] outline-none focus:ring-2 focus:ring-[color:var(--primary)/0.35]"
                  placeholder="Your name"
                />
              </label>

              <label className="block">
                <span className="text-sm text-[color:var(--muted)]">Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[color:var(--glass-border)] bg-transparent px-3 py-2 text-sm text-[color:var(--foreground)] outline-none focus:ring-2 focus:ring-[color:var(--primary)/0.35]"
                  placeholder="you@example.com"
                  inputMode="email"
                />
              </label>
            </div>

            <div className="p-4 sm:p-5 border-t border-[color:var(--glass-border)] flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                onClick={() => setEditing(false)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] text-sm text-[color:var(--foreground)] hover:bg-[color:var(--primary-soft)] transition"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--primary)] text-white text-sm hover:opacity-95 transition"
              >
                <Save size={16} />
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

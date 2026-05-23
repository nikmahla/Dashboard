"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  LogOut,
  User,
  Sun,
  Moon,
  Bell,
  Settings,
  HelpCircle,
  Keyboard,
  Shield,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ToastContext";

export default function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, setUser, theme, toggleTheme } = useSettings();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
    const { notify } = useToast();



  // fake notifications count
  const notificationsCount = 3;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);



  // fake actions (for now)
  const fakeAction = (label: string) => {
    console.log(`[fake] ${label}`);
    setOpen(false);
  };

  return (
    <header
      className="
       fixed top-0 inset-x-0 z-50
        h-16 px-4
        flex items-center
        glass
        border-b
        backdrop-blur-xl
        supports-[backdrop-filter]:bg-[color:var(--background)/0.6]
      "
      style={{ borderColor: "var(--glass-border)" }}
    >
      <div className="flex items-center justify-between w-full ">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="
              md:hidden p-2 rounded-lg
              text-[color:var(--foreground)]
              transition
              hover:bg-[color:var(--primary-soft)]
              active:scale-95
            "
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <h1 className="text-lg font-semibold text-[color:var(--foreground)] tracking-tight">
            Admin Panel
          </h1>
        </div>

        {/* RIGHT */}
        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          {/* NOTIFICATIONS */}
          <button
            className="
              relative
              w-10 h-10 rounded-xl
              flex items-center justify-center
              border border-[color:var(--glass-border)]
              bg-[color:var(--card-bg)]
              text-[color:var(--foreground)]
              shadow-sm
              transition
              hover:bg-[color:var(--primary-soft)]
              active:scale-95
            "
            aria-label="Notifications"
            onClick={() => fakeAction("Open notifications")}
          >
            <Bell size={18} />
            {notificationsCount > 0 && (
              <span
                className="
                  absolute -top-1 -right-1
                  min-w-[18px] h-[18px]
                  px-1
                  flex items-center justify-center
                  rounded-full
                  text-[10px] font-semibold
                  text-white
                  bg-[color:var(--danger)]
                "
              >
                {notificationsCount}
              </span>
            )}
          </button>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="
              theme-toggle
              w-10 h-10 rounded-xl
              flex items-center justify-center
              border border-[color:var(--glass-border)]
              bg-[color:var(--card-bg)]
              text-[color:var(--foreground)]
              shadow-sm
              transition
              hover:bg-[color:var(--primary-soft)]
              active:scale-95
            "
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* PROFILE BUTTON */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="
              flex items-center gap-2
              px-2 py-1
              rounded-xl
              transition
              hover:bg-[color:var(--primary-soft)]
              active:scale-95
            "
            aria-label="Open profile menu"
            aria-expanded={open}
          >
            <span className="hidden sm:block text-sm font-medium text-[color:var(--foreground)]">
              {user?.name || "User"}
            </span>

            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="h-9 w-9 rounded-xl object-cover shadow-sm"
              />
            ) : (
              <div className="h-9 w-9 rounded-xl bg-[color:var(--primary)] flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </button>

          {/* DROPDOWN */}
          <div
            className={`
              absolute right-0 top-14 w-56
              rounded-xl overflow-hidden
              border border-[color:var(--glass-border)]
              bg-[color:var(--card-bg)]
              shadow-xl backdrop-blur-xl
              transition-all duration-200 origin-top-right
              ${
                open
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }
            `}
          >
            {/* Small header */}
            <div className="px-4 py-3 border-b border-[color:var(--glass-border)]">
              <p className="text-sm font-semibold text-[color:var(--foreground)]">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-[color:var(--muted)]">{user?.email || "user@email.com"}</p>
            </div>

            {/* Main links */}
            <Link
              href="/admin/profile"
              onClick={() => setOpen(false)}
              className="
                flex items-center gap-2 px-4 py-2 text-sm
                text-[color:var(--foreground)]
                transition
                hover:bg-[color:var(--primary-soft)]
              "
            >
              <User size={16} />
              My profile
            </Link>

            <button
              onClick={() => fakeAction("Account settings")}
              className="
                w-full flex items-center gap-2 px-4 py-2 text-sm
                text-[color:var(--foreground)]
                transition
                hover:bg-[color:var(--primary-soft)]
                text-left
              "
            >
              <Settings size={16} />
              Account settings
            </button>

            <button
              onClick={() => fakeAction("Security")}
              className="
                w-full flex items-center gap-2 px-4 py-2 text-sm
                text-[color:var(--foreground)]
                transition
                hover:bg-[color:var(--primary-soft)]
                text-left
              "
            >
              <Shield size={16} />
              Security
            </button>

            <button
              onClick={() => fakeAction("Keyboard shortcuts")}
              className="
                w-full flex items-center gap-2 px-4 py-2 text-sm
                text-[color:var(--foreground)]
                transition
                hover:bg-[color:var(--primary-soft)]
                text-left
              "
            >
              <Keyboard size={16} />
              Keyboard shortcuts
            </button>

            <button
              onClick={() => fakeAction("Help & support")}
              className="
                w-full flex items-center gap-2 px-4 py-2 text-sm
                text-[color:var(--foreground)]
                transition
                hover:bg-[color:var(--primary-soft)]
                text-left
              "
            >
              <HelpCircle size={16} />
              Help & support
            </button>

            {/* Divider */}
            <div className="my-1 border-t border-[color:var(--glass-border)]" />

            {/* Logout */}
        <button
  onClick={async () => {
    
    await logout();
    router.replace("/login");
    router.refresh();
  }}
  className="
                w-full flex items-center gap-2 px-4 py-2 text-sm
                text-[color:var(--foreground)]
                transition
                hover:bg-[color:var(--primary-soft)]
                text-left   "
>
  Logout
</button>
          </div>
        </div>
      </div>
    </header>
  );
}

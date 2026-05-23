"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
const { refresh } = useAuth();
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("1234");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Login failed");
      }

      toast.notify({ type: "success", message: "Logged in" });
      router.replace("/admin");     // یا /admin/orders
  router.refresh();
      await refresh();              // ✅ user را از /api/auth/me می‌گیرد

    } catch {
      toast.notify({ type: "error", message: "Invalid email or password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md glass rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>

        <div>
          <p className="text-xs text-[color:var(--muted)]">Email</p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl p-2 bg-transparent border border-[color:var(--glass-border)] text-[color:var(--foreground)] outline-none"
          />
        </div>

        <div>
          <p className="text-xs text-[color:var(--muted)]">Password</p>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="mt-1 w-full rounded-xl p-2 bg-transparent border border-[color:var(--glass-border)] text-[color:var(--foreground)] outline-none"
          />
        </div>

        <button
          onClick={onLogin}
          disabled={loading}
          className="btn-primary w-full py-2 rounded-xl disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-xs text-[color:var(--muted)]">
          Demo: admin@test.com / 1234
        </p>
      </div>
    </div>
  );
}
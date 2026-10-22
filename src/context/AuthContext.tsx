"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type AuthUser = null | {
  sub: number;
  name: string;
  email: string;
  role: string;
};

type AuthCtx = {
  user: AuthUser;
  loading: boolean;
  refresh: () => Promise<void>;
  updateProfile: (data: { name: string; email: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const json = await res.json();
      setUser(json.user ?? null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  const updateProfile = async (data: { name: string; email: string }) => {
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update profile");
    }

    const json = await res.json();
    const u = json.user;
    if (u) {
      setUser({
        sub: u.id ?? u.sub,
        name: u.name,
        email: u.email,
        role: u.role,
      });
    } else {
      await refresh();
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, refresh, updateProfile, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http";

export type Role = "Admin" | "Editor" | "Viewer";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

const QK = ["users"] as const;

export function useUsers() {
  return useQuery({
    queryKey: QK,
    queryFn: () => http<User[]>("/api/users"),
      });
}

export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string; email: string; role: Role }) =>
      http<User>("/api/users", { method: "POST", body: JSON.stringify(payload) }),

    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: QK });

      const prev = qc.getQueryData<User[]>(QK) ?? [];
      const tempId = Date.now() * -1;

      const optimistic: User = {
        id: tempId,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      };

      qc.setQueryData<User[]>(QK, [optimistic, ...prev]);

      return { prev, tempId };
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK, ctx.prev);
    },

    onSuccess: (serverUser, _payload, ctx) => {
      qc.setQueryData<User[]>(QK, (cur = []) =>
        cur.map((u) => (u.id === ctx?.tempId ? serverUser : u))
      );
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      http<{ success: true }>(`/api/users?id=${id}`, { method: "DELETE" }),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: QK });

      const prev = qc.getQueryData<User[]>(QK) ?? [];
      qc.setQueryData<User[]>(QK, prev.filter((u) => u.id !== id));

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK, ctx.prev);
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<User> & { id: number }) =>
      http<User>("/api/users", { method: "PUT", body: JSON.stringify(patch) }),

    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey: QK });

      const prev = qc.getQueryData<User[]>(QK) ?? [];

      qc.setQueryData<User[]>(
        QK,
        prev.map((u) => (u.id === patch.id ? { ...u, ...patch } : u))
      );

      return { prev };
    },

    onError: (_err, _patch, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK, ctx.prev);
    },

    onSuccess: (serverUser) => {
      qc.setQueryData<User[]>(QK, (cur = []) =>
        cur.map((u) => (u.id === serverUser.id ? serverUser : u))
      );
    },
  });
}
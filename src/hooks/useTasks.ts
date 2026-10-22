"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http";

export type Priority = "high" | "medium" | "low";

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
};

const QK = ["tasks"] as const;

export function useTasks() {
  return useQuery({
    queryKey: QK,
    queryFn: () => http<Task[]>("/api/tasks"),
  });
}

/* ------------------ CREATE ------------------ */

export function useCreateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: { title: string; priority?: Priority }) =>
      http<Task>("/api/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: QK });

      const prev = qc.getQueryData<Task[]>(QK) ?? [];

      const now = new Date().toISOString();
      const optimistic: Task = {
        id: Date.now() * -1,
        title: payload.title,
        completed: false,
        priority: payload.priority ?? "medium",
        createdAt: now,
        updatedAt: now,
      };

      qc.setQueryData<Task[]>(QK, [optimistic, ...prev]);

      return { prev, tempId: optimistic.id };
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK, ctx.prev);
    },

    onSuccess: (serverTask, _payload, ctx) => {
      qc.setQueryData<Task[]>(QK, (cur = []) =>
        cur.map((t) => (t.id === ctx?.tempId ? serverTask : t))
      );
    },
  });
}

/* ------------------ UPDATE ------------------ */

export function useUpdateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<Task> & { id: number }) =>
      http<Task>("/api/tasks", {
        method: "PUT",
        body: JSON.stringify(patch),
      }),

    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey: QK });

      const prev = qc.getQueryData<Task[]>(QK) ?? [];

      qc.setQueryData<Task[]>(
        QK,
        prev.map((t) =>
          t.id === patch.id
            ? { ...t, ...patch, updatedAt: new Date().toISOString() }
            : t
        )
      );

      return { prev };
    },

    onError: (_err, _patch, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK, ctx.prev);
    },

    onSuccess: (serverTask) => {
      qc.setQueryData<Task[]>(QK, (cur = []) =>
        cur.map((t) => (t.id === serverTask.id ? serverTask : t))
      );
    },
  });
}

/* ------------------ DELETE ------------------ */

export function useDeleteTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      http<{ success: true }>(`/api/tasks?id=${id}`, {
        method: "DELETE",
      }),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: QK });

      const prev = qc.getQueryData<Task[]>(QK) ?? [];

      qc.setQueryData<Task[]>(QK, prev.filter((t) => t.id !== id));

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK, ctx.prev);
    },
  });
}
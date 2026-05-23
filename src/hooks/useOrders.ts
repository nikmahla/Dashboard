import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http";

export type Order = {
  id: number;
  customer: string;
  total: number;
  status: string;
  date: string;
};

type OrdersResponse = { data: Order[]; total: number };

export function useOrders(params: { page: number; pageSize: number; search: string }) {
  const { page, pageSize, search } = params;

  return useQuery<OrdersResponse>({
    queryKey: ["orders", page, pageSize, search],
    queryFn: () =>
      http<OrdersResponse>(
        `/api/orders?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`
      ),
  });
}

export function useCreateOrder(params: { page: number; pageSize: number; search: string }) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Order, "id">) =>
      http<Order>("/api/orders", { method: "POST", body: JSON.stringify(payload) }),

   onMutate: async (patch) => {
  const key = ["orders", params.page, params.pageSize, params.search] as const;

  await qc.cancelQueries({ queryKey: key });

  const prev = qc.getQueryData<OrdersResponse>(key);

      // only optimistic insert if user is on page 1 (makes sense with paging)
      if (prev && params.page === 1) {
        const temp: Order = { id: Date.now() * -1, ...patch };

        qc.setQueryData<OrdersResponse>(key, {
          data: [temp, ...prev.data],
          total: prev.total + 1,
        });

        return { prev, key, tempId: temp.id };
      }

      return { prev, key };
    },

    onError: (_e, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(ctx.key, ctx.prev);
    },

    onSuccess: (serverOrder, _payload, ctx) => {
      // replace temp item with real one
      if (ctx?.tempId) {
        qc.setQueryData<OrdersResponse>(ctx.key, (cur) => {
          if (!cur) return cur as any;
          return {
            ...cur,
            data: cur.data.map((o) => (o.id === ctx.tempId ? serverOrder : o)),
          };
        });
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrder(params: { page: number; pageSize: number; search: string }) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Order> & { id: number }) =>
      http<Order>("/api/orders", { method: "PUT", body: JSON.stringify(payload) }),

    onMutate: async (patch) => {
      const key = ["orders", params.page, params.pageSize, params.search] as const;
      const prev = qc.getQueryData<OrdersResponse>(key);

      await qc.cancelQueries({ queryKey: key });

      if (prev) {
        qc.setQueryData<OrdersResponse>(key, {
          ...prev,
          data: prev.data.map((o) => (o.id === patch.id ? { ...o, ...patch } : o)),
        });
      }

      return { prev, key };
    },

    onError: (_e, _patch, ctx) => {
      if (ctx?.prev) qc.setQueryData(ctx.key, ctx.prev);
    },

    onSuccess: (serverOrder, _patch, ctx) => {
      // ensure cache matches server final version
      qc.setQueryData<OrdersResponse>(ctx!.key, (cur) => {
        if (!cur) return cur as any;
        return {
          ...cur,
          data: cur.data.map((o) => (o.id === serverOrder.id ? serverOrder : o)),
        };
      });
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// ✅ optimistic delete (this is the one you said you don’t have)
export function useDeleteOrder(params: { page: number; pageSize: number; search: string }) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      http<{ success: true }>(`/api/orders?id=${id}`, { method: "DELETE" }),

    onMutate: async (id) => {
        const key = ["orders", params.page, params.pageSize, params.search] as const;
      const prev = qc.getQueryData<OrdersResponse>(key);

      await qc.cancelQueries({ queryKey: key });

      if (prev) {
        qc.setQueryData<OrdersResponse>(key, {
          data: prev.data.filter((o) => o.id !== id),
          total: Math.max(0, prev.total - 1),
        });
      }

      return { prev, key };
    },

    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(ctx.key, ctx.prev);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
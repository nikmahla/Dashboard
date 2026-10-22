import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http";

export type Product = {
  id: number;
  name: string;
  price: number;
  status: string;
};

type ProductsResponse = { data: Product[]; total: number };

export function useProducts(params: { page: number; pageSize: number; search: string }) {
  const { page, pageSize, search } = params;

  return useQuery<ProductsResponse>({
    queryKey: ["products", page, pageSize, search],
    queryFn: () =>
      http<ProductsResponse>(
        `/api/products?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`
      ),
    // مثل Orders: موقع سرچ/پیج عوض میشه، table نلرزه
    placeholderData: (prev) => prev,
  });
}

export function useCreateProduct(params: { page: number; pageSize: number; search: string }) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Product, "id">) =>
      http<Product>("/api/products", { method: "POST", body: JSON.stringify(payload) }),

    onMutate: async (payload) => {
      const key = ["products", params.page, params.pageSize, params.search] as const;
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<ProductsResponse>(key);

      // فقط اگر صفحه 1 هستی، منطقیه که row رو بالا اضافه کنیم
      if (prev && params.page === 1) {
        const temp: Product = { id: Date.now() * -1, ...payload };
        qc.setQueryData<ProductsResponse>(key, {
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

    onSuccess: (created, _payload, ctx) => {
      if (ctx?.tempId) {
        qc.setQueryData<ProductsResponse>(ctx.key, (cur) => {
          if (!cur) return cur as any;
          return {
            ...cur,
            data: cur.data.map((p) => (p.id === ctx.tempId ? created : p)),
          };
        });
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct(params: { page: number; pageSize: number; search: string }) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Product> & { id: number }) =>
      http<Product>("/api/products", { method: "PUT", body: JSON.stringify(payload) }),

    onMutate: async (patch) => {
      const key = ["products", params.page, params.pageSize, params.search] as const;
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<ProductsResponse>(key);

      if (prev) {
        qc.setQueryData<ProductsResponse>(key, {
          ...prev,
          data: prev.data.map((p) => (p.id === patch.id ? { ...p, ...patch } : p)),
        });
      }

      return { prev, key };
    },

    onError: (_e, _patch, ctx) => {
      if (ctx?.prev) qc.setQueryData(ctx.key, ctx.prev);
    },

    onSuccess: (serverProduct, _patch, ctx) => {
      qc.setQueryData<ProductsResponse>(ctx!.key, (cur) => {
        if (!cur) return cur as any;
        return {
          ...cur,
          data: cur.data.map((p) => (p.id === serverProduct.id ? serverProduct : p)),
        };
      });
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct(params: { page: number; pageSize: number; search: string }) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      http<{ success: true }>(`/api/products?id=${id}`, { method: "DELETE" }),

    onMutate: async (id) => {
      const key = ["products", params.page, params.pageSize, params.search] as const;
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<ProductsResponse>(key);

      if (prev) {
        qc.setQueryData<ProductsResponse>(key, {
          data: prev.data.filter((p) => p.id !== id),
          total: Math.max(0, prev.total - 1),
        });
      }

      return { prev, key };
    },

    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(ctx.key, ctx.prev);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http";

export type Customer = {
  id: number;
  name: string;
  email: string;
  orders: number;
};

export type CustomersResponse = {
  data: Customer[];
  total: number;
};

type Params = { page: number; pageSize: number; search: string };

const QK = (p: Params) => ["customers", p] as const;

export function useCustomers(p: Params) {
  return useQuery({
    queryKey: QK(p),
    queryFn: () =>
      http<CustomersResponse>(
        `/api/customers?page=${p.page}&pageSize=${p.pageSize}&search=${encodeURIComponent(p.search)}`
      ),
    keepPreviousData: true,
  });
}

export function useCreateCustomer(p: Params) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vals: Omit<Customer, "id">) =>
      http<Customer>("/api/customers", { method: "POST", body: JSON.stringify(vals) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK(p) }),
  });
}

export function useUpdateCustomer(p: Params) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vals: Customer) =>
      http<Customer>("/api/customers", { method: "PUT", body: JSON.stringify(vals) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK(p) }),
  });
}

export function useDeleteCustomer(p: Params) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      http<{ success: true }>(`/api/customers?id=${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK(p) }),
  });
}
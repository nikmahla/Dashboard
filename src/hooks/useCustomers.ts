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

export function useCustomers(p: Params) {
  const { page, pageSize, search } = p;
  
  return useQuery<CustomersResponse>({
    queryKey: ["customers", page, pageSize, search],
    queryFn: () =>
      http<CustomersResponse>(
        `/api/customers?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`
      ),
  });
}

export function useCreateCustomer(p: Params) {
  const { page, pageSize, search } = p;
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (vals: Omit<Customer, "id">) =>
      http<Customer>("/api/customers", { method: "POST", body: JSON.stringify(vals) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers", page, pageSize, search] }),
  });
}

export function useUpdateCustomer(p: Params) {
  const { page, pageSize, search } = p;
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (vals: Customer) =>
      http<Customer>("/api/customers", { method: "PUT", body: JSON.stringify(vals) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers", page, pageSize, search] }),
  });
}

export function useDeleteCustomer(p: Params) {
  const { page, pageSize, search } = p;
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) =>
      http<{ success: true }>(`/api/customers?id=${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers", page, pageSize, search] }),
  });
}
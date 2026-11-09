import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/http";

export type InventoryItem = {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  sku: string;
};

type InventoryResponse = { data: InventoryItem[]; total: number };

export function useInventory(params: { page: number; pageSize: number; search: string }) {
  const { page, pageSize, search } = params;
  return useQuery<InventoryResponse>({
    queryKey: ["inventory", page, pageSize, search],
    queryFn: () =>
      http<InventoryResponse>(
        `/api/inventory?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`
      ),
    placeholderData: (prev) => prev,
  });
}

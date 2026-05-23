"use client";

import { useMemo, useState } from "react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import ProductForm from "@/components/ProductForm";
import useDebounce from "@/hooks/useDebounce";
import { useToast } from "@/components/ToastContext";
import { useApiError } from "@/hooks/useApiError";
import {
  Product,
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/useProducts";

export default function ProductsPage() {
  const toast = useToast();
  const onApiError = useApiError();

  const [editing, setEditing] = useState<Product | null>(null);
  const [viewing, setViewing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);

  const productsQuery = useProducts({ page, pageSize, search: debouncedQuery });
  const createProduct = useCreateProduct({ page, pageSize, search: debouncedQuery });
  const updateProduct = useUpdateProduct({ page, pageSize, search: debouncedQuery });
  const deleteProduct = useDeleteProduct({ page, pageSize, search: debouncedQuery });

  const products = productsQuery.data?.data ?? [];
  const total = productsQuery.data?.total ?? 0;

  const columns = useMemo(
    () => [
      { key: "name" as const, label: "Name" },
      {
        key: "price" as const,
        label: "Price",
        align: "right" as const,
        render: (r: Product) => `$${r.price}`,
      },
      { key: "status" as const, label: "Status" },
    ],
    []
  );

  const onCreate = async (vals: { name: string; price: number; status?: string }) => {
    try {
      await createProduct.mutateAsync({
        name: vals.name,
        price: vals.price,
        status: vals.status ?? "In Stock",
      });
      setCreating(false);
      toast.notify({ type: "success", message: "Product created" });
    } catch (err) {
      onApiError(err, "Could not load customers");
    }
  };

  const onUpdate = async (vals: { id?: number; name: string; price: number; status?: string }) => {
    if (!vals.id) return;
    try {
      await updateProduct.mutateAsync({
        id: vals.id,
        name: vals.name,
        price: vals.price,
        status: vals.status ?? "In Stock",
      });
      setEditing(null);
      toast.notify({ type: "success", message: "Product updated" });
    } catch (err) {
      onApiError(err, "Could not update product");
    }
  };

  const onDelete = async (row: Product) => {
    try {
      await deleteProduct.mutateAsync(row.id);
      toast.notify({ type: "success", message: "Product deleted" });
    } catch (err) {
      onApiError(err, "Could not delete product");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
      </div>

      <DataTable
        data={products}
        columns={columns}
        searchableKey="name"
        serverSide
        query={query}
        onQueryChange={(q) => {
          setQuery(q);
          setPage(1);
        }}
        loading={productsQuery.isLoading}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
        onView={(r) => setViewing(r)}
        onEdit={(r) => setEditing(r)}
        onDelete={(r) => onDelete(r as Product)}
        onCreate={() => setCreating(true)}
      />

      <Modal open={creating} onClose={() => setCreating(false)} title="Add Product">
        <ProductForm onSubmit={onCreate} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Product">
        {editing && <ProductForm initial={editing} onSubmit={onUpdate} />}
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Product Details">
        {viewing && (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-400">Name</p>
              <p className="font-medium">{viewing.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Price</p>
              <p className="font-medium">${viewing.price}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Status</p>
              <p className="font-medium">{viewing.status}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
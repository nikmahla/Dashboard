"use client";

import { useMemo, useState } from "react";
import { Package, Plus, Pencil } from "lucide-react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import ProductForm from "@/components/ProductForm";
import useDebounce from "@/hooks/useDebounce";
import { useToast } from "@/components/ToastContext";
import { useApiError } from "@/hooks/useApiError";
import { ui } from "@/lib/ui";
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
        numeric: true,
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
      onApiError(err, "Could not create product");
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
    <div className={ui.spacing.pageY}>
      <header>
        <h1 className={ui.typography.pageTitle}>Products</h1>
        <p className={`mt-1 ${ui.typography.pageSubtitle}`}>
          Manage catalog items, pricing, and stock status
        </p>
      </header>

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
        entityLabel="Product"
        deleteTitle="Delete product?"
        deleteDescription="This product will be permanently removed from your catalog."
        getDeleteLabel={(r) => (r as Product).name}
        onView={(r) => setViewing(r)}
        onEdit={(r) => setEditing(r)}
        onDelete={(r) => onDelete(r as Product)}
        onCreate={() => setCreating(true)}
      />

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Add product"
        subtitle="Fill in the details below to add a new catalog item"
        icon={<Plus size={18} />}
      >
        <ProductForm onSubmit={onCreate} />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit product"
        subtitle="Update product information"
        icon={<Pencil size={18} />}
      >
        {editing && <ProductForm initial={editing} onSubmit={onUpdate} />}
      </Modal>

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="Product details"
        subtitle="Read-only view of this catalog item"
        icon={<Package size={18} />}
      >
        {viewing && (
          <dl className="space-y-4">
            <DetailField label="Name" value={viewing.name} />
            <DetailField label="Price" value={`$${viewing.price}`} />
            <DetailField label="Status" value={viewing.status} />
          </dl>
        )}
      </Modal>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={ui.typography.caption}>{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-[color:var(--foreground)]">{value}</dd>
    </div>
  );
}

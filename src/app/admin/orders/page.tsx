"use client";

import { useMemo, useState } from "react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import OrderForm from "@/components/OrderForm";
import { Package, Plus, Pencil } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { useToast } from "@/components/ToastContext";
import * as useOrders from "@/hooks/useOrders";
import { useApiError } from "@/hooks/useApiError";
export default function OrdersPage() {
  const toast = useToast();

  const [selected, setSelected] = useState<useOrders.Order | null>(null);
  const [editing, setEditing] = useState<useOrders.Order | null>(null);
  const [adding, setAdding] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);

const onApiError = useApiError();
  const ordersQuery = useOrders.useOrders({ page, pageSize, search: debouncedQuery });

const createOrder = useOrders.useCreateOrder({ page, pageSize, search: debouncedQuery });
const updateOrder = useOrders.useUpdateOrder({ page, pageSize, search: debouncedQuery });
const deleteOrder = useOrders.useDeleteOrder({ page, pageSize, search: debouncedQuery });

const data = ordersQuery.data;
const orders: useOrders.Order[] = data?.data ?? [];
const total = data?.total ?? 0;

  // show “Searching…” while typing (keepPreviousData keeps table stable)
  const searchLoading = useMemo(() => {
    const typing = query !== debouncedQuery;
    return typing || (ordersQuery.isFetching && !ordersQuery.isLoading);
  }, [query, debouncedQuery, ordersQuery.isFetching, ordersQuery.isLoading]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Orders</h2>

        {searchLoading && (
          <div className="text-sm text-slate-500 animate-pulse">Searching…</div>
        )}
      </div>

      <DataTable
        data={orders}
        searchableKey="customer"
        serverSide
        query={query}
        onQueryChange={(q) => {
          setQuery(q);
          setPage(1);
        }}
        loading={ordersQuery.isLoading}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
        columns={[
          { key: "customer", label: "Customer" },
          { key: "date", label: "Date" },
          { key: "status", label: "Status" },
          {
            key: "total",
            label: "Total",
            align: "right",
            render: (r) => `$${(r as useOrders.Order).total}`,
          },
        ]}
        onView={(row) => setSelected(row)}
        onEdit={(row) => setEditing(row)}
        onDelete={async (row) => {
  try {
    await deleteOrder.mutateAsync(row.id);
    toast.notify({ type: "success", message: "Order deleted" });
  } catch (err) {
    onApiError(err, "Could not delete order");
  }
}}
        onCreate={() => setAdding(true)}
      />

      {/* Add */}
      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Add New Order"
        icon={<Plus size={18} />}
      >
        <OrderForm
          onSubmit={async (vals) => {
  try {
    await createOrder.mutateAsync({
      customer: vals.customer,
      total: vals.total,
      status: vals.status ?? "Pending",
      date: vals.date,
    });
    setAdding(false);
    toast.notify({ type: "success", message: "Order created" });
  } catch (err) {
    onApiError(err, "Could not create order");
  }
}}
        />
      </Modal>

      {/* View */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Order Details"
        icon={<Package size={18} />}
      >
        {selected && (
          <div className="space-y-4">
            <Detail label="Customer" value={selected.customer} />
            <Detail label="Date" value={selected.date} />
            <Detail label="Status" value={selected.status} />
            <Detail label="Total" value={`$${selected.total}`} />

            <button
              onClick={() => {
                setEditing(selected);
                setSelected(null);
              }}
              className="glass px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition flex items-center gap-2"
            >
              <Pencil size={16} />
              Edit Order
            </button>
          </div>
        )}
      </Modal>

      {/* Edit */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Order"
        icon={<Pencil size={18} />}
      >
        {editing && (
          <OrderForm
            initial={editing}
            onSubmit={async (vals) => {
            try {
  await updateOrder.mutateAsync(vals as any);
  toast.notify({ type: "success", message: "Order updated" });
  setEditing(null);
} catch (err) {
  onApiError(err, "Could not update order");
}
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[color:var(--muted)]">{label}</p>
      <p className="text-sm font-medium text-[color:var(--foreground)]">{value}</p>
    </div>
  );
}
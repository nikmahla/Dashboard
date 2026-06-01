"use client";

import { useMemo, useState } from "react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import OrderForm from "@/components/OrderForm";
import { Package, Plus } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { useToast } from "@/components/ToastContext";
import * as useOrders from "@/hooks/useOrders";
import { useApiError } from "@/hooks/useApiError";
import { ui } from "@/lib/ui";

export default function OrdersPage() {
  const toast = useToast();
  const onApiError = useApiError();

  const [selected, setSelected] = useState<useOrders.Order | null>(null);
  const [editing, setEditing] = useState<useOrders.Order | null>(null);
  const [adding, setAdding] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);

  const ordersQuery = useOrders.useOrders({ page, pageSize, search: debouncedQuery });
  const createOrder = useOrders.useCreateOrder({ page, pageSize, search: debouncedQuery });
  const updateOrder = useOrders.useUpdateOrder({ page, pageSize, search: debouncedQuery });
  const deleteOrder = useOrders.useDeleteOrder({ page, pageSize, search: debouncedQuery });

  const orders: useOrders.Order[] = ordersQuery.data?.data ?? [];
  const total = ordersQuery.data?.total ?? 0;

  const searchLoading = useMemo(() => {
    const typing = query !== debouncedQuery;
    return typing || (ordersQuery.isFetching && !ordersQuery.isLoading);
  }, [query, debouncedQuery, ordersQuery.isFetching, ordersQuery.isLoading]);

  const isSaving = createOrder.isLoading || updateOrder.isLoading;

  return (
    <div className={ui.spacing.pageY}>
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className={ui.typography.pageTitle}>Orders</h1>
          <p className={`mt-1 ${ui.typography.pageSubtitle}`}>
            Track customer orders and fulfillment status
          </p>
        </div>
        {searchLoading && (
          <p className={`${ui.typography.caption} animate-pulse`}>Searching…</p>
        )}
      </header>

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
            numeric: true,
            render: (r) => `$${(r as useOrders.Order).total}`,
          },
        ]}
        entityLabel="Order"
        deleteTitle="Delete order?"
        deleteDescription="This order will be permanently removed. This cannot be undone."
        getDeleteLabel={(r) => {
          const o = r as useOrders.Order;
          return `${o.customer} · ${o.date}`;
        }}
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

      <Modal
        open={adding || !!editing}
        onClose={() => {
          setAdding(false);
          setEditing(null);
        }}
        title={editing ? "Edit order" : "Add new order"}
        subtitle={editing ? "Update order details" : "Enter customer and order details"}
        icon={<Plus size={18} />}
      >
        <OrderForm
          initial={editing ?? undefined}
          onSubmit={async (vals) => {
            try {
              if (editing) {
                await updateOrder.mutateAsync({
                  id: vals.id ?? editing.id,
                  customer: vals.customer,
                  total: vals.total,
                  status: vals.status,
                  date: vals.date,
                });
                toast.notify({ type: "success", message: "Order updated" });
              } else {
                await createOrder.mutateAsync({
                  customer: vals.customer,
                  total: vals.total,
                  status: vals.status ?? "Pending",
                  date: vals.date,
                });
                toast.notify({ type: "success", message: "Order created" });
              }
              setAdding(false);
              setEditing(null);
            } catch (err) {
              onApiError(err, editing ? "Could not update order" : "Could not create order");
            }
          }}
        />
      </Modal>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Order details"
        subtitle="Read-only summary of this order"
        icon={<Package size={18} />}
      >
        {selected && (
          <dl className="space-y-4">
            <Detail label="Customer" value={selected.customer} />
            <Detail label="Date" value={selected.date} />
            <Detail label="Status" value={selected.status} />
            <Detail label="Total" value={`$${selected.total}`} />
          </dl>
        )}
      </Modal>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={ui.typography.caption}>{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-[color:var(--foreground)]">{value}</dd>
    </div>
  );
}

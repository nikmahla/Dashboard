"use client";

import StatusBadge from "@/components/ui/StatusBadge";
import { money, shortDate } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";
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
import Tabs from "@/components/ui/Tabs";

const STATUSES = ["Pending", "Completed", "Cancelled"] as const;

export default function OrdersPage() {
  const toast = useToast();
  const onApiError = useApiError();

  const { canWrite } = useAuth();
  const [selected, setSelected] = useState<useOrders.Order | null>(null);
  const [editing, setEditing] = useState<useOrders.Order | null>(null);
  const [adding, setAdding] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);
  const [status, setStatus] = useState("");

  const ordersQuery = useOrders.useOrders({ page, pageSize, search: debouncedQuery, status });
  const createOrder = useOrders.useCreateOrder({ page, pageSize, search: debouncedQuery, status });
  const updateOrder = useOrders.useUpdateOrder({ page, pageSize, search: debouncedQuery, status });
  const deleteOrder = useOrders.useDeleteOrder({ page, pageSize, search: debouncedQuery, status });

  const orders: useOrders.Order[] = ordersQuery.data?.data ?? [];
  const total = ordersQuery.data?.total ?? 0;
  const facets = ordersQuery.data?.facets;
  const tabs = [
    { value: "", label: "All", count: facets ? Object.values(facets).reduce((a, b) => a + b, 0) : undefined },
    ...STATUSES.map((s) => ({ value: s, label: s, count: facets ? (facets[s] ?? 0) : undefined })),
  ];

  const searchLoading = useMemo(() => {
    const typing = query !== debouncedQuery;
    return typing || (ordersQuery.isFetching && !ordersQuery.isLoading);
  }, [query, debouncedQuery, ordersQuery.isFetching, ordersQuery.isLoading]);

  const isSaving = createOrder.isPending || updateOrder.isPending;

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

      <Tabs
        label="Filter orders by status"
        items={tabs}
        value={status}
        onChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
      />

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
          { key: "date", label: "Date", render: (r) => shortDate((r as useOrders.Order).date) },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={(r as useOrders.Order).status} /> },
          {
            key: "total",
            label: "Total",
            numeric: true,
            render: (r) => money((r as useOrders.Order).total),
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
        onEdit={canWrite ? (row) => setEditing(row) : undefined}
        onDelete={!canWrite ? undefined : async (row) => {
          try {
            await deleteOrder.mutateAsync(row.id);
            toast.notify({ type: "success", message: "Order deleted" });
          } catch (err) {
            onApiError(err, "Could not delete order");
          }
        }}
        onCreate={canWrite ? () => setAdding(true) : undefined}
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
          <dl className="detail-list">
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
    <div className="detail-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

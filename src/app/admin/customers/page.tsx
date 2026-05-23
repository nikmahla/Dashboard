"use client";

import { useState } from "react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import CustomerForm from "@/components/CustomerForm";
import useDebounce from "@/hooks/useDebounce";
import { useToast } from "@/components/ToastContext";
import { useApiError } from "@/hooks/useApiError";

import {
  Customer,
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "@/hooks/useCustomers";

export default function CustomersPage() {
  const { notify } = useToast();
  const onApiError = useApiError();

  const [viewing, setViewing] = useState<Customer | null>(null);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [creating, setCreating] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);

  const params = { page, pageSize, search: debouncedQuery };

  const customersQuery = useCustomers(params);
  const createCustomer = useCreateCustomer(params);
  const updateCustomer = useUpdateCustomer(params);
  const deleteCustomer = useDeleteCustomer(params);

  const customers = customersQuery.data?.data ?? [];
  const total = customersQuery.data?.total ?? 0;

  const loading =
  customersQuery.isLoading ||     
  createCustomer.isPending ||
  updateCustomer.isPending ||
  deleteCustomer.isPending;

const refreshing = customersQuery.isFetching && !customersQuery.isLoading;

  const handleCreate = async (vals: { name: string; email: string; orders: number }) => {
    try {
      await createCustomer.mutateAsync(vals);
      notify({ type: "success", message: "Customer created" });
      setCreating(false);
    } catch (err) {
      onApiError(err, "Could not create customer");
    }
  };

  const handleUpdate = async (vals: { id?: number; name: string; email: string; orders: number }) => {
    if (!vals.id) return;
    try {
      await updateCustomer.mutateAsync(vals as Customer);
      notify({ type: "success", message: "Customer updated" });
      setEditing(null);
    } catch (err) {
      onApiError(err, "Could not update customer");
    }
  };

  const handleDelete = async (row: Customer) => {
    try {
      await deleteCustomer.mutateAsync(row.id);
      notify({ type: "success", message: "Customer deleted" });
    } catch (err) {
      onApiError(err, "Could not delete customer");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
  <h2 className="text-2xl font-bold mb-6">Customers</h2>

  {refreshing && (
    <span className="text-xs text-[color:var(--muted)] animate-pulse">
      Refreshing...
    </span>
  )}
</div>

      <DataTable
        data={customers}
        searchableKey="name"
        serverSide
        query={query}
        onQueryChange={(q) => {
          setQuery(q);
          setPage(1);
        }}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "orders", label: "Orders", align: "right" },
        ]}
        onView={(row) => setViewing(row)}
        onEdit={(row) => setEditing(row)}
        onDelete={(row) => handleDelete(row)}
        onCreate={() => setCreating(true)}
        getDeleteLabel={(row) => `${row.name} (${row.email})`}
      />

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Customer Details">
        {viewing && (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-400">Name</p>
              <p className="font-medium">{viewing.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="font-medium">{viewing.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Orders</p>
              <p className="font-medium">{viewing.orders}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={creating} onClose={() => setCreating(false)} title="Add Customer">
        <CustomerForm onSubmit={handleCreate} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Customer">
        {editing && <CustomerForm initial={editing} onSubmit={handleUpdate} />}
      </Modal>
    </div>
  );
}
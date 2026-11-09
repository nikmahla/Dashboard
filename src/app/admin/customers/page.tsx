"use client";

import { useAuth } from "@/context/AuthContext";
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
  const { canWrite } = useAuth();
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

  const customers: Customer[] = (customersQuery.data as any)?.data ?? [];
  const total = (customersQuery.data as any)?.total ?? 0;

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
          { key: "orders", label: "Orders", numeric: true },
        ]}
        onView={(row) => setViewing(row)}
        onEdit={canWrite ? (row) => setEditing(row) : undefined}
        onDelete={canWrite ? (row) => handleDelete(row) : undefined}
        onCreate={canWrite ? () => setCreating(true) : undefined}
        entityLabel="Customer"
        deleteTitle="Delete customer?"
        deleteDescription="This customer record will be permanently removed."
        getDeleteLabel={(row) => `${row.name} (${row.email})`}
      />

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Customer Details">
        {viewing && (
          <div className="detail-list">
            <div className="detail-row"><p className="dt">Name</p><p className="dd">{viewing.name}</p></div>
            <div className="detail-row"><p className="dt">Email</p><p className="dd">{viewing.email}</p></div>
            <div className="detail-row"><p className="dt">Orders</p><p className="dd">{viewing.orders}</p></div>
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
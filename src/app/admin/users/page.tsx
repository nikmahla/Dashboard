"use client";

import { useMemo, useState, useEffect } from "react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { UserPlus, Pencil, User as UserIcon } from "lucide-react";
import { useToast } from "@/components/ToastContext";
import {
  Role,
  User,
  useUsers,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from "@/hooks/useUsers";

function UserForm({
  onSubmit,
  submitting,
  initial,
}: {
  onSubmit: (vals: { id?: number; name: string; email: string; role: Role }) => Promise<void> | void;
  submitting?: boolean;
  initial?: User | null;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [role, setRole] = useState<Role>((initial?.role as Role) ?? "Viewer");

  useEffect(() => {
    setName(initial?.name ?? "");
    setEmail(initial?.email ?? "");
    setRole((initial?.role as Role) ?? "Viewer");
  }, [initial]);

  const canSubmit = name.trim().length > 0 && email.trim().length > 0;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-[color:var(--muted)]">Name</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl p-2 bg-transparent border border-[color:var(--glass-border)] text-[color:var(--foreground)] outline-none"
          placeholder="e.g. Sara Connor"
        />
      </div>

      <div>
        <p className="text-xs text-[color:var(--muted)]">Email</p>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl p-2 bg-transparent border border-[color:var(--glass-border)] text-[color:var(--foreground)] outline-none"
          placeholder="e.g. sara@example.com"
        />
      </div>

      <div>
        <p className="text-xs text-[color:var(--muted)]">Role</p>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="mt-1 w-full rounded-xl p-2 bg-transparent border border-[color:var(--glass-border)] text-[color:var(--foreground)] outline-none"
        >
          <option value="Viewer">Viewer</option>
          <option value="Editor">Editor</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={() =>
            onSubmit({
              id: initial?.id,
              name: name.trim(),
              email: email.trim(),
              role,
            })
          }
          disabled={!canSubmit || submitting}
          className="btn-primary px-4 py-2 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
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

export default function UsersPage() {
  const toast = useToast();

  const usersQuery = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const users = usersQuery.data ?? [];
  const loading = usersQuery.isLoading;

  const [adding, setAdding] = useState(false);
  const [viewing, setViewing] = useState<User | null>(null);
  const [editing, setEditing] = useState<User | null>(null);

  const columns = useMemo(
    () => [
      { key: "name" as const, label: "Name" },
      { key: "email" as const, label: "Email" },
      { key: "role" as const, label: "Role" },
    ],
    []
  );

 const onCreateUser = async (vals: { name: string; email: string; role: Role }) => {
  try {
    await createUser.mutateAsync(vals); 
    setAdding(false);
    toast.notify({ type: "success", message: "User created" });
  } catch (err) {
    toast.notify({ type: "error", message: "Could not create user" });
  }
};

  const onUpdateUser = async (vals: { id?: number; name: string; email: string; role: Role }) => {
    if (!vals.id) return;
    try {
      await updateUser.mutateAsync(vals as any);
      setEditing(null);
      toast.notify({ type: "success", message: "User updated" });
    } catch {
      toast.notify({ type: "error", message: "Could not update user" });
    }
  };

  const onDeleteUser = async (row: User) => {
    try {
      await deleteUser.mutateAsync(row.id);
      toast.notify({ type: "success", message: "User deleted" });
    } catch {
      toast.notify({ type: "error", message: "Could not delete user" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Users</h2>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchableKey="name"
        serverSide={false}
        loading={loading || deleteUser.isPending}
        onCreate={() => setAdding(true)}
        onView={(row) => setViewing(row)}
        onEdit={(row) => setEditing(row)}
        onDelete={onDeleteUser}
        entityLabel="User"
        deleteTitle="Delete user?"
        deleteDescription="This user account will be permanently removed from the system."
        getDeleteLabel={(u) => `${u.name} (${u.email})`}
      />

      {/* Add */}
      <Modal
        open={adding}
        onClose={() => {
          if (!createUser.isPending) setAdding(false);
        }}
        title="Add New User"
        icon={<UserPlus size={18} />}
      >
        <UserForm onSubmit={onCreateUser} submitting={createUser.isPending} />
      </Modal>

      {/* View */}
      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="User Details"
        icon={<UserIcon size={18} />}
      >
        {viewing && (
          <div className="space-y-4">
            <Detail label="Name" value={viewing.name} />
            <Detail label="Email" value={viewing.email} />
            <Detail label="Role" value={viewing.role} />

            <button
              onClick={() => {
                setEditing(viewing);
                setViewing(null);
              }}
              className="glass px-4 py-2 rounded-lg text-sm font-medium hover:bg-[color:var(--surface-hover)] transition flex items-center gap-2"
            >
              <Pencil size={16} />
              Edit User
            </button>
          </div>
        )}
      </Modal>

      {/* Edit */}
      <Modal
        open={!!editing}
        onClose={() => {
          if (!updateUser.isPending) setEditing(null);
        }}
        title="Edit User"
        icon={<Pencil size={18} />}
      >
        {editing && (
          <UserForm
            initial={editing}
            onSubmit={onUpdateUser}
            submitting={updateUser.isPending}
          />
        )}
      </Modal>
    </div>
  );
}
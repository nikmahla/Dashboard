'use client';

import { useState } from 'react';
import { ui, cn } from '@/lib/ui';

export default function CustomerForm({
  initial,
  onSubmit,
}: {
  initial?: { id?: number; name?: string; email?: string; orders?: number };
  onSubmit: (vals: { id?: number; name: string; email: string; orders: number }) => void;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [orders, setOrders] = useState(initial?.orders ?? 0);

  return (
    <div className="space-y-5">

      {/* Name */}
      <label className="block">
        <span className="text-sm font-medium text-[color:var(--muted)]">
          Name
        </span>
        <input
        placeholder='Enter Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={cn(
              'mt-1 w-full px-3 py-2 bg-[color:var(--card-bg)] border border-[color:var(--glass-border)] text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:border-transparent transition-all',
              ui.radius.md,
              ui.shadow.sm
            )}
        />
      </label>

      {/* Email */}
      <label className="block">
        <span className="text-sm font-medium text-[color:var(--muted)]">
          Email
        </span>
        <input
placeholder='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
              'mt-1 w-full px-3 py-2 bg-[color:var(--card-bg)] border border-[color:var(--glass-border)] text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:border-transparent transition-all',
              ui.radius.md,
              ui.shadow.sm
            )}
        />
      </label>

      {/* Orders */}
      <label className="block">
        <span className="text-sm font-medium text-[color:var(--muted)]">
          Orders
        </span>
        <input
        placeholder='Add Number'
          type="number"
          value={String(orders)}
          onChange={(e) => setOrders(Number(e.target.value))}
          className={cn(
              'mt-1 w-32 px-3 py-2 bg-[color:var(--card-bg)] border border-[color:var(--glass-border)] text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:border-transparent transition-all',
              ui.radius.md,
              ui.shadow.sm
            )}
        />
      </label>

      {/* Actions */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() =>
            onSubmit({
              id: initial?.id,
              name: name.trim(),
              email: email.trim(),
              orders,
            })
          }
          className={cn(
            'px-5 py-2 text-sm font-medium bg-[color:var(--primary)] text-white hover:opacity-90 active:scale-95 transition-all',
            ui.radius.md,
            ui.shadow.md
          )}
        >
          Save
        </button>
      </div>
    </div>
  );
}

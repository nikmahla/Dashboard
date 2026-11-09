'use client';

import { useState } from 'react';

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
    <form
      className="form-stack"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ id: initial?.id, name: name.trim(), email: email.trim(), orders });
      }}
    >
      <label className="field">
        <span className="field-label">Name</span>
        <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label className="field">
        <span className="field-label">Email</span>
        <input className="input" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <label className="field">
        <span className="field-label">Orders</span>
        <input className="input sm:max-w-[10rem]" type="number" min={0} placeholder="0" value={String(orders)} onChange={(e) => setOrders(Number(e.target.value))} />
        <span className="field-hint">Total orders placed by this customer</span>
      </label>

      <div className="form-actions">
        <button type="submit" className="btn-primary px-5 py-2 text-sm">Save</button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";

export default function OrderForm({
  initial,
  onSubmit,
}: {
  initial?: {
    id?: number;
    customer?: string;
    total?: number;
    status?: string;
    date?: string;
  };
  onSubmit: (vals: {
    id?: number;
    customer: string;
    total: number;
    status?: string;
    date: string;
  }) => void;
}) {
  const [customer, setCustomer] = useState(initial?.customer || "");
  const [total, setTotal] = useState(initial?.total ?? 0);
  const [status, setStatus] = useState(initial?.status || "Pending");
  const [date, setDate] = useState(
    initial?.date || new Date().toISOString().slice(0, 10)
  );

  return (
    <form
      className="form-stack"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ id: initial?.id, customer: customer.trim(), total, status, date });
      }}
    >
      <label className="field">
        <span className="field-label">Customer</span>
        <input className="input" placeholder="Customer name" value={customer} onChange={(e) => setCustomer(e.target.value)} />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field">
          <span className="field-label">Total</span>
          <input className="input" type="number" min={0} step="0.01" value={String(total)} onChange={(e) => setTotal(Number(e.target.value))} />
        </label>
        <label className="field">
          <span className="field-label">Status</span>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Pending</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </label>
      </div>

      <label className="field">
        <span className="field-label">Date</span>
        <input className="input sm:max-w-[12rem]" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn-primary px-5 py-2 text-sm">Save</button>
      </div>
    </form>
  );
}

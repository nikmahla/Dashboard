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
    <div className="space-y-5">

      {/* Customer */}
      <label className="block">
        <span className="text-sm font-medium text-[color:var(--muted)]">
          Customer
        </span>
        <input
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="
            mt-1 w-full rounded-xl px-3 py-2
            bg-[color:var(--card-bg)]
            border border-[color:var(--glass-border)]
            text-[color:var(--foreground)]
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]
            transition-all
          "
        />
      </label>

      {/* Total */}
      <label className="block">
        <span className="text-sm font-medium text-[color:var(--muted)]">
          Total
        </span>
        <input
          type="number"
          value={String(total)}
          onChange={(e) => setTotal(Number(e.target.value))}
          className="
            mt-1 w-full rounded-xl px-3 py-2
            bg-[color:var(--card-bg)]
            border border-[color:var(--glass-border)]
            text-[color:var(--foreground)]
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]
            transition-all
          "
        />
      </label>

      {/* Status */}
      <label className="block">
        <span className="text-sm font-medium text-[color:var(--muted)]">
          Status
        </span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="
            mt-1 w-48 rounded-xl px-3 py-2
            bg-[color:var(--card-bg)]
            border border-[color:var(--glass-border)]
            text-[color:var(--foreground)]
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]
            transition-all
          "
        >
          <option>Pending</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </label>

      {/* Date */}
      <label className="block">
        <span className="text-sm font-medium text-[color:var(--muted)]">
          Date
        </span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="
            mt-1 w-48 rounded-xl px-3 py-2
            bg-[color:var(--card-bg)]
            border border-[color:var(--glass-border)]
            text-[color:var(--foreground)]
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]
            transition-all
          "
        />
      </label>

      {/* Actions */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() =>
            onSubmit({
              id: initial?.id,
              customer: customer.trim(),
              total,
              status,
              date,
            })
          }
          className="
            px-5 py-2 rounded-xl text-sm font-medium
            bg-[color:var(--primary)] text-white
            shadow-md
            hover:opacity-90 active:scale-95
            transition-all
          "
        >
          Save
        </button>
      </div>
    </div>
  );
}

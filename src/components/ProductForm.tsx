"use client";

import { useState } from 'react';

export default function ProductForm({
  initial,
  onSubmit,
}: {
  initial?: { id?: number; name?: string; price?: number; status?: string };
  onSubmit: (vals: { id?: number; name: string; price: number; status?: string }) => void;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [status, setStatus] = useState(initial?.status || 'In Stock');

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-sm text-slate-600">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2 bg-transparent"
        />
      </label>

      <label className="block">
        <span className="text-sm text-slate-600">Price</span>
        <input
          type="number"
          value={String(price)}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="mt-1 block w-full border rounded px-3 py-2 bg-transparent"
        />
      </label>

      <label className="block">
        <span className="text-sm text-slate-600">Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-48 border rounded px-3 py-2 bg-transparent">
          <option>In Stock</option>
          <option>Out of Stock</option>
        </select>
      </label>

      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => onSubmit({ id: initial?.id, name: name.trim(), price, status })}
          className="px-4 py-2 rounded bg-indigo-600 text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
}

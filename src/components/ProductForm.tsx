'use client';

import { useState } from 'react';

type ProductFormProps = {
  initial?: { id?: number; name?: string; price?: number; status?: string };
  onSubmit: (vals: { id?: number; name: string; price: number; status?: string }) => void;
  onCancel?: () => void;
};

export default function ProductForm({ initial, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState(initial?.name || '');
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [status, setStatus] = useState(initial?.status || 'In Stock');

  return (
    <form
      className="form-stack"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ id: initial?.id, name: name.trim(), price, status });
      }}
    >
      <label className="field">
        <span className="field-label">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input"
          placeholder="Product name"
        />
      </label>

      <label className="field">
        <span className="field-label">Price</span>
        <input
          type="number"
          min={0}
          step="0.01"
          value={String(price)}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          className="input"
          placeholder="0.00"
        />
      </label>

      <label className="field">
        <span className="field-label">Status</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input sm:max-w-xs"
        >
          <option>In Stock</option>
          <option>Out of Stock</option>
        </select>
      </label>

      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary px-4 py-2 text-sm">
          Save product
        </button>
      </div>
    </form>
  );
}

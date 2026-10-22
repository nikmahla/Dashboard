'use client';

import { useState } from 'react';
import { ui, cn } from '@/lib/ui';

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
      className={ui.spacing.stackMd}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ id: initial?.id, name: name.trim(), price, status });
      }}
    >
      <label className="block">
        <span className={ui.typography.label}>Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={cn('input mt-1.5')}
          placeholder="Product name"
        />
      </label>

      <label className="block">
        <span className={ui.typography.label}>Price</span>
        <input
          type="number"
          min={0}
          step="0.01"
          value={String(price)}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          className={cn('input mt-1.5')}
          placeholder="0.00"
        />
      </label>

      <label className="block">
        <span className={ui.typography.label}>Status</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={cn('input mt-1.5 max-w-xs')}
        >
          <option>In Stock</option>
          <option>Out of Stock</option>
        </select>
      </label>

      <div className="flex justify-end gap-2 border-t border-[color:var(--glass-border)] pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={cn(
              'px-4 py-2 text-sm font-medium',
              ui.radius.md,
              'border border-[color:var(--glass-border)] text-[color:var(--foreground)]',
              'hover:bg-[var(--primary-soft)]'
            )}
          >
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

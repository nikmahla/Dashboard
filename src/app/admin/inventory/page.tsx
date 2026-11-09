"use client";

import { useState } from "react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import useDebounce from "@/hooks/useDebounce";
import { useInventory } from "@/hooks/useInventory";
import { LOW_STOCK_LIMIT } from "@/lib/dashboard-summary-constants";
import { money } from "@/lib/format";
import { ui } from "@/lib/ui";

function stockStatus(stock: number) {
  if (stock === 0) return "Out of Stock";
  if (stock < LOW_STOCK_LIMIT) return "Low";
  return "In Stock";
}

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 350);

  const inventory = useInventory({ page, pageSize, search: debounced });

  return (
    <div className={ui.spacing.pageY}>
      <header>
        <h1 className={ui.typography.pageTitle}>Inventory</h1>
        <p className={`mt-1 ${ui.typography.pageSubtitle}`}>
          Units on hand per item. Items with fewer than {LOW_STOCK_LIMIT} units are flagged.
        </p>
      </header>

      <DataTable
        data={(inventory.data?.data ?? []).map((r) => ({ ...r, status: stockStatus(r.stock) }))}
        searchableKey="name"
        serverSide
        query={query}
        onQueryChange={(q) => {
          setQuery(q);
          setPage(1);
        }}
        loading={inventory.isLoading}
        page={page}
        pageSize={pageSize}
        total={inventory.data?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
        columns={[
          { key: "name", label: "Item" },
          { key: "sku", label: "SKU" },
          { key: "category", label: "Category" },
          { key: "stock", label: "In stock", numeric: true },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
          { key: "price", label: "Price", numeric: true, render: (r) => money(Number(r.price)) },
        ]}
        entityLabel="Item"
      />
    </div>
  );
}

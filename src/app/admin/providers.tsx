"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function AdminProviders({ children }: { children: React.ReactNode }) {
  // مهم: QueryClient باید فقط یکبار ساخته بشه
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,          // 30s => خیلی کمتر refetch می‌زنه، کمتر چشمک
            gcTime: 10 * 60_000,        // 10m
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
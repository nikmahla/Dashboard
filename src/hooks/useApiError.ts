"use client";

import { useCallback } from "react";
import { useToast } from "@/components/ToastContext";

type ApiErr = any;

export function useApiError() {
  const toast = useToast();

  return useCallback(
    (err: ApiErr, fallback = "Something went wrong") => {
      // Support different error shapes from `http()` and fetch
      const status = err?.status;
      const text = err?.text ?? err?.bodyText ?? err?.message ?? null;

      let msg = fallback;

      // If body is JSON with `{ message }`
      try {
        const j = typeof text === 'string' ? JSON.parse(text) : null;
        if (j?.message) msg = j.message;
      } catch {
        // if text is plain string use it
        if (typeof text === 'string' && text.trim() !== '') msg = text;
      }

      if (status === 401) msg = "Unauthorized (please login again)";
      toast.notify({ type: "error", message: msg });
    },
    [toast]
  );
}
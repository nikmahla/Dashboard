"use client";

import { useCallback } from "react";
import { useToast } from "@/components/ToastContext";

type ApiErr = any;

export function useApiError() {
  const toast = useToast();

  return useCallback(
    (err: ApiErr, fallback = "Something went wrong") => {
      // اگر از http helper خودت throw {status,text} می‌کنی:
      const status = err?.status;
      const text = err?.text;

      let msg = fallback;

      // اگر بدنه JSON بود
      try {
        const j = text ? JSON.parse(text) : null;
        if (j?.message) msg = j.message;
      } catch {
        // ignore
      }

      if (status === 401) msg = "Unauthorized (please login again)";
      toast.notify({ type: "error", message: msg });
    },
    [toast]
  );
}
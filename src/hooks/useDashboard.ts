import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/http";
import type { DashboardSummary } from "@/lib/dashboard-summary";
import { useRange } from "@/context/RangeContext";

export type { DashboardSummary };

export function useDashboardSummary() {
  const { days } = useRange();
  return useQuery<DashboardSummary>({
    queryKey: ["dashboard", "summary", days],
    queryFn: () => http<DashboardSummary>(`/api/dashboard/summary?days=${days}`),
    placeholderData: (prev) => prev,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { getWeeklySummary } from "@/app/actions/admin";
import { queryKeys } from "@/lib/queryKeys";

export function useWeeklySummary() {
  return useQuery({
    queryKey: queryKeys.weeklySummary,
    queryFn: getWeeklySummary,
  });
}

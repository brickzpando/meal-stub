"use client";

import { getSystemStats } from "@/app/actions/employee";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useSystemStats() {
  return useQuery({
    queryKey: queryKeys.systemStats,
    queryFn: getSystemStats,
  });
}

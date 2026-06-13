"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardStats } from "@/app/actions/admin";
import { queryKeys } from "@/lib/queryKeys";

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: queryKeys.adminDashboardStats,
    queryFn: getAdminDashboardStats,
  });
}

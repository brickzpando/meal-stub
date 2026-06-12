"use client";

import { getSystemStats } from "@/app/actions/employee";
import { useQuery } from "@tanstack/react-query";

export function useSystemStats() {
  return useQuery({
    queryKey: ["system-stats"],
    queryFn: getSystemStats,
  });
}

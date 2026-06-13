"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { getSettlementReport } from "@/app/actions/reports";

export function useSettlementReport() {
  return useQuery({
    queryKey: queryKeys.settlementReport,
    queryFn: getSettlementReport,
  });
}

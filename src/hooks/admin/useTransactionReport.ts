"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getTransactionReport } from "@/app/actions/reports";

export function useTransactionReport() {
  return useQuery({
    queryKey: queryKeys.transactionReport,
    queryFn: getTransactionReport,
  });
}

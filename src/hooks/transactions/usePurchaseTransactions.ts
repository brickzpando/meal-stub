"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getPurchaseTransactions } from "@/app/actions/purchase";

export function usePurchaseTransactions() {
  return useQuery({
    queryKey: queryKeys.purchaseTransactions,
    queryFn: getPurchaseTransactions,
  });
}

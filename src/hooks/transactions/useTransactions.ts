"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/app/actions/transaction";
import { queryKeys } from "@/lib/queryKeys";

export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: getTransactions,
  });
}

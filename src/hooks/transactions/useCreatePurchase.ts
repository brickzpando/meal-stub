"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPurchase } from "@/app/actions/transaction";
import { queryKeys } from "@/lib/queryKeys";

export function useCreatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.employeeBasic,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.purchaseTransactions,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.pantrySummary,
      });
    },
  });
}

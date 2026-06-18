"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { resetAllTransactions } from "@/app/actions/employee";

export function useResetAllTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetAllTransactions,

    onSuccess: () => {
      // refresh transaction-related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.adminDashboardStats,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.weeklySummary,
      });

      // refresh issuance history if ginagamit nimo
      queryClient.invalidateQueries({
        queryKey: queryKeys.issuance,
      });

      // refresh employee data (kay computed values depend sa transactions)
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees,
      });
    },
  });
}

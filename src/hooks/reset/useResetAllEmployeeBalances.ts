"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetAllEmployeeBalances } from "@/app/actions/employee";
import { queryKeys } from "@/lib/queryKeys";

export function useResetAllEmployeeBalances() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetAllEmployeeBalances,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.adminDashboardStats,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions,
      });
    },
  });
}

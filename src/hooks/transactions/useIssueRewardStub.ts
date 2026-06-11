"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { issueRewardStub } from "@/app/actions/transaction";
import { queryKeys } from "@/lib/queryKeys";

export function useIssueRewardStub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      amount,
      reason,
    }: {
      employeeId: string;
      amount: number;
      reason: string;
    }) => issueRewardStub(employeeId, amount, reason),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.issuance,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboardStats,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.employees,
      });
    },
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { issueWeeklyStub } from "@/app/actions/transaction";
import { queryKeys } from "@/lib/queryKeys";

export function useIssueWeeklyStub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: issueWeeklyStub,

    onSuccess: () => {
      // refresh issuance list (if naa ka query ani)
      queryClient.invalidateQueries({
        queryKey: queryKeys.issuance,
      });

      // optional: refresh employees if needed
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees,
      });
    },
  });
}

import { issueWeeklyStubBulk } from "@/app/actions/transaction";
import { queryKeys } from "@/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useIssueWeeklyStubBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: issueWeeklyStubBulk,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.issuance,
      });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { savePins } from "@/app/actions/user";
import { queryKeys } from "@/lib/queryKeys";

export function useSavePins() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePins,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.pins,
      });
    },
  });
}

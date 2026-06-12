import { useMutation, useQueryClient } from "@tanstack/react-query";

import { savePins } from "@/app/actions/user";

export function useSavePins() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePins,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pins"],
      });
    },
  });
}

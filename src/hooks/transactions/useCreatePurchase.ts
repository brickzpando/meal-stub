"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPurchase } from "@/app/actions/transaction";

export function useCreatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employees-basic"],
      });
    },
  });
}

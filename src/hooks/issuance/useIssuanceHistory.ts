"use client";

import { useQuery } from "@tanstack/react-query";
import { getIssuanceHistory } from "@/app/actions/transaction";
import { queryKeys } from "@/lib/queryKeys";

export function useIssuanceHistory() {
  return useQuery({
    queryKey: queryKeys.issuance,
    queryFn: getIssuanceHistory,
  });
}

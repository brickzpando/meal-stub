import { useQuery } from "@tanstack/react-query";

import { getPins } from "@/app/actions/user";
import { queryKeys } from "@/lib/queryKeys";

export function usePins() {
  return useQuery({
    queryKey: queryKeys.pins,
    queryFn: getPins,
  });
}

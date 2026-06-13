import { useQuery } from "@tanstack/react-query";

import { getPins } from "@/app/actions/user";

export function usePins() {
  return useQuery({
    queryKey: ["pins"],
    queryFn: getPins,
  });
}

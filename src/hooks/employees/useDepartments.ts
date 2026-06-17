import { getDepartments } from "@/app/actions/employee";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useDepartments() {
  return useQuery({
    queryKey: queryKeys.departments,
    queryFn: getDepartments,
  });
}

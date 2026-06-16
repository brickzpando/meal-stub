import { getDepartments } from "@/app/actions/employee";
import { useQuery } from "@tanstack/react-query";

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });
}

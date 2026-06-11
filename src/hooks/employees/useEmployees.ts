"use client";

import { useQuery } from "@tanstack/react-query";
import { getEmployeeMap, getEmployees } from "@/app/actions/employee";
import { queryKeys } from "@/lib/queryKeys";
import { getEmployeesBasic } from "@/app/actions/transaction";

export function useEmployees() {
  return useQuery({
    queryKey: queryKeys.employees,
    queryFn: getEmployees,
  });
}

export function useEmployeeMap() {
  return useQuery({
    queryKey: ["employees-map"],
    queryFn: getEmployeeMap,
  });
}

export function useEmployeesBasic() {
  return useQuery({
    queryKey: ["employees-basic"],
    queryFn: getEmployeesBasic,
  });
}

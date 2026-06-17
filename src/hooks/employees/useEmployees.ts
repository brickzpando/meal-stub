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
    queryKey: queryKeys.employeesMap,
    queryFn: getEmployeeMap,
  });
}

export function useEmployeesBasic() {
  return useQuery({
    queryKey: queryKeys.employeeBasic,
    queryFn: getEmployeesBasic,
  });
}

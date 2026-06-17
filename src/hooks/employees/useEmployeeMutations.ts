"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "@/app/actions/employee";
import { queryKeys } from "@/lib/queryKeys";

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.employeeBasic,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.systemStats,
      });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees,
      });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactionReport,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.settlementReport,
      });
    },
  });
}

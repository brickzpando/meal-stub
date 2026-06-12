"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/app/actions/transaction";

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
}

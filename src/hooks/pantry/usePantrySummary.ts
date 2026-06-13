// hooks/pantry/usePantrySummary.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getPantrySummary } from "@/app/actions/pantry";

export function usePantrySummary() {
  return useQuery({
    queryKey: ["pantry-summary"],
    queryFn: getPantrySummary,
  });
}

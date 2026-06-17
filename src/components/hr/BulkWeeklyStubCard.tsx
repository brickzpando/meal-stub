"use client";

import { Button, toast } from "@heroui/react";
import { Users } from "lucide-react";
import { useIssueWeeklyStubBulk } from "@/hooks/transactions/useIssueWeeklyStubBulk";

export default function BulkWeeklyStubCard() {
  const { mutate, isPending } = useIssueWeeklyStubBulk();

  const handleBulkIssue = () => {
    mutate(undefined, {
      onSuccess: (result) => {
        toast.success("Weekly stubs issued", {
          description: `${result.issued} employees issued, ${result.skipped} skipped.`,
        });
      },

      onError: (err) => {
        toast.danger("Bulk issuance failed", {
          description:
            err instanceof Error ? err.message : "Something went wrong.",
        });
      },
    });
  };

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
            <Users className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Weekly Meal Stub Distribution
            </h2>

            <p className="text-sm text-slate-500">
              Issue ₱100 meal stub to all employees.
            </p>
          </div>
        </div>

        <Button isPending={isPending} onClick={handleBulkIssue}>
          {isPending ? "Issuing..." : " Issue ₱100 To All Employees"}
        </Button>
      </div>
    </div>
  );
}

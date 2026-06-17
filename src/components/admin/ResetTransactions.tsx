"use client";

import { Button, toast } from "@heroui/react";
import { useResetAllTransactions } from "@/hooks/reset/useResetAllTransactions";

export default function ResetTransactions() {
  const { mutate, isPending } = useResetAllTransactions();

  const resetData = () => {
    const ok = confirm("Delete ALL transactions? This cannot be undone.");
    if (!ok) return;

    mutate(undefined, {
      onSuccess: () => {
        toast.success("All transactions cleared");
      },
      onError: (err) => {
        console.error(err);
        toast.danger("Reset failed");
      },
    });
  };

  return (
    <div className="w-full max-w-52 flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-center">
        <h3 className="text-sm font-semibold text-slate-900">System Tools</h3>
        <p className="text-xs text-slate-500">Administrative actions</p>
      </div>

      {/* <button
        onClick={resetData}
        disabled={isPending}
        className="w-full rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
      >
        {isPending ? "Resetting..." : "Reset Transactions"}
      </button> */}
      <Button onClick={resetData} isPending={isPending} variant="danger">
        {isPending ? "Resetting..." : "Reset Transactions"}
      </Button>
    </div>
  );
}

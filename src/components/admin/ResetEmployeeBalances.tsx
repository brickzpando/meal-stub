"use client";
import { useResetAllEmployeeBalances } from "@/hooks/reset/useResetAllEmployeeBalances";
import { Button, toast } from "@heroui/react";

export default function ResetEmployeeBalances() {
  const { mutate, isPending } = useResetAllEmployeeBalances();

  const resetData = () => {
    const ok = confirm("Reset ALL employee balances?");
    if (!ok) return;

    mutate(undefined, {
      onSuccess: () => {
        toast.success("System reset successful");
      },
      onError: (err) => {
        console.error(err);
        toast.danger("Reset failed");
      },
    });
  };

  return (
    <div className="w-full max-w-56 justify-center items-center flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-center">
        <h3 className="text-sm font-semibold text-slate-900">System Tools</h3>
        <p className="text-xs text-slate-500">Administrative actions</p>
      </div>

      <Button
        onClick={resetData}
        size="sm"
        isPending={isPending}
        variant="danger"
      >
        {" "}
        {isPending ? "Resetting..." : "Reset Employee Balances"}
      </Button>
    </div>
  );
}

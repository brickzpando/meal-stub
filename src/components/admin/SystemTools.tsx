"use client";

import { resetAllEmployeeBalances } from "@/app/actions/employee";
import { toast } from "@heroui/react";

export default function SystemTools() {
  const resetData = async () => {
    const ok = confirm("Reset ALL employee balances?");

    if (!ok) return;

    try {
      await resetAllEmployeeBalances();
      toast.success("System reset successful");
    } catch (err) {
      console.error(err);
      toast.danger("Reset failed");
    }
  };

  return (
    <div className="inline-flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">System Tools</h3>
        <p className="text-xs text-slate-500">Administrative actions</p>
      </div>

      <button
        onClick={resetData}
        className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
      >
        Reset System
      </button>
    </div>
  );
}

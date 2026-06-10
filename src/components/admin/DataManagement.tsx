"use client";
import { useMealStub } from "@/context/MealStubContext";
import { Database, Download, Upload, FileSpreadsheet } from "lucide-react";
import { Button } from "@heroui/react";

export default function DataManagement() {
  const { employees, setEmployees, transactions, pins } = useMealStub();

  const importCsv = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const text = await file.text();

    const rows = text.split("\n");

    const imported = rows
      .slice(1)
      .map((row) => {
        const [id, name, dept] = row.split(",");

        return {
          id: id?.trim(),
          name: name?.trim(),
          dept: dept?.trim(),
        };
      })
      .filter((x) => x.id);

    setEmployees([...employees, ...imported]);
  };

  const exportBackup = () => {
    const backup = {
      employees,
      transactions,
      pins,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "mealstub-backup.json";

    a.click();

    URL.revokeObjectURL(url);
  };

  const restoreBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const text = await file.text();

    const data = JSON.parse(text);

    localStorage.setItem("mst-emp", JSON.stringify(data.employees));

    localStorage.setItem("mst-tx", JSON.stringify(data.transactions));

    localStorage.setItem("mst-pins", JSON.stringify(data.pins));

    window.location.reload();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
          <Database className="h-5 w-5 text-blue-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Data Management
          </h3>

          <p className="text-sm text-slate-500">
            Import employees, export backups, and restore system data.
          </p>
        </div>
      </div>

      {/* Import CSV */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-blue-600" />

          <h4 className="font-medium text-slate-800">Import Employees</h4>
        </div>

        <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-8 transition hover:border-blue-400 hover:bg-blue-50">
          <Upload className="mb-3 h-8 w-8 text-slate-400 group-hover:text-blue-500" />

          <span className="text-sm font-medium text-slate-700">
            Upload Employee CSV
          </span>

          <span className="mt-1 text-xs text-slate-500">
            Supported format: .csv
          </span>

          <input
            type="file"
            accept=".csv"
            onChange={importCsv}
            className="hidden"
          />
        </label>
      </div>

      {/* Backup & Restore */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-600" />

          <h4 className="font-medium text-slate-800">Backup & Restore</h4>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onPress={exportBackup} className="bg-emerald-600 text-white">
            <Download className="h-4 w-4" />
            Export Backup
          </Button>

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            <Upload className="h-4 w-4" />
            Restore Backup
            <input
              type="file"
              accept=".json"
              onChange={restoreBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Employees</p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {employees.length}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Transactions</p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {transactions.length}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">PIN Records</p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {Object.keys(pins || {}).length}
          </p>
        </div>
      </div>
    </div>
  );
}

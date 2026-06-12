"use client";
import { useState } from "react";
import { Database, Download, Upload, FileSpreadsheet } from "lucide-react";
import { Button } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { useSystemStats } from "@/hooks/admin/useSystemStats";
import { useEmployees } from "@/hooks/employees/useEmployees";
import { exportEmployeesExcel, importEmployees } from "@/app/actions/employee";

export default function DataManagement() {
  const queryClient = useQueryClient();

  const { data: employees = [] } = useEmployees();

  const { data: stats } = useSystemStats();

  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleImportCsv = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setIsImporting(true);

      const text = await file.text();

      const rows = text.split("\n");

      const imported = rows
        .slice(1)
        .map((row) => {
          const [employeeId, fullName, department] = row.split(",");

          return {
            employeeId: employeeId?.trim(),
            fullName: fullName?.trim(),
            department: department?.trim(),
          };
        })
        .filter((x) => x.employeeId);

      if (imported.length === 0) {
        alert("No valid employee records found.");
        return;
      }

      await importEmployees(imported);

      await queryClient.invalidateQueries({
        queryKey: queryKeys.employees,
      });

      await queryClient.invalidateQueries({
        queryKey: ["system-stats"],
      });

      alert(`${imported.length} employee(s) imported successfully.`);
    } catch (error) {
      console.error(error);

      alert("Failed to import employees.");
    } finally {
      setIsImporting(false);

      event.target.value = "";
    }
  };

  // const handleExportBackup = async () => {
  //   try {
  //     setIsExporting(true);

  //     const backup = await exportBackup();

  //     const blob = new Blob([JSON.stringify(backup, null, 2)], {
  //       type: "application/json",
  //     });

  //     const url = URL.createObjectURL(blob);

  //     const a = document.createElement("a");

  //     a.href = url;
  //     a.download = `mealstub-backup-${
  //       new Date().toISOString().split("T")[0]
  //     }.json`;

  //     a.click();

  //     URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error(error);

  //     alert("Failed to export backup.");
  //   } finally {
  //     setIsExporting(false);
  //   }
  // };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);

      const buffer = await exportEmployeesExcel();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `employees-${new Date().toISOString().split("T")[0]}.xlsx`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export Excel");
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
          <Database className="h-5 w-5 text-blue-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Data Management
          </h3>

          <p className="text-sm text-slate-500">
            Import employees and export database backups.
          </p>
        </div>
      </div>

      {/* IMPORT */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-blue-600" />

          <h4 className="font-medium text-slate-800">Import Employees</h4>
        </div>

        <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-8 transition hover:border-blue-400 hover:bg-blue-50">
          <Upload className="mb-3 h-8 w-8 text-slate-400 group-hover:text-blue-500" />

          <span className="text-sm font-medium text-slate-700">
            {isImporting ? "Importing..." : "Upload Employee CSV"}
          </span>

          <span className="mt-1 text-xs text-slate-500">
            Format: employeeId, fullName, department
          </span>

          <input
            type="file"
            accept=".csv"
            onChange={handleImportCsv}
            disabled={isImporting}
            className="hidden"
          />
        </label>
      </div>

      {/* EXPORT */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-600" />

          <h4 className="font-medium text-slate-800">Database Backup</h4>
        </div>

        <Button
          onPress={handleExportExcel}
          className="bg-emerald-600 text-white"
        >
          <Download className="h-4 w-4" />
          Export Backup
        </Button>
      </div>

      {/* STATS */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Employees</p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {stats?.employeeCount ?? employees.length}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Transactions</p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {stats?.transactionCount ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Pin Records</p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {" "}
            {stats?.pinCount ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}

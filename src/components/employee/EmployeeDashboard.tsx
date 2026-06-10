"use client";
import EmployeeProfile from "./EmployeeProfile";
import EmployeeSummary from "./EmployeeSummary";
import EmployeeHistory from "./EmployeeHistory";

export default function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      <EmployeeProfile />

      <EmployeeSummary />

      <EmployeeHistory />
    </div>
  );
}

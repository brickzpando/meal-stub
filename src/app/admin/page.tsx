import DashboardStats from "@/components/admin/DashboardStats";
import WeeklySummary from "@/components/admin/WeeklySummary";
import TransactionReport from "@/components/admin/TransactionReport";
import SettlementReport from "@/components/admin/SettlementReport";
import PinManagement from "@/components/admin/PinManagement";
import SystemTools from "@/components/admin/SystemTools";
import TopBar from "@/components/TopBar";
import EmployeeTableAdmin from "@/components/admin/EmployeeTable";
export default function AdminPage() {
  return (
    <main className="page-container">
      <TopBar role="Admin" />
      <DashboardStats />
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <PinManagement />
        <SystemTools />
        {/* <DataManagement /> */}
      </div>
      <WeeklySummary />
      <EmployeeTableAdmin />
      <SettlementReport />
      <TransactionReport />

      {/* <SystemTools /> */}
    </main>
  );
}

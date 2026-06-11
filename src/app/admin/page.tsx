import DashboardStats from "@/components/admin/DashboardStats";
import WeeklySummary from "@/components/admin/WeeklySummary";
import TransactionReport from "@/components/admin/TransactionReport";
import SettlementReport from "@/components/admin/SettlementReport";
import PinManagement from "@/components/admin/PinManagement";
import SystemTools from "@/components/admin/SystemTools";
import TopBar from "@/components/TopBar";
import DataManagement from "@/components/admin/DataManagement";
export default function AdminPage() {
  return (
    <main className="page-container">
      <TopBar role="Admin" />
      <DashboardStats />
      <div className="grid lg:grid-cols-2 gap-6">
        <PinManagement />
        <DataManagement />
      </div>
      <WeeklySummary />
      <SettlementReport />
      <TransactionReport />
      <SystemTools />
    </main>
  );
}

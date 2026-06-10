"use client";
import DashboardStats from "@/components/admin/DashboardStats";
import WeeklySummary from "@/components/admin/WeeklySummary";
import TransactionReport from "@/components/admin/TransactionReport";
import SettlementReport from "@/components/admin/SettlementReport";
import PinManagement from "@/components/admin/PinManagement";
import SystemTools from "@/components/admin/SystemTools";
import TopBar from "@/components/TopBar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DataManagement from "@/components/admin/DataManagement";
export default function AdminPage() {
  const router = useRouter();

  const { logout } = useAuth();

  return (
    <main className="page-container">
      <TopBar
        role="Admin"
        onLogout={() => {
          logout();

          router.push("/login");
        }}
      />
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

import TopBar from "@/components/TopBar";
import DashboardStats from "@/components/hr/DashboardStats";
import AddEmployeeForm from "@/components/hr/AddEmployeeForm";
import WeeklyStubForm from "@/components/hr/WeeklyStubForm";
import RewardStubForm from "@/components/hr/RewardStubForm";
import EmployeeTable from "@/components/hr/EmployeeTable";
import IssueHistoryTable from "@/components/hr/IssueHistoryTable";
import BulkWeeklyStubCard from "@/components/hr/BulkWeeklyStubCard";
import DataManagement from "@/components/admin/DataManagement";
export default function HRPage() {
  return (
    <>
      <TopBar role="HR" />
      <main className="space-y-6 p-4 md:p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">HR Dashboard</h1>
          <p className="mt-2 text-slate-500">
            Manage employees, issue meal stubs, rewards, and monitor activity.
          </p>
        </div>
        <DashboardStats />
        <BulkWeeklyStubCard />
        <AddEmployeeForm />
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <DataManagement />
          <WeeklyStubForm />
          <RewardStubForm />
        </div>

        {/* <div className="grid gap-6 xl:grid-cols-2">
          <WeeklyStubForm />
          <RewardStubForm />
        </div> */}
        <EmployeeTable />
        <IssueHistoryTable />
      </main>
    </>
  );
}

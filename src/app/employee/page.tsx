import TopBar from "@/components/TopBar";
import EmployeeDashboard from "@/components/employee/EmployeeDashboard";

export default function EmployeePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <TopBar role="Employee" />
      <div className=" space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Employee Dashboard
          </h1>
          <p className="mt-2 text-slate-500">
            View balances, transactions, rewards, and account activity.
          </p>
        </div>

        <EmployeeDashboard />
      </div>
    </main>
  );
}

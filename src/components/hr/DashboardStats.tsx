"use client";
import { useDashboardStats } from "@/hooks/dashboard/useDashboardStats";
import { Users, CalendarDays, Gift, ShoppingCart } from "lucide-react";

export default function DashboardStats() {
  const { data } = useDashboardStats();

  const stats = [
    {
      title: "Employees",
      value: data?.employeesCount ?? 0,
      icon: Users,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Weekly Issued",
      value: `₱${data?.weeklyIssued ?? 0}`,
      icon: CalendarDays,
      bg: "bg-emerald-100",
      color: "text-emerald-600",
    },
    {
      title: "Rewards Issued",
      value: `₱${data?.rewardsIssued ?? 0}`,
      icon: Gift,
      bg: "bg-amber-100",
      color: "text-amber-600",
    },
    {
      title: "Purchases",
      value: `₱${data?.purchases ?? 0}`,
      icon: ShoppingCart,
      bg: "bg-rose-100",
      color: "text-rose-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className=" h-30 items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
            </div>

            <div className="flex justify-between w-full">
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {stat.value}
              </h2>
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg}`}
              >
                <Icon className={`h-7 w-7 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

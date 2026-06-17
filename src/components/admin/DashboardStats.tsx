"use client";
import { useAdminDashboardStats } from "@/hooks/admin/useAdminDashboardStats";
import { Skeleton } from "@heroui/react";
import { Users, CalendarDays, Gift, ShoppingCart } from "lucide-react";

export default function DashboardStats() {
  const { data, isLoading } = useAdminDashboardStats();

  const stats = [
    {
      title: "Employees",
      value: data?.employeesCount ?? 0,
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Weekly Issued",
      value: `₱${data?.weeklyIssued ?? 0}`,
      icon: CalendarDays,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Rewards",
      value: `₱${data?.rewardsIssued ?? 0}`,
      icon: Gift,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Purchases",
      value: `₱${data?.purchases ?? 0}`,
      icon: ShoppingCart,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-8 w-32 rounded-md" />
              </div>

              <Skeleton className="h-14 w-14 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {stat.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.iconBg}`}
              >
                <Icon className={`h-7 w-7 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

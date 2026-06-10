"use client";
import { useMealStub } from "@/context/MealStubContext";
import { Users, CalendarDays, Gift, ShoppingCart } from "lucide-react";

export default function DashboardStats() {
  const { employees, transactions } = useMealStub();

  const weeklyIssued = transactions
    .filter((x) => x.type === "weekly")
    .reduce((a, b) => a + b.amount, 0);

  const rewardsIssued = transactions
    .filter((x) => x.type === "reward")
    .reduce((a, b) => a + b.amount, 0);

  const purchases = transactions
    .filter((x) => x.type === "purchase")
    .reduce((a, b) => a + b.amount, 0);

  const stats = [
    {
      title: "Employees",
      value: employees.length.toLocaleString(),
      icon: Users,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Weekly Issued",
      value: `₱${weeklyIssued.toLocaleString()}`,
      icon: CalendarDays,
      bg: "bg-emerald-100",
      color: "text-emerald-600",
    },
    {
      title: "Rewards Issued",
      value: `₱${rewardsIssued.toLocaleString()}`,
      icon: Gift,
      bg: "bg-amber-100",
      color: "text-amber-600",
    },
    {
      title: "Purchases",
      value: `₱${purchases.toLocaleString()}`,
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

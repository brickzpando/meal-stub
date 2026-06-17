"use client";

import { useAuth } from "@/context/AuthContext";
import { useEmployeesBasic } from "@/hooks/employees/useEmployees";
import { Skeleton } from "@heroui/react";
import { ShoppingBag, CalendarDays, Gift, CreditCard } from "lucide-react";

export default function EmployeeSummary() {
  const { user } = useAuth();
  const { data: employees = [], isLoading } = useEmployeesBasic();

  if (!user?.employee) return null;

  const employee = employees.find((e) => e.id === user.employee?.id);

  if (isLoading || !user?.employee) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <Skeleton className="h-6 w-40 rounded-md" />
          <Skeleton className="mt-2 h-4 w-72 rounded-md" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex h-32 items-center justify-between rounded-xl border bg-slate-50 p-4"
            >
              <div className="space-y-3">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-8 w-28 rounded-md" />
              </div>

              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!employee) return null;

  const weeklyIssued = employee.weekly ?? 0;
  const rewardIssued = employee.reward ?? 0;
  const spent = employee.spent ?? 0;
  const balance = employee.balance ?? 0;

  const cards = [
    {
      title: "Weekly Issued",
      value: weeklyIssued,
      icon: CalendarDays,
      bg: "bg-emerald-100",
      color: "text-emerald-600",
    },
    {
      title: "Reward Issued",
      value: rewardIssued,
      icon: Gift,
      bg: "bg-amber-100",
      color: "text-amber-600",
    },
    {
      title: "Current Balance",
      value: balance,
      icon: CreditCard,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Total Spent",
      value: spent,
      icon: ShoppingBag,
      bg: "bg-rose-100",
      color: "text-rose-600",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Account Summary
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Overview of balances, issued credits, and spending.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="flex h-32 items-center justify-between rounded-xl border bg-slate-50 p-4"
            >
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>
                <h2 className="text-2xl font-bold">
                  ₱{card.value.toLocaleString()}
                </h2>
              </div>

              <div className={`p-3 rounded-xl ${card.bg}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

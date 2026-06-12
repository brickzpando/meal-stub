"use client";

import { useAuth } from "@/context/AuthContext";
import { useEmployeesBasic } from "@/hooks/employees/useEmployees";
import {
  Wallet,
  ShoppingBag,
  CalendarDays,
  Gift,
  CreditCard,
} from "lucide-react";

export default function EmployeeSummary() {
  const { user } = useAuth();

  const { data: employees = [] } = useEmployeesBasic();

  if (!user?.employee) return null;

  const empId = user.employee.id;

  const employee = employees.find((e) => e.id === empId);

  if (!employee) return null;

  const totalBalance = employee.balance || 0;

  // since wala kay transaction breakdown, fallback nalang
  const weeklyBalance = totalBalance * 0.6;
  const rewardBalance = totalBalance * 0.4;

  const issued = totalBalance; // approximation
  const spent = 0; // wala kay transaction source

  const cards = [
    {
      title: "Weekly Balance",
      value: weeklyBalance,
      icon: CalendarDays,
      bg: "bg-emerald-100",
      color: "text-emerald-600",
    },
    {
      title: "Reward Balance",
      value: rewardBalance,
      icon: Gift,
      bg: "bg-amber-100",
      color: "text-amber-600",
    },
    {
      title: "Total Balance",
      value: totalBalance,
      icon: CreditCard,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Total Issued",
      value: issued,
      icon: Wallet,
      bg: "bg-cyan-100",
      color: "text-cyan-600",
    },
    {
      title: "Total Used",
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="flex h-32.5 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  ₱{card.value.toLocaleString()}
                </h2>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg}`}
              >
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

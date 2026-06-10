"use client";
import { useAuth } from "@/context/AuthContext";
import { useMealStub } from "@/context/MealStubContext";
import { wkBal, rwBal, totalBal } from "@/lib/balance";
import { currentWeek } from "@/lib/helpers";
import { CalendarDays, Gift, Wallet } from "lucide-react";

export default function EmployeeBalance() {
  const { user } = useAuth();

  const { transactions } = useMealStub();

  if (!user?.employee) {
    return null;
  }

  const empId = user.employee.id;

  const week = currentWeek();

  const weekly = wkBal(empId, week, transactions);

  const reward = rwBal(empId, transactions);

  const total = totalBal(empId, week, transactions);

  const cards = [
    {
      title: "Weekly Balance",
      value: weekly,
      icon: CalendarDays,
      bg: "bg-emerald-100",
      color: "text-emerald-600",
    },
    {
      title: "Reward Balance",
      value: reward,
      icon: Gift,
      bg: "bg-amber-100",
      color: "text-amber-600",
    },
    {
      title: "Total Balance",
      value: total,
      icon: Wallet,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  ₱{card.value.toLocaleString()}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}
              >
                <Icon className={`h-7 w-7 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

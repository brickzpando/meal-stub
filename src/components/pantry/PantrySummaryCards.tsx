"use client";

import { usePantrySummary } from "@/hooks/pantry/usePantrySummary";
import { Banknote, Calendar, TrendingUp, CalendarDays } from "lucide-react";

export default function PantrySummaryCards() {
  const { data } = usePantrySummary();

  const cards = [
    {
      label: "Total Revenue",
      value: data?.total ?? 0,
      icon: Banknote,
      color: "text-slate-900",
      bg: "bg-slate-100",
    },
    {
      label: "Today",
      value: data?.todayTotal ?? 0,
      icon: Calendar,
      color: "text-green-600",
      bg: "bg-green-100",
    },

    {
      label: "Last 7 Days",
      value: data?.weeklyTotal ?? 0,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "This Month",
      value: data?.monthlyTotal ?? 0,
      icon: CalendarDays,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((c, i) => {
        const Icon = c.icon;

        return (
          <div
            key={i}
            className="p-4 rounded-xl border bg-white shadow-sm flex items-center gap-3 hover:shadow-md transition"
          >
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center ${c.bg}`}
            >
              <Icon className="h-5 w-5 text-slate-700" />
            </div>

            <div>
              <p className="text-sm text-slate-500">{c.label}</p>
              <p className={`text-2xl font-bold ${c.color}`}>
                ₱{Number(c.value).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

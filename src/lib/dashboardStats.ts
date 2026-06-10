import { Employee } from "@/types/employee";
import { Transaction } from "@/types/transaction";
import { Users, CalendarDays, Gift, ShoppingCart, Wallet } from "lucide-react";

export function getDashboardStats(
  employees: Employee[],
  transactions: Transaction[],
) {
  const remaining = employees.reduce((sum, emp) => {
    const issued = transactions
      .filter(
        (t) =>
          t.empId === emp.id && (t.type === "weekly" || t.type === "reward"),
      )
      .reduce((a, b) => a + b.amount, 0);

    const spent = transactions
      .filter((t) => t.empId === emp.id && t.type === "purchase")
      .reduce((a, b) => a + b.amount, 0);

    return sum + (issued - spent);
  }, 0);

  const weeklyIssued = transactions
    .filter((x) => x.type === "weekly")
    .reduce((a, b) => a + b.amount, 0);

  const rewardsIssued = transactions
    .filter((x) => x.type === "reward")
    .reduce((a, b) => a + b.amount, 0);

  const purchases = transactions
    .filter((x) => x.type === "purchase")
    .reduce((a, b) => a + b.amount, 0);

  return [
    {
      title: "Employees",
      value: employees.length.toLocaleString(),
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Weekly Issued",
      value: `₱${weeklyIssued.toLocaleString()}`,
      icon: CalendarDays,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Rewards Issued",
      value: `₱${rewardsIssued.toLocaleString()}`,
      icon: Gift,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Purchases",
      value: `₱${purchases.toLocaleString()}`,
      icon: ShoppingCart,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
    {
      title: "Remaining Balance",
      value: `₱${remaining.toLocaleString()}`,
      icon: Wallet,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
  ];
}

"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const employeesCount = await prisma.employee.count();

  const transactions = await prisma.transaction.findMany({
    select: {
      type: true,
      amount: true,
    },
  });

  const weeklyIssued = transactions
    .filter((t) => t.type === "WEEKLY")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const rewardsIssued = transactions
    .filter((t) => t.type === "REWARD")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const purchases = transactions
    .filter((t) => t.type === "PURCHASE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    employeesCount,
    weeklyIssued,
    rewardsIssued,
    purchases,
  };
}

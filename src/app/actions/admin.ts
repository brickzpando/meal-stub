"use server";
import { TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getAdminDashboardStats() {
  const employeesCount = await prisma.employee.count();

  const transactions = await prisma.transaction.findMany({
    select: {
      type: true,
      amount: true,
    },
  });

  const weeklyIssued = transactions
    .filter((t) => t.type === TransactionType.WEEKLY)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const rewardsIssued = transactions
    .filter((t) => t.type === TransactionType.REWARD)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const purchases = transactions
    .filter((t) => t.type === TransactionType.PURCHASE)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    employeesCount,
    weeklyIssued,
    rewardsIssued,
    purchases,
  };
}

export async function getWeeklySummary() {
  const transactions = await prisma.transaction.findMany({
    select: {
      createdAt: true,
      type: true,
      amount: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const grouped = transactions.reduce(
    (acc, tx) => {
      const date = new Date(tx.createdAt);

      // Start of week (Sunday)
      const start = new Date(date);
      start.setDate(date.getDate() - date.getDay());

      // End of week (Saturday)
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      const key = `${start.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })} - ${end.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })}`;

      if (!acc[key]) {
        acc[key] = {
          weekly: 0,
          reward: 0,
          purchase: 0,
        };
      }

      if (tx.type === TransactionType.WEEKLY) {
        acc[key].weekly += Number(tx.amount);
      }

      if (tx.type === TransactionType.REWARD) {
        acc[key].reward += Number(tx.amount);
      }

      if (tx.type === TransactionType.PURCHASE) {
        acc[key].purchase += Number(tx.amount);
      }

      return acc;
    },
    {} as Record<
      string,
      {
        weekly: number;
        reward: number;
        purchase: number;
      }
    >,
  );

  return Object.entries(grouped);
}

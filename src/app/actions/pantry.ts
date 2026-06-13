// app/actions/pantry.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getPantrySummary() {
  const transactions = await prisma.transaction.findMany({
    where: {
      type: "PURCHASE",
    },
    select: {
      amount: true,
      createdAt: true,
    },
  });

  const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

  const today = new Date().toDateString();

  const todayTotal = transactions
    .filter((t) => new Date(t.createdAt).toDateString() === today)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // last 7 days
  const now = new Date();
  const last7Days = new Date();
  last7Days.setDate(now.getDate() - 7);

  const weeklyTotal = transactions
    .filter((t) => new Date(t.createdAt) >= last7Days)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyTotal = transactions
    .filter((t) => new Date(t.createdAt) >= startOfMonth)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    total,
    todayTotal,
    weeklyTotal,
    monthlyTotal,
  };
}

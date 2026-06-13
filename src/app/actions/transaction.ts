"use server";
import { StubSource } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { startOfWeek, endOfWeek } from "date-fns";

export async function issueWeeklyStub(employeeId: string) {
  if (!employeeId) {
    throw new Error("Employee required");
  }

  const now = new Date();

  const weekStart = startOfWeek(now, {
    weekStartsOn: 1, // Monday
  });

  const weekEnd = endOfWeek(now, {
    weekStartsOn: 1,
  });

  const existingWeekly = await prisma.transaction.findFirst({
    where: {
      employeeId,
      type: "WEEKLY",
      createdAt: {
        gte: weekStart,
        lte: weekEnd,
      },
    },
  });

  if (existingWeekly) {
    throw new Error(
      "This employee has already received a weekly stub this week.",
    );
  }

  const transaction = await prisma.transaction.create({
    data: {
      employeeId,
      amount: 100,
      type: StubSource.WEEKLY,
      sourceType: StubSource.WEEKLY,
      remarks: "Weekly Stub",
    },
  });

  await prisma.employee.update({
    where: { id: employeeId },
    data: {
      balance: {
        increment: 100,
      },
    },
  });

  revalidatePath("/hr");

  return {
    id: transaction.id,
    employeeId: transaction.employeeId,
    amount: Number(transaction.amount),
    type: transaction.type,
    remarks: transaction.remarks,
    createdAt: transaction.createdAt.toISOString(),
  };
}
export async function getEmployeesBasic() {
  const employees = await prisma.employee.findMany({
    select: {
      id: true,
      fullName: true,
      balance: true, // 🔥 SOURCE OF TRUTH

      transactions: {
        select: {
          amount: true,
          type: true,
          sourceType: true,
        },
      },
    },
    orderBy: { fullName: "asc" },
  });
  return employees.map((emp) => {
    const weeklyIssued = emp.transactions
      .filter((t) => t.type === "WEEKLY")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const rewardIssued = emp.transactions
      .filter((t) => t.type === "REWARD")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const weeklySpent = emp.transactions
      .filter((t) => t.type === "PURCHASE" && t.sourceType === "WEEKLY")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const rewardSpent = emp.transactions
      .filter((t) => t.type === "PURCHASE" && t.sourceType === "REWARD")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const spent = weeklySpent + rewardSpent;

    const adjustment = emp.transactions
      .filter((t) => t.type === "ADJUSTMENT")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      id: emp.id,
      fullName: emp.fullName,

      balance: Number(emp.balance),

      weekly: weeklyIssued - weeklySpent,
      reward: rewardIssued - rewardSpent,

      spent,
      adjustment,
    };
  });
}

export async function getIssuanceHistory() {
  const transactions = await prisma.transaction.findMany({
    where: {
      type: {
        in: ["WEEKLY", "REWARD"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return transactions.map((t) => ({
    id: t.id,
    employeeId: t.employeeId,
    type: t.type,
    remarks: t.remarks,
    createdAt: t.createdAt.toISOString(),
    amount: Number(t.amount), // ✅ FIX HERE
  }));
}

export async function issueRewardStub(
  employeeId: string,
  amount: number,
  reason: string,
) {
  if (!employeeId) throw new Error("Employee required");
  if (amount <= 0) throw new Error("Invalid amount");

  const transaction = await prisma.transaction.create({
    data: {
      employeeId,
      amount,
      sourceType: StubSource.REWARD,
      type: StubSource.REWARD,
      remarks: reason,
    },
  });

  await prisma.employee.update({
    where: { id: employeeId },
    data: {
      balance: {
        increment: amount,
      },
    },
  });

  revalidatePath("/hr");

  return {
    id: transaction.id,
    employeeId: transaction.employeeId,
    amount: Number(transaction.amount),
    type: transaction.type,
    remarks: transaction.remarks,
    createdAt: transaction.createdAt.toISOString(),
  };
}

export async function getTransactions() {
  const transactions = await prisma.transaction.findMany({
    select: {
      id: true,
      employeeId: true,
      amount: true,
      type: true,
      createdAt: true,
      remarks: true,
    },
  });

  return transactions.map((t) => ({
    id: t.id,
    employeeId: t.employeeId,
    amount: Number(t.amount), // ✅ FIX HERE
    type: t.type,
    createdAt: t.createdAt.toISOString(), // ✅ also fix this
    remarks: t.remarks,
  }));
}

export async function createPurchase(data: {
  employeeId: string;
  amount: number;
  sourceType: "WEEKLY" | "REWARD";
}) {
  const { employeeId, amount, sourceType } = data;

  if (!employeeId) throw new Error("Employee required");
  if (amount <= 0) throw new Error("Invalid amount");

  const transaction = await prisma.transaction.create({
    data: {
      employeeId,
      amount,
      type: "PURCHASE",
      sourceType: sourceType,
      remarks: "Pantry Purchase",
    },
  });

  await prisma.employee.update({
    where: { id: employeeId },
    data: {
      balance: {
        decrement: amount,
      },
    },
  });

  revalidatePath("/pantry");

  return {
    id: transaction.id,
    employeeId: transaction.employeeId,
    amount: Number(transaction.amount),
    type: transaction.type,
    createdAt: transaction.createdAt.toISOString(),
  };
}

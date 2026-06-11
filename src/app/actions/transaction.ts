"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function issueWeeklyStub(employeeId: string) {
  if (!employeeId) {
    throw new Error("Employee required");
  }

  const transaction = await prisma.transaction.create({
    data: {
      employeeId,
      amount: 100,
      type: "WEEKLY",
      remarks: "Weekly Stub",
    },
  });

  revalidatePath("/hr");

  return {
    id: transaction.id,
    employeeId: transaction.employeeId,
    amount: Number(transaction.amount), // ✅ IMPORTANT
    type: transaction.type,
    remarks: transaction.remarks,
    createdAt: transaction.createdAt.toISOString(),
  };
}

export async function getEmployeesBasic() {
  return prisma.employee.findMany({
    select: {
      id: true,
      fullName: true,
    },
    orderBy: { fullName: "asc" },
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
      type: "REWARD",
      remarks: reason,
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

"use server";
import { TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getSettlementReport() {
  const employees = await prisma.employee.findMany({
    include: {
      transactions: {
        select: {
          type: true,
          amount: true,
        },
      },
    },
    orderBy: {
      fullName: "asc",
    },
  });

  return employees.map((employee) => {
    // const issued = employee.transactions
    //   .filter((t) => t.type === "WEEKLY" || t.type === "REWARD")
    //   .reduce((sum, t) => sum + Number(t.amount), 0);
    const issued = employee.transactions
      .filter(
        (t) =>
          t.type === TransactionType.WEEKLY ||
          t.type === TransactionType.REWARD ||
          t.type === TransactionType.ADJUSTMENT,
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const used = employee.transactions
      .filter((t) => t.type === TransactionType.PURCHASE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      id: employee.id,
      name: employee.fullName,
      issued,
      used,
      remaining: issued - used,
    };
  });
}

export async function getTransactionReport() {
  const transactions = await prisma.transaction.findMany({
    include: {
      employee: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return transactions.map((tx) => ({
    id: tx.id,
    date: tx.createdAt.toLocaleDateString(),
    type: tx.type,
    amount: Number(tx.amount),
    remarks: tx.remarks,
    employeeId: tx.employee.id,
    employeeName: tx.employee.fullName,
  }));
}

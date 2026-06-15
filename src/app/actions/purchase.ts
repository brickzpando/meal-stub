"use server";
import { TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
export async function getPurchaseTransactions() {
  const purchases = await prisma.transaction.findMany({
    where: {
      type: TransactionType.PURCHASE,
    },
    select: {
      id: true,
      amount: true,
      createdAt: true,
      remarks: true,
      employeeId: true,
      type: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return purchases.map((p) => ({
    ...p,
    amount: Number(p.amount), // 🔥 FIX HERE
  }));
}

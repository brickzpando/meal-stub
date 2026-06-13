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
    amount: Number(transaction.amount), // ✅ IMPORTANT
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
        },
      },
    },
    orderBy: { fullName: "asc" },
  });

  return employees.map((emp) => {
    const weekly = emp.transactions
      .filter((t) => t.type === "WEEKLY")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const reward = emp.transactions
      .filter((t) => t.type === "REWARD")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const spent = emp.transactions
      .filter((t) => t.type === "PURCHASE")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // 🔥 ADJUSTMENT SUPPORT (IMPORTANT)
    const adjustment = emp.transactions
      .filter((t) => t.type === "ADJUSTMENT")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      id: emp.id,
      fullName: emp.fullName,

      // 🔥 FINAL TRUE BALANCE (DB VALUE)
      balance: Number(emp.balance),

      // UI breakdown only
      weekly,
      reward,
      spent,

      // optional (for audit display if needed)
      adjustment,
    };
  });
}

// export async function getEmployeesBasic() {
//   const employees = await prisma.employee.findMany({
//     select: {
//       id: true,
//       fullName: true,
//       transactions: {
//         select: {
//           amount: true,
//           type: true,
//         },
//       },
//     },
//     orderBy: { fullName: "asc" },
//   });

//   return employees.map((emp) => {
//     const total = emp.transactions.reduce((sum, t) => {
//       const amount = Number(t.amount);

//       if (t.type === "PURCHASE") {
//         return sum - amount; // 🔥 IMPORTANT FIX
//       }

//       return sum + amount;
//     }, 0);

//     const weekly = emp.transactions
//       .filter((t) => t.type === "WEEKLY")
//       .reduce((sum, t) => sum + Number(t.amount), 0);

//     const reward = emp.transactions
//       .filter((t) => t.type === "REWARD")
//       .reduce((sum, t) => sum + Number(t.amount), 0);

//     const spent = emp.transactions
//       .filter((t) => t.type === "PURCHASE")
//       .reduce((sum, t) => sum + Number(t.amount), 0);

//     return {
//       id: emp.id,
//       fullName: emp.fullName,
//       balance: total,
//       weekly,
//       reward,
//       spent,
//     };
//   });
// }

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
}) {
  const { employeeId, amount } = data;

  if (!employeeId) throw new Error("Employee required");
  if (amount <= 0) throw new Error("Invalid amount");

  const transaction = await prisma.transaction.create({
    data: {
      employeeId,
      amount,
      type: "PURCHASE",
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

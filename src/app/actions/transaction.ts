"use server";
import { StubSource, TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";

export async function issueWeeklyStubBulk() {
  const now = new Date();

  const weekStart = startOfWeek(now, {
    weekStartsOn: 1,
  });

  const weekEnd = endOfWeek(now, {
    weekStartsOn: 1,
  });

  const employees = await prisma.employee.findMany({
    select: {
      id: true,
    },
  });

  let issued = 0;
  let skipped = 0;

  for (const employee of employees) {
    const existingWeekly = await prisma.transaction.findFirst({
      where: {
        employeeId: employee.id,
        type: TransactionType.WEEKLY,
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    if (existingWeekly) {
      skipped++;
      continue;
    }

    await prisma.transaction.create({
      data: {
        employeeId: employee.id,
        amount: 100,
        type: TransactionType.WEEKLY,
        sourceType: StubSource.WEEKLY,
        remarks: "Weekly Stub",
      },
    });

    await prisma.employee.update({
      where: {
        id: employee.id,
      },
      data: {
        balance: {
          increment: 100,
        },
      },
    });

    issued++;
  }

  return {
    issued,
    skipped,
  };
}

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
      type: TransactionType.WEEKLY,
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
      employeeNumber: true,
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
  // return employees.map((emp) => {
  //   const weeklyIssued = emp.transactions
  //     .filter((t) => t.type === TransactionType.WEEKLY)
  //     .reduce((sum, t) => sum + Number(t.amount), 0);

  //   const rewardIssued = emp.transactions
  //     .filter((t) => t.type === TransactionType.REWARD)
  //     .reduce((sum, t) => sum + Number(t.amount), 0);

  //   const weeklySpent = emp.transactions
  //     .filter(
  //       (t) =>
  //         t.type === TransactionType.PURCHASE &&
  //         t.sourceType === StubSource.WEEKLY,
  //     )
  //     .reduce((sum, t) => sum + Number(t.amount), 0);

  //   const rewardSpent = emp.transactions
  //     .filter(
  //       (t) =>
  //         t.type === TransactionType.PURCHASE &&
  //         t.sourceType === StubSource.REWARD,
  //     )
  //     .reduce((sum, t) => sum + Number(t.amount), 0);

  //   const spent = weeklySpent + rewardSpent;

  //   const adjustment = emp.transactions
  //     .filter((t) => t.type === TransactionType.ADJUSTMENT)
  //     .reduce((sum, t) => sum + Number(t.amount), 0);
  return employees.map((emp) => {
    // ✅ TOTAL ISSUED (WEEKLY + REWARD)
    const issued = emp.transactions
      .filter(
        (t) =>
          t.type === TransactionType.WEEKLY ||
          t.type === TransactionType.REWARD,
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // ✅ TOTAL SPENT (ALL PURCHASES ONLY)
    const spent = emp.transactions
      .filter((t) => t.type === TransactionType.PURCHASE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // ✅ OPTIONAL: ADJUSTMENT (admin edits)
    const adjustment = emp.transactions
      .filter((t) => t.type === TransactionType.ADJUSTMENT)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      id: emp.id,
      employeeNumber: emp.employeeNumber,
      fullName: emp.fullName,
      balance: Number(emp.balance),
      // weekly: weeklyIssued - weeklySpent,
      // reward: rewardIssued - rewardSpent,
      issued,
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
    amount: Number(t.amount),
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
      type: TransactionType.REWARD,
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
    amount: Number(t.amount),
    type: t.type,
    createdAt: t.createdAt.toISOString(),
    remarks: t.remarks,
  }));
}

export async function createPurchase(data: {
  employeeId: string;
  amount: number;
}) {
  const { employeeId, amount } = data;

  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
    select: {
      balance: true,
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  if (Number(employee.balance) < amount) {
    throw new Error("Insufficient balance");
  }

  const transaction = await prisma.transaction.create({
    data: {
      employeeId,
      amount,
      type: TransactionType.PURCHASE,
      remarks: "Pantry Purchase",
    },
  });

  await prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: {
      balance: {
        decrement: amount,
      },
    },
  });

  return {
    id: transaction.id,
    employeeId: transaction.employeeId,
    amount: Number(transaction.amount),
    type: transaction.type,
    sourceType: transaction.sourceType,
    createdAt: transaction.createdAt.toISOString(),
  };
}

//EXAMPLE IF naay WEEKLY or Reward STUB
// export async function createPurchase(data: {
//   employeeId: string;
//   amount: number;
//   sourceType: "WEEKLY" | "REWARD";
// }) {
//   const { employeeId, amount, sourceType } = data;

//   const transaction = await prisma.transaction.create({
//     data: {
//       employeeId,
//       amount,
//       type: TransactionType.PURCHASE,
//       sourceType,
//       remarks: "Pantry Purchase",
//     },
//   });

//   return {
//     id: transaction.id,
//     employeeId: transaction.employeeId,
//     amount: Number(transaction.amount),
//     type: transaction.type,
//     sourceType: transaction.sourceType,
//     createdAt: transaction.createdAt.toISOString(),
//   };
// }

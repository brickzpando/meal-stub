"use server";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../../lib/prisma";
import ExcelJS from "exceljs";
import { TransactionType, UserRole } from "@prisma/client";

export async function createEmployee(data: {
  employeeNumber?: string;
  fullName: string;
  department?: string;
  position?: string;
}) {
  const { fullName, department, employeeNumber } = data;

  if (!fullName) {
    throw new Error("Full name is required");
  }

  // check duplicate
  const exists = await prisma.employee.findFirst({
    where: {
      fullName: {
        equals: fullName,
        mode: "insensitive",
      },
    },
  });

  if (exists) {
    throw new Error("Employee already exists");
  }

  const employee = await prisma.employee.create({
    data: {
      fullName,
      role: UserRole.EMPLOYEE,
      department,
      employeeNumber:
        employeeNumber ?? `EMP-${Date.now().toString().slice(-6)}`,
    },
  });
  return {
    id: employee.id,
    fullName: employee.fullName,
    employeeNumber: employee.employeeNumber,
    department: employee.department,
    position: employee.position,
    role: employee.role,
    balance: Number(employee.balance), // 🔥 FIX HERE
    createdAt: employee.createdAt.toISOString(),
    updatedAt: employee.updatedAt.toISOString(),
  };
}

export async function getEmployees() {
  const employees = await prisma.employee.findMany({
    select: {
      id: true,
      fullName: true,
      employeeNumber: true,
      department: true,
      balance: true,
    },
  });

  return employees.map((emp) => ({
    ...emp,
    balance: Number(emp.balance),
  }));
}

// export async function getEmployees() {
//   const employees = await prisma.employee.findMany({
//     select: {
//       id: true,
//       fullName: true,
//       employeeNumber: true,
//       department: true,

//       transactions: {
//         select: {
//           amount: true,
//         },
//       },
//     },
//   });

//   return employees.map((emp) => {
//     const balance = emp.transactions.reduce((sum, t) => {
//       return sum + Number(t.amount);
//     }, 0);

//     return {
//       id: emp.id,
//       fullName: emp.fullName,
//       employeeNumber: emp.employeeNumber,
//       department: emp.department,
//       balance,
//     };
//   });
// }

export async function deleteEmployee(id: string) {
  await prisma.transaction.deleteMany({
    where: { employeeId: id },
  });

  await prisma.employee.delete({
    where: { id },
  });
}

export async function getEmployeesWithBalance() {
  const employees = await prisma.employee.findMany({
    include: {
      transactions: true,
    },
  });

  return employees.map((emp) => {
    const balance = emp.transactions.reduce((sum, t) => {
      return sum + Number(t.amount);
    }, 0);

    return {
      id: emp.id,
      fullName: emp.fullName,
      employeeNumber: emp.employeeNumber,
      department: emp.department,
      balance,
    };
  });
}

export async function getEmployeeMap() {
  const employees = await prisma.employee.findMany({
    select: {
      id: true,
      fullName: true,
      employeeNumber: true,
    },
  });

  const map: Record<
    string,
    {
      fullName: string;
      employeeNumber: string | null;
    }
  > = {};

  employees.forEach((e) => {
    map[e.id] = {
      fullName: e.fullName,
      employeeNumber: e.employeeNumber,
    };
  });

  return map;
}

export async function importEmployees(
  employees: {
    employeeNumber: string;
    fullName: string;
    department: string;
  }[],
) {
  await prisma.employee.createMany({
    data: employees.map((emp) => ({
      employeeNumber: emp.employeeNumber, // map CSV -> DB field
      fullName: emp.fullName,
      department: emp.department,
      role: UserRole.EMPLOYEE, // required field
    })),
    skipDuplicates: true,
  });

  return true;
}

export async function exportBackup() {
  const [employees, transactions] = await Promise.all([
    prisma.employee.findMany(),
    prisma.transaction.findMany(),
  ]);

  return {
    employees: employees.map((e) => ({
      ...e,
      balance:
        e.balance instanceof Decimal ? e.balance.toNumber() : Number(e.balance),
    })),

    transactions: transactions.map((t) => ({
      ...t,
      amount:
        t.amount instanceof Decimal ? t.amount.toNumber() : Number(t.amount),
    })),
  };
}

export async function getSystemStats() {
  const [employeeCount, transactionCount, pinCount] = await Promise.all([
    prisma.employee.count(),
    prisma.transaction.count(),
    prisma.user.count({
      where: {
        isActive: true,
      },
    }),
  ]);

  return {
    employeeCount,
    transactionCount,
    pinCount,
  };
}

export async function exportEmployeesExcel() {
  const employees = await prisma.employee.findMany({
    include: {
      transactions: true,
    },
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Employees");

  // headers
  sheet.columns = [
    { header: "Employee ID", key: "id", width: 20 },
    { header: "Employee Number", key: "employeeNumber", width: 20 },
    { header: "Full Name", key: "fullName", width: 30 },
    { header: "Department", key: "department", width: 20 },
    { header: "Balance", key: "balance", width: 15 },
  ];

  employees.forEach((emp) => {
    const balance = emp.transactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0,
    );

    sheet.addRow({
      id: emp.id,
      employeeNumber: emp.employeeNumber,
      fullName: emp.fullName,
      department: emp.department,
      balance,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return buffer;
}
export async function updateEmployee(data: {
  id: string;
  employeeNumber?: string;
  fullName?: string;
  department?: string;
  position?: string;
  balance?: number;
}) {
  const { id, fullName, department, employeeNumber, position, balance } = data;

  if (!id) throw new Error("Employee ID is required");

  if (fullName) {
    const exists = await prisma.employee.findFirst({
      where: {
        fullName: {
          equals: fullName,
          mode: "insensitive",
        },
        NOT: { id },
      },
    });

    if (exists) {
      throw new Error("Employee name already exists");
    }
  }

  const employee = await prisma.employee.findUnique({
    where: { id },
    select: {
      balance: true,
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const oldBalance = Number(employee.balance);
  const newBalance = balance ?? oldBalance;

  const difference = newBalance - oldBalance;

  const updated = await prisma.$transaction(async (tx) => {
    const emp = await tx.employee.update({
      where: { id },
      data: {
        ...(fullName && { fullName }),
        ...(department && { department }),
        ...(employeeNumber && { employeeNumber }),
        ...(position && { position }),
        ...(balance !== undefined && { balance: newBalance }),
      },
    });

    if (difference !== 0) {
      await tx.transaction.create({
        data: {
          employeeId: id,
          amount: difference,
          type: TransactionType.ADJUSTMENT,
          remarks: `Balance adjusted by admin`,
        },
      });
    }

    return emp;
  });

  return {
    ...updated,
    balance: Number(updated.balance),
  };
}

export async function getDepartments() {
  const defaultDepartments = [
    "HR",
    "IT",
    "FINANCE",
    "SALES",
    "OPERATIONS",
    "BILLING",
  ];

  const employees = await prisma.employee.findMany({
    where: {
      department: {
        not: null,
      },
    },
    select: {
      department: true,
    },
    distinct: ["department"],
  });

  const dbDepartments = employees
    .map((e) => e.department)
    .filter(Boolean) as string[];

  return [...new Set([...defaultDepartments, ...dbDepartments])].sort();
}

export async function resetAllEmployeeBalances() {
  const employees = await prisma.employee.findMany({
    select: {
      id: true,
      balance: true,
    },
  });

  await prisma.$transaction(async (tx) => {
    for (const emp of employees) {
      const oldBalance = Number(emp.balance);

      // reset balance
      await tx.employee.update({
        where: { id: emp.id },
        data: {
          balance: 0,
        },
      });

      // audit trail
      if (oldBalance !== 0) {
        await tx.transaction.create({
          data: {
            employeeId: emp.id,
            amount: -oldBalance,
            type: TransactionType.ADJUSTMENT,
            remarks: "SYSTEM RESET: balance cleared",
          },
        });
      }
    }
  });

  return {
    success: true,
    message: "All employee balances reset to 0",
  };
}

// export async function updateEmployee(data: {
//   id: string;
//   employeeNumber?: string;
//   fullName?: string;
//   department?: string;
//   position?: string;
//   balance?: number;
// }) {
//   const { id, fullName, department, employeeNumber, position, balance } = data;

//   if (!id) throw new Error("Employee ID is required");

//   if (fullName) {
//     const exists = await prisma.employee.findFirst({
//       where: {
//         fullName: {
//           equals: fullName,
//           mode: "insensitive",
//         },
//         NOT: { id },
//       },
//     });

//     if (exists) {
//       throw new Error("Employee name already exists");
//     }
//   }

//   const updated = await prisma.employee.update({
//     where: { id },
//     data: {
//       ...(fullName && { fullName }),
//       ...(department && { department }),
//       ...(employeeNumber && { employeeNumber }),
//       ...(position && { position }),
//       ...(balance !== undefined && { balance: Number(balance) }),
//     },
//   });

//   return {
//     ...updated,
//     balance: Number(updated.balance),
//   };
// }

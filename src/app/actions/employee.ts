"use server";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../../lib/prisma";
import ExcelJS from "exceljs";
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
      role: "EMPLOYEE",
      department,
      employeeNumber:
        employeeNumber ?? `EMP-${Date.now().toString().slice(-6)}`,
    },
  });
  return employee;
}

export async function getEmployees() {
  const employees = await prisma.employee.findMany({
    select: {
      id: true,
      fullName: true,
      employeeNumber: true,
      department: true,

      transactions: {
        select: {
          amount: true,
        },
      },
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

export async function deleteEmployee(id: string) {
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
    },
  });

  const map: Record<string, string> = {};

  employees.forEach((e) => {
    map[e.id] = e.fullName;
  });

  return map;
}

export async function importEmployees(
  employees: {
    employeeId: string;
    fullName: string;
    department: string;
  }[],
) {
  await prisma.employee.createMany({
    data: employees.map((emp) => ({
      employeeNumber: emp.employeeId, // map CSV -> DB field
      fullName: emp.fullName,
      department: emp.department,
      role: "EMPLOYEE", // required field
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

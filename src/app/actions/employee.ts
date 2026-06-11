"use server";
import { prisma } from "../../lib/prisma";

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

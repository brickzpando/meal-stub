import { Employee } from "@/types/employee";
import { Transaction } from "@/types/transaction";
import { currentWeek, today } from "./helpers";

export function seedData() {
  const seeded = localStorage.getItem("mst-seeded");

  if (seeded) return;

  const week = currentWeek();

  const employees: Employee[] = [
    {
      id: "EMP-001",
      name: "Maria Santos",
      dept: "Finance",
    },
    {
      id: "EMP-002",
      name: "Juan dela Cruz",
      dept: "Operations",
    },
    {
      id: "EMP-003",
      name: "Anna Reyes",
      dept: "HR",
    },
    {
      id: "EMP-004",
      name: "Carlo Mendoza",
      dept: "IT",
    },
  ];

  const transactions: Transaction[] = [
    {
      id: "1",
      empId: "EMP-001",
      type: "weekly",
      stubType: "weekly",
      amount: 100,
      date: week,
      week,
      note: "Weekly Stub",
    },
    {
      id: "2",
      empId: "EMP-002",
      type: "weekly",
      stubType: "weekly",
      amount: 100,
      date: week,
      week,
      note: "Weekly Stub",
    },
    {
      id: "3",
      empId: "EMP-003",
      type: "weekly",
      stubType: "weekly",
      amount: 100,
      date: week,
      week,
      note: "Weekly Stub",
    },
    {
      id: "4",
      empId: "EMP-004",
      type: "weekly",
      stubType: "weekly",
      amount: 100,
      date: week,
      week,
      note: "Weekly Stub",
    },
    {
      id: "5",
      empId: "EMP-001",
      type: "reward",
      stubType: "reward",
      amount: 100,
      date: week,
      week,
      note: "Top Performer",
    },
    {
      id: "6",
      empId: "EMP-001",
      type: "purchase",
      stubType: "weekly",
      amount: 65,
      date: today(),
      week,
      note: "",
    },
  ];

  localStorage.setItem("mst-emp", JSON.stringify(employees));

  localStorage.setItem("mst-tx", JSON.stringify(transactions));

  localStorage.setItem("mst-seeded", "yes");
}

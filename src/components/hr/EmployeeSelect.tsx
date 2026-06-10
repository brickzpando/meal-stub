"use client";
import { currentWeek } from "@/lib/helpers";
import { totalBal } from "@/lib/balance";
import { useMealStub } from "@/context/MealStubContext";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function EmployeeSelect({ value, onChange }: Props) {
  const { employees, transactions } = useMealStub();

  const week = currentWeek();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input"
    >
      <option value="">Select Employee</option>

      {employees.map((employee) => (
        <option key={employee.id} value={employee.id}>
          {employee.name} - ₱{totalBal(employee.id, week, transactions)}
        </option>
      ))}
    </select>
  );
}

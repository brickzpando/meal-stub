"use client";
import { useState } from "react";
import { Employee } from "@/types/employee";
import { useMealStub } from "@/context/MealStubContext";

import { UserPlus, User, Building2, BadgeInfo } from "lucide-react";
import { Button, InputGroup } from "@heroui/react";

export default function AddEmployeeForm() {
  const { employees, setEmployees } = useMealStub();

  const [name, setName] = useState("");

  const [dept, setDept] = useState("");

  const [empId, setEmpId] = useState("");

  const addEmployee = () => {
    if (!name.trim()) {
      alert("Name required");
      return;
    }

    const exists = employees.find(
      (e) => e.name.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      alert("Employee already exists");
      return;
    }

    const employee: Employee = {
      id:
        empId.trim() || `EMP-${String(employees.length + 1).padStart(3, "0")}`,
      name,
      dept,
    };

    setEmployees([...employees, employee]);

    setName("");
    setDept("");
    setEmpId("");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
          <UserPlus className="h-5 w-5 text-blue-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">Add Employee</h3>

          <p className="text-sm text-slate-500">
            Register a new employee into the system.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <InputGroup className="border border-slate-300 w-full">
            <InputGroup.Prefix>
              <User className="h-4 w-4 text-slate-400" />
            </InputGroup.Prefix>
            <InputGroup.Input
              type="text"
              placeholder="Full Name"
              value={name}
              className=""
              onChange={(e) => setName(e.target.value)}
            />
          </InputGroup>
        </div>

        <div className="relative">
          <InputGroup className="border border-slate-300 w-full">
            <InputGroup.Prefix>
              <Building2 className=" h-4 w-4 text-slate-400" />
            </InputGroup.Prefix>
            <InputGroup.Input
              type="text"
              placeholder="Department"
              value={dept}
              className=""
              onChange={(e) => setDept(e.target.value)}
            />
          </InputGroup>
        </div>

        <div className="relative">
          <InputGroup className="border border-slate-300 w-full">
            <InputGroup.Prefix>
              <BadgeInfo className=" h-4 w-4 text-slate-400" />
            </InputGroup.Prefix>
            <InputGroup.Input
              type="text"
              placeholder="EMP-001"
              value={empId}
              className=""
              onChange={(e) => setEmpId(e.target.value)}
            />
          </InputGroup>
        </div>

        <Button
          onClick={addEmployee}
          className="bg-blue-600 h-10 rounded-md hover:bg-blue-700 w-full text-white"
        >
          <UserPlus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>
    </div>
  );
}

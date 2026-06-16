"use client";
import { useState } from "react";
import { UserPlus, User, BadgeInfo } from "lucide-react";
import {
  Button,
  Input,
  InputGroup,
  toast,
  ComboBox,
  ListBox,
  Skeleton,
} from "@heroui/react";
import { useCreateEmployee } from "@/hooks/employees/useEmployeeMutations";
import { useDepartments } from "@/hooks/employees/useDepartments";

export default function AddEmployeeForm() {
  const [name, setName] = useState("");

  const [dept, setDept] = useState("");

  const [empId, setEmpId] = useState("");
  const { data: departments = [], isLoading } = useDepartments();
  const filteredDepartments = departments.filter((d) =>
    d.toLowerCase().includes(dept.toLowerCase()),
  );
  const { mutate: createEmployee } = useCreateEmployee();

  const addEmployee = () => {
    if (!name.trim()) {
      toast.warning("Name is required");
      return;
    }

    createEmployee(
      {
        fullName: name,
        department: dept,
        employeeNumber: empId || undefined,
      },
      {
        onSuccess: () => {
          setName("");
          setDept("");
          setEmpId("");
          toast.success("Employee added successfully");
        },
        onError: (err: unknown) => {
          if (err instanceof Error) {
            toast.danger(err.message);
          } else {
            toast.danger("Failed to add employee");
          }
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-xl" />

          <div className="space-y-2">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-4 w-56 rounded-md" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    );
  }

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
          <ComboBox
            selectedKey={dept}
            onSelectionChange={(key) => setDept(String(key))}
          >
            <ComboBox.InputGroup>
              <Input
                placeholder="Select department"
                className="border border-gray-300"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              />
              <ComboBox.Trigger />
            </ComboBox.InputGroup>

            <ComboBox.Popover>
              <ListBox className="max-h-48 overflow-y-auto">
                {filteredDepartments.map((d) => (
                  <ListBox.Item key={d} id={d} textValue={d}>
                    {d}
                  </ListBox.Item>
                ))}
              </ListBox>
            </ComboBox.Popover>
          </ComboBox>
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

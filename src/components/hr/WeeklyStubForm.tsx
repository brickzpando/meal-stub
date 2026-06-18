"use client";

import { useState } from "react";
import { CalendarDays, Send } from "lucide-react";
import {
  Button,
  ComboBox,
  Input,
  Label,
  ListBox,
  Skeleton,
  toast,
} from "@heroui/react";
import { useEmployeesBasic } from "@/hooks/employees/useEmployees";
import { useIssueWeeklyStub } from "@/hooks/transactions/issueWeeklyStub";

export default function WeeklyStubForm() {
  const [employeeId, setEmployeeId] = useState("");
  const { data: employees = [], isLoading } = useEmployeesBasic();
  const { mutate: issueWeekly, isPending } = useIssueWeeklyStub();

  const handleSubmit = () => {
    if (!employeeId) {
      toast.warning("No employee selected", {
        description: "Please select an employee before issuing a weekly stub.",
      });
      return;
    }

    issueWeekly(employeeId, {
      onSuccess: (result) => {
        if (!result.success) {
          toast.warning("Weekly stub not issued", {
            description: result.message,
          });

          return;
        }

        setEmployeeId("");

        toast.success("Weekly stub issued", {
          description: "₱100 has been added to the employee balance.",
        });
      },

      onError: () => {
        toast.danger("Failed to issue weekly stub", {
          description: "Something went wrong.",
        });
      },
    });
  };

  // const handleSubmit = () => {
  //   if (!employeeId) {
  //     toast.warning("No employee selected", {
  //       description: "Please select an employee before issuing a weekly stub.",
  //     });
  //     return;
  //   }

  //   issueWeekly(employeeId, {
  //     onSuccess: () => {
  //       setEmployeeId("");
  //       toast.success("Weekly stub issued", {
  //         description: "₱100 has been added to the employee balance.",
  //       });
  //     },
  //     onError: (err) => {
  //       toast.danger("Failed to issue weekly stub", {
  //         description:
  //           err instanceof Error ? err.message : "Something went wrong.",
  //       });
  //     },
  //   });
  // };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200  p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-xl" />

          <div className="space-y-2">
            <Skeleton className="h-5 w-48 rounded-md" />
            <Skeleton className="h-4 w-56 rounded-md" />
          </div>
        </div>

        <div className="space-y-6">
          <Skeleton className="h-4 w-20 rounded-md" />

          <Skeleton className="h-10 w-full rounded-md" />

          <div className="rounded-xl border border-slate-200 p-5">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="mt-3 h-10 w-24 rounded-md" />
            <Skeleton className="mt-3 h-4 w-52 rounded-md" />
          </div>

          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border h-full border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
          <CalendarDays className="h-5 w-5 text-blue-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Weekly Stub Issuance
          </h3>
          <p className="text-sm text-slate-500">
            Issue weekly meal stub credits.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Label className="text-sm font-medium text-slate-700">Employee</Label>

        <ComboBox
          selectedKey={employeeId}
          onSelectionChange={(key) => setEmployeeId(String(key))}
        >
          <ComboBox.InputGroup>
            <Input className="border border-gray-300" />
            <ComboBox.Trigger />
          </ComboBox.InputGroup>

          <ComboBox.Popover>
            <ListBox className="max-h-48 overflow-y-auto">
              {employees.map((emp) => (
                <ListBox.Item key={emp.id} id={emp.id} textValue={emp.fullName}>
                  {emp.fullName}
                </ListBox.Item>
              ))}
            </ListBox>
          </ComboBox.Popover>
        </ComboBox>

        {/* INFO CARD */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-sm font-medium text-blue-700">
            Fixed Weekly Amount
          </p>
          <h2 className="mt-2 text-4xl font-bold text-blue-600">₱100</h2>
          <p className="mt-1 text-sm text-blue-600">
            Automatically added to employee balance.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          className="bg-blue-600 h-10 rounded-md hover:bg-blue-700 w-full text-white"
        >
          {isPending ? (
            "Issuing..."
          ) : (
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              <span>Issue ₱100</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}

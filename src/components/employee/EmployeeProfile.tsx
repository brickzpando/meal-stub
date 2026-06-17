"use client";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@heroui/react";
import { User, BadgeInfo, Building2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function EmployeeProfile() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="mt-2 h-4 w-56 rounded-md" />
          </div>

          <Skeleton className="h-20 w-20 rounded-full" />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-slate-50 p-4">
              <Skeleton className="mb-3 h-4 w-24 rounded-md" />
              <Skeleton className="h-5 w-32 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (!user?.employee) {
    return null;
  }
  const employee = user.employee;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Employee Information
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Personal and employment details
          </p>
        </div>

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
          {employee.fullName.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <BadgeInfo className="h-4 w-4" />
            <span className="text-sm">Employee ID</span>
          </div>

          <p className="font-semibold text-slate-900">
            {employee.employeeNumber}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <User className="h-4 w-4" />
            <span className="text-sm">Full Name</span>
          </div>

          <p className="font-semibold text-slate-900">{employee.fullName}</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <Building2 className="h-4 w-4" />
            <span className="text-sm">Department</span>
          </div>

          <p className="font-semibold text-slate-900">{employee.department}</p>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Shield, UtensilsCrossed, UserCog, User } from "lucide-react";
import { Button, Input } from "@heroui/react";
import { usePins } from "@/hooks/admin/usePins";
import { useEmployees } from "@/hooks/employees/useEmployees";

type Role = "hr" | "pantry" | "admin" | "employee";

export default function LoginForm() {
  const router = useRouter();

  const { data: employees = [], isLoading: employeesLoading } = useEmployees();
  const { data: pins, isLoading: pinsLoading } = usePins();

  const { login } = useAuth();

  const [role, setRole] = useState<Role | null>(null);

  const [value, setValue] = useState("");

  const [error, setError] = useState("");

  const roles = [
    {
      value: "hr" as const,
      label: "HR",
      icon: Shield,
    },
    {
      value: "pantry" as const,
      label: "Pantry",
      icon: UtensilsCrossed,
    },
    {
      value: "admin" as const,
      label: "Admin",
      icon: UserCog,
    },
    {
      value: "employee" as const,
      label: "Employee",
      icon: User,
    },
  ];

  const handleLogin = () => {
    setError("");

    if (!role) {
      setError("Please select a role");
      return;
    }

    if (!value.trim()) {
      setError(
        role === "employee" ? "Employee ID is required" : "PIN is required",
      );
      return;
    }

    if (role === "employee") {
      const employee = employees.find(
        (e) => e.employeeNumber?.toLowerCase() === value.trim().toLowerCase(),
      );

      if (!employee) {
        setError("Employee not found");
        return;
      }

      login({
        role,
        employee,
      });

      router.push("/employee");

      return;
    }
    if (!pins) {
      setError("Loading PIN configuration...");
      return;
    }

    if (value !== pins[role]) {
      setError("Incorrect PIN");

      return;
    }

    login({
      role,
    });

    router.push(`/${role}`);
  };

  return (
    <div className="w-full max-w-md">
      <div className="card">
        {/* Logo/Header */}

        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-100 mx-auto flex items-center justify-center mb-4">
            <span className="text-3xl">🍽️</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            Meal Stub Tracker
          </h1>

          <p className="text-slate-500 mt-2">Sign in to continue</p>
        </div>

        {/* Role Selection */}

        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-600 mb-3">
            Select Role
          </label>

          <div className="grid grid-cols-2 gap-3">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`h-12 flex justify-center items-center rounded-md cursor-pointer ${
                    role === r.value
                      ? "bg-blue-600 text-white"
                      : "border border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          <Input
            className="w-full border border-slate-300"
            placeholder={role === "employee" ? "EMP-001" : "Enter PIN"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            variant="primary"
            className="w-full h-11 bg-blue-600  text-white rounded-md hover:bg-blue-700"
            onClick={handleLogin}
            isDisabled={employeesLoading || pinsLoading}
          >
            Login
          </Button>
        </div>

        {/* Footer */}

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">Meal Stub Management System</p>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                setRole("hr")
              }
              className={`p-3 rounded-lg border transition ${
                role === "hr"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-slate-300 hover:border-blue-500"
              }`}
            >
              HR
            </button>

            <button
              onClick={() =>
                setRole(
                  "pantry"
                )
              }
              className={`p-3 rounded-lg border transition ${
                role ===
                "pantry"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-slate-300 hover:border-blue-500"
              }`}
            >
              Pantry
            </button>

            <button
              onClick={() =>
                setRole(
                  "admin"
                )
              }
              className={`p-3 rounded-lg border transition ${
                role ===
                "admin"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-slate-300 hover:border-blue-500"
              }`}
            >
              Admin
            </button>

            <button
              onClick={() =>
                setRole(
                  "employee"
                )
              }
              className={`p-3 rounded-lg border transition ${
                role ===
                "employee"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-slate-300 hover:border-blue-500"
              }`}
            >
              Employee
            </button>
          </div> */
}

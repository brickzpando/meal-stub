"use client";

import { Button, Skeleton } from "@heroui/react";
import { UtensilsCrossed, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

interface Props {
  role: string;
}

export default function TopBar({ role }: Props) {
  const router = useRouter();
  const { logout, user } = useAuth();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
            <UtensilsCrossed className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Meal Stub Tracker
            </h1>

            {!mounted ? (
              <Skeleton className="h-4 w-40 rounded-md" />
            ) : (
              <p className="text-sm text-slate-500">
                Welcome, {user?.employee?.fullName ?? user?.role.toUpperCase()}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
            {role}
          </span>

          <Button onClick={handleLogout} variant="danger">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

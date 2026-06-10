"use client";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import PurchaseForm from "@/components/pantry/PurchaseForm";
import PurchaseHistory from "@/components/pantry/PurchaseHistory";
import { useAuth } from "@/context/AuthContext";

export default function PantryPage() {
  const router = useRouter();

  const { logout } = useAuth();

  return (
    <>
      <TopBar
        role="Pantry"
        onLogout={() => {
          logout();

          router.push("/login");
        }}
      />
      <main className="page-container">
        <div className="flex justify-center flex-col items-center">
          <h1 className="text-3xl font-bold text-slate-800">
            Pantry Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Process meal stub purchases and track balances
          </p>
        </div>
        <PurchaseForm />
        <PurchaseHistory />
      </main>
    </>
  );
}

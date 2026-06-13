import TopBar from "@/components/TopBar";
import PantrySummaryCards from "@/components/pantry/PantrySummaryCards";
import PurchaseForm from "@/components/pantry/PurchaseForm";
import PurchaseHistory from "@/components/pantry/PurchaseHistory";

export default function PantryPage() {
  return (
    <>
      <TopBar role="Pantry" />
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
        <PantrySummaryCards />

        <PurchaseHistory />
      </main>
    </>
  );
}

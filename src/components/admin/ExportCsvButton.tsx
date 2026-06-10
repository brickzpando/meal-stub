"use client";
import { useMealStub } from "@/context/MealStubContext";

export default function ExportCsvButton() {
  const { transactions } = useMealStub();

  const exportCsv = () => {
    const header = [
      "Date",
      "EmployeeId",
      "Type",
      "Amount",
      "Week",
      "Note",
    ].join(",");

    const rows = transactions.map((tx) =>
      [tx.date, tx.empId, tx.type, tx.amount, tx.week, tx.note].join(","),
    );

    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "transactions.csv";

    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button className="primary-btn" onClick={exportCsv}>
      Export CSV
    </button>
  );
}

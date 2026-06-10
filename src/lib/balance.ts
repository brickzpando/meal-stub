import { Transaction } from "@/types/transaction";

export function wkBal(
  empId: string,
  week: string,
  transactions: Transaction[],
) {
  const issued = transactions
    .filter((t) => t.empId === empId && t.type === "weekly" && t.week === week)
    .reduce((s, t) => s + t.amount, 0);

  const spent = transactions
    .filter(
      (t) =>
        t.empId === empId &&
        t.type === "purchase" &&
        t.stubType === "weekly" &&
        t.week === week,
    )
    .reduce((s, t) => s + t.amount, 0);

  return Math.max(0, issued - spent);
}

export function rwBal(empId: string, transactions: Transaction[]) {
  const issued = transactions
    .filter((t) => t.empId === empId && t.type === "reward")
    .reduce((s, t) => s + t.amount, 0);

  const spent = transactions
    .filter(
      (t) =>
        t.empId === empId && t.type === "purchase" && t.stubType === "reward",
    )
    .reduce((s, t) => s + t.amount, 0);

  return Math.max(0, issued - spent);
}

export function totalBal(
  empId: string,
  week: string,
  transactions: Transaction[],
) {
  return wkBal(empId, week, transactions) + rwBal(empId, transactions);
}

export function issuedWeekly(
  empId: string,
  week: string,
  transactions: Transaction[],
) {
  return transactions
    .filter((t) => t.empId === empId && t.type === "weekly" && t.week === week)
    .reduce((a, b) => a + b.amount, 0);
}

export function issuedReward(empId: string, transactions: Transaction[]) {
  return transactions
    .filter((t) => t.empId === empId && t.type === "reward")
    .reduce((a, b) => a + b.amount, 0);
}

export function canPurchase(
  empId: string,
  amount: number,
  type: "weekly" | "reward",
  week: string,
  transactions: Transaction[],
) {
  const balance =
    type === "weekly"
      ? wkBal(empId, week, transactions)
      : rwBal(empId, transactions);

  return amount <= balance;
}

export type TransactionType = "weekly" | "reward" | "purchase";

export type StubType = "weekly" | "reward";

export interface Transaction {
  id: string;
  date: string;
  week: string;
  empId: string;
  type: TransactionType;
  stubType: StubType;
  amount: number;
  note?: string;
}

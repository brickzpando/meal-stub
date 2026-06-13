// lib/queryKeys.ts
export const queryKeys = {
  employees: ["employees"] as const,
  issuance: ["issuance"] as const,
  dashboardStats: ["dashboard-stats"] as const,
  //TODO pareho ra ang admin og dashboard stats
  adminDashboardStats: ["admin-dashboard-stats"] as const,
  weeklySummary: ["weekly-summary"] as const,
  settlementReport: ["settlement-report"] as const,
  transactionReport: ["transaction-report"] as const,
  purchaseTransactions: ["purchase-transactions"] as const,
};

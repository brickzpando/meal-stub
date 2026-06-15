"use client";

import { useMemo, useState } from "react";
import { Chip, InputGroup, Pagination, Table } from "@heroui/react";
import { History, Search, Gift, CalendarDays } from "lucide-react";
import { useIssuanceHistory } from "@/hooks/issuance/useIssuanceHistory";
import { useEmployeeMap } from "@/hooks/employees/useEmployees";

export default function IssueHistoryTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  const { data: transactions = [] } = useIssuanceHistory();
  const { data: employeeMap = {} } = useEmployeeMap();
  const issuance = useMemo(() => {
    const searchTerm = search.toLowerCase();

    return transactions
      .filter((t) => {
        const employee = employeeMap[t.employeeId];

        if (!employee) return false;

        return (
          employee.fullName.toLowerCase().includes(searchTerm) ||
          (employee.employeeNumber ?? "").toLowerCase().includes(searchTerm)
        );
      })
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [transactions, search, employeeMap]);

  const pages = Math.ceil(issuance.length / rowsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return issuance.slice(start, start + rowsPerPage);
  }, [issuance, page]);

  const columns = [
    "DATE",
    "EMPLOYEE NO",
    "EMPLOYEE",
    "TYPE",
    "AMOUNT",
    "REASON",
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
            <History className="h-5 w-5 text-indigo-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Issuance History ({issuance.length})
            </h3>
            <p className="text-sm text-slate-500">
              View all weekly and reward stub issuances.
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <InputGroup className="border border-slate-300 w-full">
            <InputGroup.Prefix>
              <Search className="h-4 w-4 text-slate-400" />
            </InputGroup.Prefix>
            <InputGroup.Input
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      {/* TABLE */}
      <Table>
        <Table.Content aria-label="Issuance History">
          <Table.Header>
            {columns.map((column) => (
              <Table.Column
                key={column}
                isRowHeader={column === "EMPLOYEE"}
                className="text-slate-700"
              >
                {column}
              </Table.Column>
            ))}
          </Table.Header>

          <Table.Body>
            {paginatedItems.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {employeeMap[item.employeeId]?.employeeNumber ?? "-"}
                </Table.Cell>

                <Table.Cell>
                  {employeeMap[item.employeeId]?.fullName ?? "Unknown"}
                </Table.Cell>

                <Table.Cell>
                  {item.type === "REWARD" ? (
                    <Chip className="bg-emerald-100 text-emerald-700">
                      <Gift size={12} />
                      Reward
                    </Chip>
                  ) : (
                    <Chip className="bg-blue-100 text-blue-700">
                      <CalendarDays size={12} />
                      Weekly
                    </Chip>
                  )}
                </Table.Cell>

                <Table.Cell>₱{Number(item.amount).toLocaleString()}</Table.Cell>

                <Table.Cell>{item.remarks ?? "-"}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>

      {/* PAGINATION */}
      {pages > 1 && (
        <div className="mt-4">
          <Pagination className="justify-center">
            <Pagination.Content>
              <Pagination.Previous
                isDisabled={page === 1}
                onPress={() => setPage((p) => p - 1)}
              >
                Previous
              </Pagination.Previous>

              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Pagination.Link
                  key={p}
                  isActive={p === page}
                  onPress={() => setPage(p)}
                >
                  {p}
                </Pagination.Link>
              ))}

              <Pagination.Next
                isDisabled={page === pages}
                onPress={() => setPage((p) => p + 1)}
              >
                Next
              </Pagination.Next>
            </Pagination.Content>
          </Pagination>
        </div>
      )}
    </div>
  );
}

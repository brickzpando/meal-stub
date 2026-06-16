"use client";
import { useMemo } from "react";
import { Chip, InputGroup, Pagination, Table } from "@heroui/react";
import { useState } from "react";
import { Receipt, Search } from "lucide-react";
import { useTransactionReport } from "@/hooks/admin/useTransactionReport";
export default function TransactionReport() {
  const { data: transactions = [] } = useTransactionReport();
  const [search, setSearch] = useState("");
  const filteredTransactions = useMemo(() => {
    const keyword = search.toLowerCase();

    return transactions.filter((tx) => {
      return (
        tx.employeeName?.toLowerCase().includes(keyword) ||
        tx.employeeNumber?.toLowerCase().includes(keyword) ||
        tx.type?.toLowerCase().includes(keyword) ||
        tx.remarks?.toLowerCase().includes(keyword) ||
        tx.date?.toLowerCase().includes(keyword)
      );
    });
  }, [transactions, search]);

  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  const pages = Math.ceil(filteredTransactions.length / rowsPerPage);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return filteredTransactions.slice(start, start + rowsPerPage);
  }, [filteredTransactions, page]);

  const columns = [
    {
      key: "date",
      label: "DATE",
    },
    {
      key: "employeeNumber",
      label: "EMPLOYEE NO.",
    },
    {
      key: "employee",
      label: "EMPLOYEE",
      isRowHeader: true,
    },
    {
      key: "type",
      label: "TYPE",
    },
    {
      key: "amount",
      label: "AMOUNT",
    },
    {
      key: "note",
      label: "NOTE",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100">
            <Receipt className="h-5 w-5 text-cyan-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Transaction Report
            </h3>

            <p className="text-sm text-slate-500">
              Complete transaction history.
            </p>
          </div>
        </div>
        <div className="relative w-full md:w-80">
          <InputGroup className="border border-slate-300 w-full">
            <InputGroup.Prefix>
              <Search className=" h-4 w-4 text-slate-400" />
            </InputGroup.Prefix>
            <InputGroup.Input
              type="text"
              placeholder="Search transaction..."
              value={search}
              className=""
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Transaction Report">
            <Table.Header>
              {columns.map((column) => (
                <Table.Column
                  key={column.key}
                  isRowHeader={column.isRowHeader}
                  className="text-slate-700"
                >
                  {column.label}
                </Table.Column>
              ))}
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="flex flex-col items-center gap-3 py-12">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                    <Receipt className="h-7 w-7 text-slate-400" />
                  </div>

                  <div className="text-center">
                    <h4 className="font-semibold text-slate-700">
                      No transactions found
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Try adjusting your search.
                    </p>
                  </div>
                </div>
              )}
            >
              {paginatedTransactions.map((tx) => (
                <Table.Row key={tx.id} id={tx.id}>
                  <Table.Cell>{tx.date}</Table.Cell>
                  <Table.Cell>{tx.employeeNumber ?? "-"}</Table.Cell>

                  <Table.Cell>{tx.employeeName}</Table.Cell>

                  <Table.Cell>
                    <Chip
                      className={
                        tx.type === "WEEKLY"
                          ? "bg-emerald-100 text-emerald-700"
                          : tx.type === "REWARD"
                            ? "bg-blue-100 text-blue-700"
                            : tx.type === "ADJUSTMENT"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                      }
                    >
                      <Chip.Label>{tx.type}</Chip.Label>
                    </Chip>
                  </Table.Cell>

                  <Table.Cell>₱{tx.amount.toLocaleString()}</Table.Cell>

                  <Table.Cell>{tx.remarks || "-"}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      {pages > 1 && (
        <div className="mt-4">
          <Pagination className="justify-center">
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={page === 1}
                  onPress={() => setPage((p) => p - 1)}
                >
                  <Pagination.PreviousIcon />
                  <span>Previous</span>
                </Pagination.Previous>
              </Pagination.Item>

              {Array.from(
                {
                  length: pages,
                },
                (_, i) => i + 1,
              ).map((p) => (
                <Pagination.Item key={p}>
                  <Pagination.Link
                    isActive={p === page}
                    onPress={() => setPage(p)}
                  >
                    {p}
                  </Pagination.Link>
                </Pagination.Item>
              ))}

              <Pagination.Item>
                <Pagination.Next
                  isDisabled={page === pages}
                  onPress={() => setPage((p) => p + 1)}
                >
                  <span>Next</span>

                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      )}
    </div>
  );
}

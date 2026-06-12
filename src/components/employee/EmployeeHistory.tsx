"use client";
import { useMemo, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Chip, InputGroup, Pagination, Table } from "@heroui/react";
import { Receipt, Search } from "lucide-react";
import { useTransactions } from "@/hooks/transactions/useTransactions";

export default function EmployeeHistory() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const { data: transactions = [] } = useTransactions();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  const [search, setSearch] = useState("");

  const history = transactions
    .filter((t) => t.employeeId === user?.employee?.id)
    .slice()
    .reverse();

  const filteredHistory = history.filter(
    (item) =>
      item.type.toLowerCase().includes(search.toLowerCase()) ||
      (item.remarks ?? "").toLowerCase().includes(search.toLowerCase()),
  );
  const rowsPerPage = 10;
  const pages = Math.ceil(filteredHistory.length / rowsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return filteredHistory.slice(start, start + rowsPerPage);
  }, [filteredHistory, page]);

  if (!mounted) return null;
  if (!user?.employee) {
    return null;
  }

  const columns = ["DATE", "TYPE", "AMOUNT", "NOTE"];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
            <Receipt className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Transaction History
            </h3>

            <p className="text-sm text-slate-500">
              {history.length} total transactions
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <InputGroup className="border border-slate-300 w-full">
            <InputGroup.Prefix>
              <Search className=" h-4 w-4 text-slate-400" />
            </InputGroup.Prefix>
            <InputGroup.Input
              type="text"
              placeholder="Search transactions..."
              value={search}
              className=""
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Transaction History">
            <Table.Header>
              {columns.map((column) => (
                <Table.Column
                  isRowHeader
                  key={column}
                  className="text-slate-700"
                >
                  {column}
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
                      Your transaction history will appear here.
                    </p>
                  </div>
                </div>
              )}
            >
              {paginatedItems.map((item) => (
                <Table.Row key={item.id} id={item.id}>
                  <Table.Cell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Table.Cell>

                  <Table.Cell>
                    <Chip
                      className={
                        item.type === "WEEKLY"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.type === "REWARD"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      }
                    >
                      <Chip.Label>{item.type}</Chip.Label>
                    </Chip>
                  </Table.Cell>

                  <Table.Cell>₱{item.amount.toLocaleString()}</Table.Cell>

                  <Table.Cell>{item.remarks || "-"}</Table.Cell>
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
                    isActive={page === p}
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

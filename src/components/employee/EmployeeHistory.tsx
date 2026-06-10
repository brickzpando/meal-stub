"use client";
import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMealStub } from "@/context/MealStubContext";
import { Chip, InputGroup, Pagination, Table } from "@heroui/react";
import { Receipt, Search } from "lucide-react";

export default function EmployeeHistory() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const { transactions } = useMealStub();

  const [search, setSearch] = useState("");

  const rowsPerPage = 10;

  const history = transactions
    .filter((t) => t.empId === user?.employee?.id)
    .slice()
    .reverse();

  const filteredHistory = history.filter(
    (item) =>
      item.type.toLowerCase().includes(search.toLowerCase()) ||
      item.note?.toLowerCase().includes(search.toLowerCase()) ||
      item.date.toLowerCase().includes(search.toLowerCase()),
  );

  const pages = Math.ceil(filteredHistory.length / rowsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return filteredHistory.slice(start, start + rowsPerPage);
  }, [filteredHistory, page]);

  if (!user?.employee) {
    return null;
  }

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
                  <Table.Cell>{item.date}</Table.Cell>

                  <Table.Cell>
                    <Chip
                      className={
                        item.type === "weekly"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.type === "reward"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      }
                    >
                      <Chip.Label>{item.type}</Chip.Label>
                    </Chip>
                  </Table.Cell>

                  <Table.Cell>₱{item.amount.toLocaleString()}</Table.Cell>

                  <Table.Cell>{item.note || "-"}</Table.Cell>
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

      {/* <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Date
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Type
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Amount
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Note
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredHistory.length ===
            0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-sm text-slate-500"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredHistory.map(
                (
                  item
                ) => (
                  <tr
                    key={
                      item.id
                    }
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 text-slate-700">
                      {
                        item.date
                      }
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.type ===
                          "weekly"
                            ? "bg-emerald-100 text-emerald-700"
                            : item.type ===
                              "reward"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {
                          item.type
                        }
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right font-semibold text-slate-900">
                      ₱
                      {item.amount.toLocaleString()}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {item.note ||
                        "-"}
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}

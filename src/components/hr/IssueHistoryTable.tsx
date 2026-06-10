"use client";
import { useMemo, useState } from "react";
import { useMealStub } from "@/context/MealStubContext";
import { Chip, InputGroup, Pagination, Table } from "@heroui/react";
import { History, Search, Gift, CalendarDays } from "lucide-react";

export default function IssueHistoryTable() {
  const { transactions, employees } = useMealStub();
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  const [search, setSearch] = useState("");

  const issuance = transactions
    .filter(
      (t) =>
        (t.type === "weekly" || t.type === "reward") &&
        employees.some((e) => e.id === t.empId),
    )
    .filter((t) => {
      const employee = employees.find((e) => e.id === t.empId);

      return employee?.name.toLowerCase().includes(search.toLowerCase());
    })
    .reverse();

  const getName = (id: string) =>
    employees.find((e) => e.id === id)?.name || "Unknown";

  const pages = Math.ceil(issuance.length / rowsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return issuance.slice(start, start + rowsPerPage);
  }, [issuance, page]);

  const columns = ["DATE", "EMPLOYEE", "TYPE", "AMOUNT", "REASON"];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
              <Search className=" h-4 w-4 text-slate-400" />
            </InputGroup.Prefix>
            <InputGroup.Input
              type="text"
              placeholder="Search employee..."
              value={search}
              className=""
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      <Table>
        <Table.ScrollContainer>
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

            <Table.Body
              renderEmptyState={() => (
                <div className="flex flex-col items-center gap-3 py-12">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                    <History className="h-7 w-7 text-slate-400" />
                  </div>

                  <div className="text-center">
                    <h4 className="font-semibold text-slate-700">
                      No issuance records found
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Weekly and reward stub issuances will appear here.
                    </p>
                  </div>
                </div>
              )}
            >
              {paginatedItems.map((item) => (
                <Table.Row key={item.id} id={item.id}>
                  <Table.Cell>{item.date}</Table.Cell>

                  <Table.Cell>{getName(item.empId)}</Table.Cell>

                  <Table.Cell>
                    {item.type === "reward" ? (
                      <Chip
                        className="bg-emerald-100 text-emerald-700"
                        variant="primary"
                      >
                        <Gift size={12} />
                        <Chip.Label>Reward</Chip.Label>
                      </Chip>
                    ) : (
                      <Chip
                        className="bg-blue-100 text-blue-700"
                        variant="primary"
                      >
                        <CalendarDays size={12} />
                        <Chip.Label>Weekly</Chip.Label>
                      </Chip>
                    )}
                  </Table.Cell>

                  <Table.Cell>₱{item.amount.toLocaleString()}</Table.Cell>

                  <Table.Cell>{item.note || "-"}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      {pages > 0 && (
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

              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
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
      {/* <div className="max-h-125 overflow-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Employee
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Type
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Amount
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Reason
              </th>
            </tr>
          </thead>

          <tbody>
            {issuance.length >
            0 ? (
              issuance
                .slice()
                .reverse()
                .map(
                  (
                    item
                  ) => (
                    <tr
                      key={
                        item.id
                      }
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-4 text-slate-600">
                        {
                          item.date
                        }
                      </td>

                      <td className="px-4 py-4 font-medium text-slate-900">
                        {getName(
                          item.empId
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                            item.type ===
                            "reward"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.type ===
                          "reward" ? (
                            <>
                              <Gift className="h-3 w-3" />
                              Reward
                            </>
                          ) : (
                            <>
                              <CalendarDays className="h-3 w-3" />
                              Weekly
                            </>
                          )}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-semibold text-slate-900">
                        ₱
                        {item.amount.toLocaleString()}
                      </td>

                      <td className="max-w-xs px-4 py-4 text-slate-600">
                        {item.note ||
                          "-"}
                      </td>
                    </tr>
                  )
                )
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                      <History className="h-8 w-8 text-slate-400" />
                    </div>

                    <h4 className="font-semibold text-slate-700">
                      No issuance
                      records found
                    </h4>

                    <p className="text-sm text-slate-500">
                      Weekly and reward
                      stub issuances will
                      appear here.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}

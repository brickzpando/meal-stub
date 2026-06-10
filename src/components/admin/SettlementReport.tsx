"use client";

import { useMemo, useState } from "react";

import { useMealStub } from "@/context/MealStubContext";

import { InputGroup, Pagination, Table } from "@heroui/react";

import { Search, Wallet } from "lucide-react";

export default function SettlementReport() {
  const { employees, transactions } = useMealStub();

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()),
  );

  const pages = Math.ceil(filteredEmployees.length / rowsPerPage);

  const paginatedEmployees = useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return filteredEmployees.slice(start, start + rowsPerPage);
  }, [filteredEmployees, page]);

  const columns = [
    {
      key: "employee",
      label: "EMPLOYEE",
      isRowHeader: true,
    },
    {
      key: "issued",
      label: "ISSUED",
    },
    {
      key: "used",
      label: "USED",
    },
    {
      key: "remaining",
      label: "REMAINING",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
            <Wallet className="h-5 w-5 text-amber-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Settlement Report
            </h3>

            <p className="text-sm text-slate-500">
              Employee credit issuance, usage, and balances.
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
          <Table.Content aria-label="Settlement Report">
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
                    <Wallet className="h-7 w-7 text-slate-400" />
                  </div>

                  <div className="text-center">
                    <h4 className="font-semibold text-slate-700">
                      No employee records found
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Try adjusting your search.
                    </p>
                  </div>
                </div>
              )}
            >
              {paginatedEmployees.map((emp) => {
                const issued = transactions
                  .filter(
                    (t) =>
                      t.empId === emp.id &&
                      (t.type === "weekly" || t.type === "reward"),
                  )
                  .reduce((a, b) => a + b.amount, 0);

                const used = transactions
                  .filter((t) => t.empId === emp.id && t.type === "purchase")
                  .reduce((a, b) => a + b.amount, 0);

                const remaining = issued - used;

                return (
                  <Table.Row key={emp.id} id={emp.id}>
                    <Table.Cell>{emp.name}</Table.Cell>

                    <Table.Cell>
                      <span className="font-medium text-emerald-600">
                        ₱{issued.toLocaleString()}
                      </span>
                    </Table.Cell>

                    <Table.Cell>
                      <span className="font-medium text-rose-600">
                        ₱{used.toLocaleString()}
                      </span>
                    </Table.Cell>

                    <Table.Cell>
                      <span
                        className={`font-semibold ${
                          remaining >= 0 ? "text-blue-600" : "text-red-600"
                        }`}
                      >
                        ₱{remaining.toLocaleString()}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
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

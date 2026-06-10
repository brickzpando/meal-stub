"use client";
import { useMemo, useState } from "react";
import { useMealStub } from "@/context/MealStubContext";
import { currentWeek, getDeptChip } from "@/lib/helpers";
import { totalBal } from "@/lib/balance";

import { Users, Search, Trash2 } from "lucide-react";
import { Button, Chip, InputGroup, Pagination, Table } from "@heroui/react";

export default function EmployeeTable() {
  const { employees, setEmployees, transactions } = useMealStub();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;
  const week = currentWeek();

  const removeEmployee = (id: string) => {
    const ok = confirm("Remove employee?");

    if (!ok) return;

    setEmployees(employees.filter((e) => e.id !== id));
  };

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.dept.toLowerCase().includes(search.toLowerCase()),
  );
  const pages = Math.ceil(filtered.length / rowsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page]);

  const columns = [
    {
      key: "name",
      label: "NAME",
      isRowHeader: true,
    },
    {
      key: "id",
      label: "EMPLOYEE ID",
    },
    {
      key: "dept",
      label: "DEPARTMENT",
    },
    {
      key: "balance",
      label: "BALANCE",
    },
    {
      key: "action",
      label: "ACTION",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
            <Users className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Employees ({employees.length})
            </h3>

            <p className="text-sm text-slate-500">
              Manage employee records and balances.
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
          <Table.Content aria-label="Employees">
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
                <div className="flex flex-col items-center gap-4 py-14">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                    <Users className="h-7 w-7 text-slate-400" />
                  </div>

                  <div className="text-center">
                    <h4 className="text-base font-semibold text-slate-700">
                      No employees found
                    </h4>

                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                      No employee records match your search criteria.
                    </p>
                  </div>
                </div>
              )}
            >
              {paginatedItems.map((employee) => (
                <Table.Row key={employee.id} id={employee.id}>
                  <Table.Cell>
                    <span className="font-medium text-slate-900">
                      {employee.name}
                    </span>
                  </Table.Cell>

                  <Table.Cell>{employee.id}</Table.Cell>

                  <Table.Cell>
                    <Chip
                      className={getDeptChip(employee.dept)}
                      variant="primary"
                    >
                      <Chip.Label>{employee.dept}</Chip.Label>
                    </Chip>
                  </Table.Cell>

                  <Table.Cell>
                    <span className="font-semibold text-blue-600">
                      ₱
                      {totalBal(
                        employee.id,
                        week,
                        transactions,
                      ).toLocaleString()}
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                    <Button
                      variant="danger-soft"
                      onClick={() => removeEmployee(employee.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </Table.Cell>
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

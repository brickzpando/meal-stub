"use client";

import { useMemo, useState } from "react";

import { Users, Search, Trash2 } from "lucide-react";
import { Button, Chip, InputGroup, Pagination, Table } from "@heroui/react";
import { useEmployees } from "@/hooks/employees/useEmployees";
import { useDeleteEmployee } from "@/hooks/employees/useEmployeeMutations";

export default function EmployeeTable() {
  const { data: employees = [] } = useEmployees();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { mutate: deleteEmp } = useDeleteEmployee();
  const rowsPerPage = 10;

  const removeEmployee = async (id: string) => {
    const ok = confirm("Remove employee?");
    if (!ok) return;

    deleteEmp(id);
  };

  const filtered = employees.filter((e) =>
    `${e.fullName} ${e.employeeNumber} ${e.department ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
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
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
            <Users className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Employees ({employees.length})
            </h3>
            <p className="text-sm text-slate-500">Manage employee records.</p>
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
        <Table.Content>
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

          <Table.Body>
            {paginatedItems.map((emp) => (
              <Table.Row key={emp.id}>
                <Table.Cell className="font-medium">{emp.fullName}</Table.Cell>

                <Table.Cell>{emp.employeeNumber}</Table.Cell>

                <Table.Cell>
                  <Chip>
                    <Chip.Label>{emp.department ?? "N/A"}</Chip.Label>
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <span className="font-semibold text-blue-600">
                    ₱{(emp.balance ?? 0).toLocaleString()}
                  </span>
                </Table.Cell>

                <Table.Cell>
                  <Button
                    variant="danger-soft"
                    onClick={() => removeEmployee(emp.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </Table.Cell>
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

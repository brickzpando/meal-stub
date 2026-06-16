"use client";

import { useMemo, useState } from "react";

import { Users, Search, Trash2, Rocket } from "lucide-react";
import {
  Button,
  Chip,
  InputGroup,
  Pagination,
  Table,
  Modal,
  toast,
  Skeleton,
} from "@heroui/react";
import { useEmployees } from "@/hooks/employees/useEmployees";
import { useDeleteEmployee } from "@/hooks/employees/useEmployeeMutations";

export default function EmployeeTable() {
  const { data: employees = [], isLoading } = useEmployees();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { mutate: deleteEmpAsync, isPending } = useDeleteEmployee();
  const rowsPerPage = 10;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState("");

  const openDeleteModal = (id: string, name: string) => {
    setSelectedId(id);
    setSelectedName(name);
    setIsOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      await deleteEmpAsync(selectedId);

      setIsOpen(false);
      setSelectedId(null);
      setSelectedName("");

      toast.success("Employee deleted successfully", {
        description: `${selectedName} has been removed.`,
      });
    } catch (error) {
      console.error(error);

      toast.danger("Failed to delete employee", {
        description: "An error occurred while deleting employee.",
      });
    }
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

  const closeModal = () => {
    setIsOpen(false);
    setSelectedId(null);
    setSelectedName("");
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-xl" />

            <div className="space-y-2">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-4 w-48 rounded-md" />
            </div>
          </div>

          <Skeleton className="h-10 w-full rounded-md md:w-80" />
        </div>

        {/* Table Skeleton */}
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="border-b border-slate-200 p-4">
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-24 rounded-md" />
              ))}
            </div>
          </div>

          {Array.from({ length: 5 }).map((_, row) => (
            <div
              key={row}
              className="grid grid-cols-5 gap-4 border-b border-slate-100 p-4"
            >
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

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

          <Table.Body
            renderEmptyState={() => (
              <div className="flex flex-col items-center gap-3 py-12">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <Users className="h-7 w-7 text-slate-400" />
                </div>

                <div className="text-center">
                  <h4 className="font-semibold text-slate-700">
                    No employees found
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    No employee records match your search.
                  </p>
                </div>
              </div>
            )}
          >
            {paginatedItems.map((emp) => (
              <Table.Row key={emp.id}>
                <Table.Cell className="font-medium">{emp.fullName}</Table.Cell>

                <Table.Cell>{emp.employeeNumber}</Table.Cell>

                <Table.Cell>
                  <Chip>
                    <Chip.Label>
                      {emp.department?.toLocaleUpperCase() ?? "N/A"}
                    </Chip.Label>
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <span className="font-semibold text-blue-600">
                    ₱{(emp.balance ?? 0).toLocaleString()}
                  </span>
                </Table.Cell>

                <Table.Cell>
                  <Button
                    size="sm"
                    variant="danger-soft"
                    onClick={() => openDeleteModal(emp.id, emp.fullName)}
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
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[360px]">
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Icon className="bg-red-100 text-red-600">
                  <Rocket className="size-5" />
                </Modal.Icon>

                <Modal.Heading>Delete Employee</Modal.Heading>
              </Modal.Header>

              <Modal.Body>
                <p className="text-sm text-slate-600">
                  Are you sure you want to delete:
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {selectedName}
                </p>

                <p className="mt-2 text-xs text-red-500">
                  This action cannot be undone.
                </p>
              </Modal.Body>

              <Modal.Footer className="flex gap-2">
                <Button
                  variant="secondary"
                  className="w-full"
                  onPress={closeModal}
                >
                  Cancel
                </Button>

                <Button
                  className="w-full bg-red-600 text-white"
                  onPress={handleDelete}
                  isPending={isPending}
                >
                  {isPending ? "Deleting..." : "Delete"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}

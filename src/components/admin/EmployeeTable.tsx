"use client";

import { useMemo, useState } from "react";
import { Users, Search, Trash2, Edit2 } from "lucide-react";
import {
  Button,
  Chip,
  InputGroup,
  Pagination,
  Table,
  Modal,
  Input,
  Label,
  ComboBox,
  ListBox,
  Skeleton,
} from "@heroui/react";
import { useEmployees } from "@/hooks/employees/useEmployees";
import {
  useDeleteEmployee,
  useUpdateEmployee,
} from "@/hooks/employees/useEmployeeMutations";
import { Employee } from "@/types/employee";
import { useDepartments } from "@/hooks/employees/useDepartments";

export default function EmployeeTableAdmin() {
  const { data: employees = [], isLoading } = useEmployees();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { mutate: deleteEmp } = useDeleteEmployee();
  const rowsPerPage = 10;
  const { data: departments = [] } = useDepartments();
  const { mutate: updateEmp, isPending } = useUpdateEmployee();

  const [dept, setDept] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Employee | null>(null);

  const [form, setForm] = useState({
    id: "",
    fullName: "",
    employeeNumber: "",
    department: "",
    balance: "",
  });
  const filteredDepartments = departments.filter((d) =>
    d.toLowerCase().includes(form.department.toLowerCase()),
  );
  const removeEmployee = async (id: string) => {
    const ok = confirm("Remove employee?");
    if (!ok) return;

    deleteEmp(id);
  };

  const openEdit = (emp: Employee) => {
    setIsOpen(true);

    setTimeout(() => {
      setSelected(emp);
      setForm({
        id: emp.id,
        fullName: emp.fullName,
        employeeNumber: emp.employeeNumber,
        department: emp.department ?? "",
        balance: String(emp.balance ?? 0), // 🔥 CHANGE
      });
    }, 0);
  };

  const handleUpdate = () => {
    updateEmp(
      {
        id: form.id,
        fullName: form.fullName,
        employeeNumber: form.employeeNumber,
        department: form.department,
        balance: Number(form.balance || 0), // 🔥 convert only here
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setSelected(null);
        },
      },
    );
  };

  //   const filtered = employees.filter((e) =>
  //     `${e.fullName} ${e.employeeNumber} ${e.department ?? ""}`
  //       .toLowerCase()
  //       .includes(search.toLowerCase()),
  //   );
  const filtered = useMemo(() => {
    return employees.filter((e) =>
      `${e.fullName} ${e.employeeNumber} ${e.department ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [employees, search]);

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

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-xl" />

            <div className="space-y-2">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
          </div>

          <Skeleton className="h-10 w-full rounded-lg md:w-80" />
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 border-b border-slate-200 pb-3">
          <Skeleton className="h-4 rounded-md" />
          <Skeleton className="h-4 rounded-md" />
          <Skeleton className="h-4 rounded-md" />
          <Skeleton className="h-4 rounded-md" />
          <Skeleton className="h-4 rounded-md" />
        </div>

        {/* Rows */}
        <div className="space-y-4 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 items-center">
              <Skeleton className="h-5 rounded-md" />

              <Skeleton className="h-5 rounded-md" />

              <Skeleton className="h-7 w-24 rounded-full" />

              <Skeleton className="h-5 rounded-md" />

              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
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
                  <span
                    className={`font-semibold ${
                      (emp.balance ?? 0) >= 0 ? "text-blue-600" : "text-red-600"
                    }`}
                  >
                    ₱{(emp.balance ?? 0).toLocaleString()}
                  </span>
                </Table.Cell>

                <Table.Cell>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openEdit(emp)}
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="danger-soft"
                      onClick={() => removeEmployee(emp.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
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
            <Modal.Dialog className="sm:max-w-80">
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Heading>Edit Employee</Modal.Heading>
              </Modal.Header>

              <Modal.Body className="space-y-3">
                <Label>Fullname</Label>
                <Input
                  className="border border-slate-300 w-full"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />

                <Label>Employee Number</Label>
                <Input
                  className="border border-slate-300 w-full"
                  value={form.employeeNumber}
                  onChange={(e) =>
                    setForm({ ...form, employeeNumber: e.target.value })
                  }
                />

                <Label>Department</Label>
                <ComboBox
                  selectedKey={form.department}
                  onSelectionChange={(key) =>
                    setForm((prev) => ({
                      ...prev,
                      department: String(key),
                    }))
                  }
                >
                  <ComboBox.InputGroup>
                    {/* <Input
                      placeholder="Select department"
                      className="border border-gray-300"
                      value={form.department}
                      onChange={(e) => setDept(e.target.value)}
                    /> */}
                    <Input
                      placeholder="Select department"
                      className="border border-gray-300"
                      value={form.department}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          department: e.target.value.toUpperCase(),
                        }))
                      }
                    />
                    <ComboBox.Trigger />
                  </ComboBox.InputGroup>

                  <ComboBox.Popover>
                    <ListBox className="max-h-48 overflow-y-auto">
                      {filteredDepartments.map((d) => (
                        <ListBox.Item key={d} id={d} textValue={d}>
                          {d}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </ComboBox.Popover>
                </ComboBox>
                {/* <Input
                  className="border border-slate-300 w-full"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                /> */}
                <Label>Balance</Label>
                <Input
                  type="number"
                  className="w-full border border-slate-300"
                  value={form.balance}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      balance: e.target.value, // 🔥 keep as string
                    })
                  }
                />
              </Modal.Body>

              <Modal.Footer>
                <Button
                  variant="secondary"
                  size="sm"
                  onPress={() => setIsOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  onPress={handleUpdate}
                  isPending={isPending}
                  //   className="w-full"
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}

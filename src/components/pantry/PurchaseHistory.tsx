"use client";
import { Table, Chip, InputGroup, Pagination } from "@heroui/react";
import { useMemo, useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { useMealStub } from "@/context/MealStubContext";

export default function PurchaseHistory() {
  const { employees, transactions } = useMealStub();
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;
  const [search, setSearch] = useState("");

  const purchases = transactions.filter((t) => t.type === "purchase");

  const employeeName = (id: string) =>
    employees.find((e) => e.id === id)?.name || "Unknown";

  const filteredPurchases = purchases.filter((purchase) => {
    const employee = employeeName(purchase.empId);

    return (
      employee.toLowerCase().includes(search.toLowerCase()) ||
      purchase.date.toLowerCase().includes(search.toLowerCase()) ||
      purchase.stubType.toLowerCase().includes(search.toLowerCase())
    );
  });

  const pages = Math.ceil(filteredPurchases.length / rowsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return filteredPurchases
      .slice()
      .reverse()
      .slice(start, start + rowsPerPage);
  }, [filteredPurchases, page]);
  const columns = ["DATE", "EMPLOYEE", "STUB TYPE", "AMOUNT"];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Purchase History ({filteredPurchases.length})
            </h3>

            <p className="text-sm text-slate-500">Pantry transaction records</p>
          </div>
        </div>

        <div className="w-full md:w-72">
          <InputGroup className="border border-slate-300 w-full">
            <InputGroup.Prefix>
              <Search className=" h-4 w-4 text-slate-400" />
            </InputGroup.Prefix>
            <InputGroup.Input
              type="text"
              placeholder="Search purchases..."
              value={search}
              className=""
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Purchase History">
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
                    <ShoppingCart className="h-7 w-7 text-slate-400" />
                  </div>

                  <div className="text-center">
                    <h4 className="font-semibold text-slate-700">
                      No purchases found
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Pantry purchase transactions will appear here.
                    </p>
                  </div>
                </div>
              )}
            >
              {paginatedItems.map((purchase) => (
                <Table.Row key={purchase.id} id={purchase.id}>
                  <Table.Cell>{purchase.date}</Table.Cell>

                  <Table.Cell>{employeeName(purchase.empId)}</Table.Cell>

                  <Table.Cell>
                    <Chip
                      className={
                        purchase.stubType === "weekly"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }
                    >
                      <Chip.Label>{purchase.stubType}</Chip.Label>
                    </Chip>
                  </Table.Cell>

                  <Table.Cell>₱{purchase.amount.toLocaleString()}</Table.Cell>
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

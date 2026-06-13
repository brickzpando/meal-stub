"use client";
import { useMemo, useState } from "react";
import { Pagination, Table } from "@heroui/react";
import { CalendarDays } from "lucide-react";
import { useWeeklySummary } from "@/hooks/admin/useWeeklySummary";

export default function WeeklySummary() {
  const { data: weeklyData = [] } = useWeeklySummary();
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  const pages = Math.ceil(weeklyData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return weeklyData.slice(start, start + rowsPerPage);
  }, [weeklyData, page]);

  const columns = [
    {
      key: "week",
      label: "WEEK",
      isRowHeader: true,
    },
    {
      key: "weekly_credit",
      label: "WEEKLY CREDIT",
    },
    {
      key: "reward_credit",
      label: "REWARD CREDIT",
    },
    {
      key: "purchases",
      label: "PURCHASES",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100">
          <CalendarDays className="h-5 w-5 text-violet-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Weekly Summary
          </h3>

          <p className="text-sm text-slate-500">
            Weekly meal stub activity overview.
          </p>
        </div>
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Weekly Summary">
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
                    <CalendarDays className="h-7 w-7 text-slate-400" />
                  </div>

                  <div className="text-center">
                    <h4 className="font-semibold text-slate-700">
                      No weekly data available
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Weekly summaries will appear here.
                    </p>
                  </div>
                </div>
              )}
            >
              {paginatedData.map(([week, data]) => (
                <Table.Row key={week} id={week}>
                  <Table.Cell>
                    <span className="font-medium">{week}</span>
                  </Table.Cell>

                  <Table.Cell>
                    <span className="font-medium text-emerald-600">
                      ₱{data.weekly.toLocaleString()}
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                    <span className="font-medium text-blue-600">
                      ₱{data.reward.toLocaleString()}
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                    <span className="font-medium text-rose-600">
                      ₱{data.purchase.toLocaleString()}
                    </span>
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

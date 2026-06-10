export function today() {
  return new Date().toISOString().split("T")[0];
}

export function formatDate(value?: string) {
  if (!value) return "";

  const [y, m, d] = value.split("-");

  return `${m}/${d}/${y}`;
}

export function weekOf(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  const day = date.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  const monday = new Date(date);

  monday.setDate(date.getDate() + diff);

  return monday.toISOString().split("T")[0];
}

export function currentWeek() {
  return weekOf(today());
}

export function generateEmployeeId(count: number) {
  return `EMP-${String(count + 1).padStart(3, "0")}`;
}

export const getDeptChip = (dept: string) => {
  switch (dept.toLowerCase()) {
    case "it":
      return "bg-blue-100 text-blue-700";

    case "hr":
      return "bg-purple-100 text-purple-700";

    case "finance":
      return "bg-emerald-100 text-emerald-700";

    case "operations":
      return "bg-amber-100 text-amber-700";

    case "sales":
      return "bg-pink-100 text-pink-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

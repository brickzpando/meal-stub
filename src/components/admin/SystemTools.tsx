"use client";

export default function SystemTools() {
  const resetData = () => {
    const ok = confirm("Delete all data?");

    if (!ok) return;

    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="inline-flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">System Tools</h3>
        <p className="text-xs text-slate-500">Administrative actions</p>
      </div>

      <button
        onClick={resetData}
        className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
      >
        Reset System
      </button>
    </div>
  );
}

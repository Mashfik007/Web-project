"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminPageShell from "@/Components/AdminCatalog/AdminPageShell/AdminPageShell";
import AdminCard from "@/Components/AdminOps/AdminCard/AdminCard";
import { ModalButton, StatusModal, useFeedback } from "@/Components/Modal";
import type {
  AdminReport,
  AdminReportPeriod,
  AdminReportTab,
} from "@/types/adminOps";

interface ReportsPageProps {
  adminId: string;
  period: AdminReportPeriod;
  tab: AdminReportTab;
  from: string;
  to: string;
  report: AdminReport;
}

const periodOptions: { id: AdminReportPeriod; label: string }[] = [
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "year", label: "This Year" },
  { id: "custom", label: "Custom" },
];

const tabOptions: { id: AdminReportTab; label: string }[] = [
  { id: "borrows", label: "Borrow Activity" },
  { id: "users", label: "User Stats" },
  { id: "fines", label: "Fine Report" },
  { id: "inventory", label: "Inventory" },
];

export default function ReportsPage({
  adminId,
  period,
  tab,
  from,
  to,
  report,
}: ReportsPageProps) {
  const router = useRouter();
  const feedback = useFeedback();
  const [exporting, setExporting] = useState<"csv" | "pdf" | null>(null);

  function openReport(next: {
    period?: AdminReportPeriod;
    tab?: AdminReportTab;
    from?: string;
    to?: string;
  }) {
    const params = new URLSearchParams({
      period: next.period ?? period,
      tab: next.tab ?? tab,
      from: next.from ?? from,
      to: next.to ?? to,
    });
    router.replace(`/admin/${adminId}/reports?${params}`);
  }

  async function download(format: "csv" | "pdf") {
    setExporting(format);
    try {
      const params = new URLSearchParams({ period, tab, format, from, to });
      const response = await fetch(`/api/admin/export-report?${params}`);
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        feedback.failed(
          "Export failed",
          data?.message || "Could not export the report.",
        );
        return;
      }

      const blob = await response.blob();
      const header = response.headers.get("Content-Disposition") ?? "";
      const filename =
        header.match(/filename="([^"]+)"/)?.[1] ?? `report.${format}`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      feedback.success(
        format === "csv" ? "CSV exported" : "PDF exported",
        response.headers.get("X-Report-Message") || "The report was downloaded.",
      );
    } catch {
      feedback.failed("Export failed", "Could not reach the server.");
    } finally {
      setExporting(null);
    }
  }

  return (
    <AdminPageShell
      title="Reports & Analytics"
      subtitle="Comprehensive insights into library operations"
      framed={false}
      headerRight={
        <div className="flex gap-2">
          <ModalButton
            tone="secondary"
            onClick={() => download("csv")}
          >
            {exporting === "csv" ? "Exporting..." : "Export CSV"}
          </ModalButton>
          <ModalButton onClick={() => download("pdf")}>
            {exporting === "pdf" ? "Exporting..." : "Export PDF"}
          </ModalButton>
        </div>
      }
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {periodOptions.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => openReport({ period: item.id })}
            className={`btn btn-sm ${
              period === item.id ? "btn-primary btn-soft" : "btn-ghost"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {period === "custom" ? (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-500">
            From
            <input
              type="date"
              value={from}
              onChange={(event) => openReport({ from: event.target.value })}
              className="input input-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-500">
            To
            <input
              type="date"
              value={to}
              onChange={(event) => openReport({ to: event.target.value })}
              className="input input-sm"
            />
          </label>
        </div>
      ) : null}

      <div className="mb-5 flex flex-wrap gap-2">
        {tabOptions.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => openReport({ tab: item.id })}
            className={`btn btn-sm ${tab === item.id ? "btn-neutral" : "btn-ghost"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdminCard>
            <div className="p-5">
              <h2 className="font-semibold text-slate-800">{report.chartTitle}</h2>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={report.trends}
                    margin={{ left: -18, right: 8, top: 8 }}
                  >
                    <defs>
                      <linearGradient
                        id="reportFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8B5CF6"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8B5CF6"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      stroke="#E5E7EB"
                      strokeDasharray="4 4"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="borrows"
                      name={report.seriesName}
                      stroke="#8B5CF6"
                      fill="url(#reportFill)"
                      strokeWidth={2.4}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </AdminCard>
        </div>

        <AdminCard>
          <div className="p-5">
            <h2 className="font-semibold text-slate-800">{report.tableTitle}</h2>
            <table className="mt-4 table">
              <thead>
                <tr>
                  {report.columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-slate-400">
                      No records in this period.
                    </td>
                  </tr>
                ) : (
                  report.rows.map((row) => (
                    <tr key={`${row.primary}-${row.secondary}-${row.extra}`}>
                      <td className="font-medium">{row.primary}</td>
                      <td>
                        <span className="badge badge-soft badge-info badge-sm">
                          {row.secondary}
                        </span>
                      </td>
                      <td>{row.value}</td>
                      <td>{row.extra}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>

      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </AdminPageShell>
  );
}

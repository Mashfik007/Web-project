"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminPageShell } from "@/Components/AdminCatalog/AdminCatalogUi";
import { AdminCard } from "@/Components/AdminOps/AdminOpsUi";
import { ModalButton, StatusModal, useFeedback } from "@/Components/Modal/AppModal";
import type { AdminReportPoint, AdminTopBook } from "@/types/adminOps";

interface ReportsPageProps {
  trends: AdminReportPoint[];
  topBooks: AdminTopBook[];
}

export default function ReportsPage({ trends, topBooks }: ReportsPageProps) {
  const [period, setPeriod] = useState("This Month");
  const [tab, setTab] = useState("Borrow Activity");
  const feedback = useFeedback();

  return (
    <AdminPageShell
      title="Reports & Analytics"
      subtitle="Comprehensive insights into library operations"
      framed={false}
      headerRight={
        <div className="flex gap-2">
          <ModalButton
            tone="secondary"
            onClick={() =>
              feedback.success("CSV exported", "Borrow activity was downloaded as CSV.")
            }
          >
            Export CSV
          </ModalButton>
          <ModalButton
            onClick={() =>
              feedback.success("PDF exported", "The report PDF is ready to share.")
            }
          >
            Export PDF
          </ModalButton>
        </div>
      }
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {["This Week", "This Month", "This Year", "Custom"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPeriod(item)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              period === item
                ? "bg-sky-100 text-sky-700"
                : "bg-white text-slate-500"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {["Borrow Activity", "User Stats", "Fine Report", "Inventory"].map(
          (item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                tab === item
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-500"
              }`}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdminCard>
            <div className="p-5">
              <h2 className="font-semibold text-slate-800">
                Monthly Borrow Trends
              </h2>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trends}
                    margin={{ left: -18, right: 8, top: 8 }}
                  >
                    <defs>
                      <linearGradient id="reportFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.02} />
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
            <h2 className="font-semibold text-slate-800">Top Borrowed Books</h2>
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] tracking-wide text-slate-400 uppercase">
                  <th className="pb-2">Book</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Borrows</th>
                  <th className="pb-2">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topBooks.map((book) => (
                  <tr key={book.title}>
                    <td className="py-3 font-medium text-slate-800">{book.title}</td>
                    <td className="py-3">
                      <span className="rounded-md bg-sky-50 px-2 py-0.5 text-xs text-sky-600">
                        {book.category}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">{book.borrows}</td>
                    <td className="py-3 text-slate-600">★ {book.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>

      <StatusModal
        open={feedback.status !== null}
        onClose={feedback.closeStatus}
        variant={feedback.status?.variant ?? "success"}
        title={feedback.status?.title ?? ""}
        message={feedback.status?.message ?? ""}
      />
    </AdminPageShell>
  );
}

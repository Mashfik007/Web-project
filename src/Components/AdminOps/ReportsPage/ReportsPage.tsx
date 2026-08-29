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
import AdminPageShell from "@/Components/AdminCatalog/AdminPageShell/AdminPageShell";
import AdminCard from "@/Components/AdminOps/AdminCard/AdminCard";
import { ModalButton, StatusModal, useFeedback } from "@/Components/Modal";
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
            className={`btn btn-sm ${
              period === item ? "btn-primary btn-soft" : "btn-ghost"
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
              className={`btn btn-sm ${
                tab === item ? "btn-neutral" : "btn-ghost"
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
            <table className="table mt-4">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Category</th>
                  <th>Borrows</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {topBooks.map((book) => (
                  <tr key={book.title}>
                    <td className="font-medium">{book.title}</td>
                    <td>
                      <span className="badge badge-soft badge-info badge-sm">
                        {book.category}
                      </span>
                    </td>
                    <td>{book.borrows}</td>
                    <td>★ {book.rating}</td>
                  </tr>
                ))}
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

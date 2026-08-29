"use client";

import type { MonthlyBorrowPoint } from "@/types/adminDashboard";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlyBorrowChartProps {
  data: MonthlyBorrowPoint[];
  yearLabel: string;
}

export default function MonthlyBorrowChart({
  data,
  yearLabel,
}: MonthlyBorrowChartProps) {
  return (
    <article className="card bg-base-100 p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-800">
            Monthly Borrow Activity
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Last 12 months — borrows vs returns
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-xs"
        >
          {yearLabel}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3.5 text-slate-400"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="borrowFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0.02} />
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
              domain={[0, 600]}
              ticks={[0, 150, 300, 450, 600]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94A3B8" }}
            />
            <Tooltip
              cursor={{ stroke: "#99F6E4", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #E2E8F0",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="borrows"
              stroke="#14B8A6"
              strokeWidth={2.4}
              fill="url(#borrowFill)"
              activeDot={{ r: 5, stroke: "#14B8A6", fill: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

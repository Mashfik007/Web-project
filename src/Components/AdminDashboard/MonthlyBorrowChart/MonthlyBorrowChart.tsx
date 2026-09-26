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

function axisTop(values: number[]) {
  const peak = Math.max(1, ...values);
  if (peak <= 5) return 5;
  const step = Math.pow(10, Math.floor(Math.log10(peak)));
  return Math.ceil(peak / step) * step;
}

export default function MonthlyBorrowChart({
  data,
  yearLabel,
}: MonthlyBorrowChartProps) {
  const top = axisTop(data.flatMap((point) => [point.borrows, point.returns]));
  const ticks = [0, 1, 2, 3, 4].map((step) => Math.round((top / 4) * step));

  return (
    <article className="card bg-base-100 p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-800">
            Monthly Borrow Activity
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Borrows and returns in {yearLabel}
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500">{yearLabel}</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id="borrowFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="returnFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.02} />
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
              domain={[0, top]}
              ticks={ticks}
              allowDecimals={false}
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
              name="Borrows"
              stroke="#14B8A6"
              strokeWidth={2.4}
              fill="url(#borrowFill)"
              activeDot={{
                r: 5,
                stroke: "#14B8A6",
                fill: "#fff",
                strokeWidth: 2,
              }}
            />
            <Area
              type="monotone"
              dataKey="returns"
              name="Returns"
              stroke="#38BDF8"
              strokeWidth={2.4}
              fill="url(#returnFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

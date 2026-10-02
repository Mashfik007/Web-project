"use client";

import type { CategoryCount } from "@/types/adminDashboard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BooksByCategoryChartProps {
  data: CategoryCount[];
}

function axisTop(peak: number) {
  if (peak <= 5) return 5;
  const step = Math.pow(10, Math.floor(Math.log10(peak)));
  return Math.ceil(peak / step) * step;
}

export default function BooksByCategoryChart({
  data,
}: BooksByCategoryChartProps) {
  const top = axisTop(Math.max(1, ...data.map((item) => item.count), 1));
  const ticks = [0, 1, 2, 3, 4].map((step) => Math.round((top / 4) * step));

  return (
    <article className="card bg-base-100 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-800">
        Books by Category
      </h2>
      <p className="mt-0.5 text-xs text-slate-400">
        Collection distribution across categories
      </p>

      {data.length === 0 ? (
        <p className="mt-8 text-sm text-slate-400">No books in the catalog yet.</p>
      ) : (
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#E5E7EB"
                strokeDasharray="4 4"
              />
              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                interval={0}
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
                cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #E2E8F0",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="count"
                name="Books"
                fill="#60A5FA"
                radius={[6, 6, 0, 0]}
                maxBarSize={44}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}

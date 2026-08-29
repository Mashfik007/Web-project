"use client";

import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const books = [
  { month: "Feb", value: 2 },
  { month: "Mar", value: 3 },
  { month: "Apr", value: 4 },
  { month: "May", value: 2 },
  { month: "Jun", value: 5 },
  { month: "Jul", value: 4 },
];

export default function BooksPerMonth() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-serif text-lg font-bold text-slate-700">
        Books / Month
      </h2>

      <div className="mt-4 h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={books} margin={{ top: 16, right: 4, left: -28, bottom: 0 }}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94A3B8" }}
            />
            <YAxis
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94A3B8" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(14, 165, 233, 0.08)" }}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #E2E8F0",
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="value"
              fill="#0284C7"
              radius={[8, 8, 0, 0]}
              maxBarSize={28}
            >
              <LabelList
                dataKey="value"
                position="top"
                fill="#64748B"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

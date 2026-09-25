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
import type { DashboardMonth } from "@/types/dashboard";

interface BooksPerMonthProps {
  months: DashboardMonth[];
}

export default function BooksPerMonth({ months }: BooksPerMonthProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-serif text-lg font-bold text-slate-700">Books / Month</h2>

      <div className="mt-4 h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={months} margin={{ top: 16, right: 4, left: -28, bottom: 0 }}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94A3B8" }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94A3B8" }}
              width={28}
            />
            <Tooltip
              cursor={{ fill: "rgba(14, 165, 233, 0.08)" }}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #E2E8F0",
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" fill="#0284C7" radius={[8, 8, 0, 0]} maxBarSize={28}>
              <LabelList dataKey="value" position="top" fill="#64748B" fontSize={10} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

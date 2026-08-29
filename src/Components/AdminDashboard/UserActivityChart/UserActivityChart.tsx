"use client";

import type { UserActivitySlice } from "@/types/adminDashboard";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface UserActivityChartProps {
  data: UserActivitySlice[];
  total: number;
}

export default function UserActivityChart({
  data,
  total,
}: UserActivityChartProps) {
  return (
    <article className="card bg-base-100 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-800">User Activity</h2>
      <p className="mt-0.5 text-xs text-slate-400">
        Breakdown of {total.toLocaleString()} active users
      </p>

      <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row">
        <div className="size-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={52}
                outerRadius={74}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((slice) => (
                  <Cell key={slice.id} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #E2E8F0",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="w-full space-y-2.5">
          {data.map((slice) => (
            <li
              key={slice.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2 text-slate-600">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                {slice.label}
              </span>
              <span className="font-semibold text-slate-800">{slice.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

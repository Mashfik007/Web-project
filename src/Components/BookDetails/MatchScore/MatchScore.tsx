"use client";

import Image from "next/image";
import userIcon from "@svg/user.svg";
import type { BookDetails } from "@/types/bookDetails";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

interface MatchScoreProps {
  matchScore: BookDetails["matchScore"];
}

export default function MatchScore({ matchScore }: MatchScoreProps) {
  const data = [
    {
      name: "Match",
      value: matchScore.score,
      fill: "#0ea5e9",
    },
  ];

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
          <Image
            src={userIcon}
            alt="User"
            width={16}
            height={16}
            className="size-4"
          />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">
          Blind Date Match Score
        </h3>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Based on your reading history and preferences
      </p>

      <div className="mt-5 flex flex-col items-center">
        <div className="relative size-36">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={data}
              innerRadius="78%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              barSize={10}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, matchScore.maxScore]}
                tick={false}
              />
              <RadialBar
                dataKey="value"
                background={{ fill: "#e2e8f0" }}
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-800">
              {matchScore.score}
            </span>
            <span className="text-xs text-slate-400">
              / {matchScore.maxScore}
            </span>
          </div>
        </div>

        <p className="mt-4 text-sm font-semibold text-sky-600">
          {matchScore.label}
        </p>
        <p className="mt-2 text-center text-xs leading-relaxed text-slate-500">
          {matchScore.description}
        </p>
      </div>
    </article>
  );
}

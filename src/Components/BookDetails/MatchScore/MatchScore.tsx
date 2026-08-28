import type { BookDetails } from "@/types/bookDetails";

interface MatchScoreProps {
  matchScore: BookDetails["matchScore"];
}

export default function MatchScore({ matchScore }: MatchScoreProps) {
  const percentage = (matchScore.score / matchScore.maxScore) * 100;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
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
          <svg viewBox="0 0 128 128" className="size-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
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

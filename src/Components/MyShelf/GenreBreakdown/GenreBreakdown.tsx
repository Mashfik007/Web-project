import type { GenreStat } from "@/types/myShelf";

interface GenreBreakdownProps {
  genres: GenreStat[];
}

export default function GenreBreakdown({ genres }: GenreBreakdownProps) {
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
            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
            <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-800">
          Genre Breakdown
        </h3>
      </div>

      <ul className="mt-5 space-y-4">
        {genres.map((genre) => (
          <li key={genre.genre}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">{genre.genre}</span>
              <span className="text-slate-400">
                {genre.count} books · {genre.percentage}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-sky-500"
                style={{ width: `${genre.percentage}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

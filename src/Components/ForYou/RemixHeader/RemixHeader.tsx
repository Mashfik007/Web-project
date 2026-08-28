import type { ForYouHeader } from "@/types/forYou";

interface RemixHeaderProps {
  header: ForYouHeader;
}

export default function RemixHeader({ header }: RemixHeaderProps) {
  return (
    <section>
      <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
        {header.label}
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">
        {header.title}{" "}
        <span className="bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text font-serif italic text-transparent">
          {header.titleAccent}
        </span>
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
        {header.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {header.topGenres.map((genre, index) => (
          <div key={genre.genre} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-sm font-medium text-slate-400">+</span>
            )}
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: genre.color }}
            >
              #{genre.rank} {genre.genre} {genre.percentage}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
        >
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
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          Blind Date
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-5 py-2.5 text-sm font-semibold text-sky-600 transition hover:bg-sky-50"
        >
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
            <circle cx="12" cy="12" r="10" />
            <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
            <path d="m12 2 2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />
          </svg>
          Series Navigator
        </button>
      </div>
    </section>
  );
}

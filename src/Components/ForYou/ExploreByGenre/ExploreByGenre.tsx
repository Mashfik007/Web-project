import Link from "next/link";
import type { ExploreGenre } from "@/types/forYou";

interface ExploreByGenreProps {
  genres: ExploreGenre[];
  catalogHref: string;
}

export default function ExploreByGenre({
  genres,
  catalogHref,
}: ExploreByGenreProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Explore by Genre
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Tap any genre to see tailored picks
          </p>
        </div>

        <Link
          href={catalogHref}
          className="text-xs font-semibold text-sky-600 hover:underline"
        >
          Full catalog &gt;
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre.id}
            type="button"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition hover:opacity-80"
            style={{
              backgroundColor: genre.backgroundColor,
              color: genre.color,
            }}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: genre.color }}
            />
            {genre.label}
          </button>
        ))}
      </div>
    </section>
  );
}

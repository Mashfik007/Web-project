import SearchButton from "./Button/user.search.button";

interface IntroProps {
  name?: string;
  dueBooks?: number;
  streak?: number;
}

export default function Intro({
  name = "Elara Ashford",
  dueBooks = 2,
  streak = 14,
}: IntroProps) {
  return (
    <section className="relative w-full overflow-hidden rounded-b-[22px] bg-gradient-to-r from-[#142536] via-[#183a55] to-[#07567d] px-6 py-7 md:px-14 md:py-8">
      {/* Background decorative bars */}
      <div className="absolute right-8 bottom-0 flex items-end gap-2 opacity-30">
        <div className="h-16 w-3 rounded-t-md bg-sky-300" />
        <div className="h-24 w-3 rounded-t-md bg-sky-300" />
        <div className="h-12 w-3 rounded-t-md bg-sky-300" />
        <div className="h-32 w-3 rounded-t-md bg-sky-300" />
        <div className="h-20 w-3 rounded-t-md bg-sky-300" />
      </div>

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        {/* Left content */}
        <div>
          <p className="mb-2 text-xs font-medium tracking-[0.18em] text-sky-300">
            GOOD MORNING
          </p>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
            {name}
          </h1>

          <p className="mt-2 text-sm tracking-wide text-slate-300 md:text-base">
            {dueBooks} books due this week ·{" "}
            <span className="font-semibold text-white">
              {streak}-day streak
            </span>{" "}
            🔥
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <SearchButton label="Book Search" />

          <button className="flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all duration-200 hover:bg-sky-300">
            {/* Shuffle SVG */}
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
              <path d="m16 3 4 4-4 4" />
              <path d="M4 7h3c4 0 5 10 9 10h4" />
              <path d="m16 13 4 4-4 4" />
              <path d="M4 17h3c1.5 0 2.5-1.5 3.5-3.5" />
            </svg>
            For You
          </button>
        </div>
      </div>
    </section>
  );
}

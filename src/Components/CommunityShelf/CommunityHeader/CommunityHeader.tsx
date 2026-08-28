import type { CommunityShelfHeader } from "@/types/communityShelf";

interface CommunityHeaderProps {
  header: CommunityShelfHeader;
}

export default function CommunityHeader({ header }: CommunityHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-semibold tracking-[0.2em] text-sky-500 uppercase">
          {header.brand}
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-slate-800 md:text-4xl">
          {header.title}
        </h1>
        <p className="mt-1 text-sm text-sky-600">{header.subtitle}</p>
      </div>

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
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        Request a Book
      </button>
    </div>
  );
}

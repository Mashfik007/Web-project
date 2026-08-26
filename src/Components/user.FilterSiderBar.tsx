import FilterSection from "./user.Filtersearch";

const genres = [
  "Fiction",
  "Mystery",
  "Sci-Fi",
  "Romance",
  "Fantasy",
  "Non-Fiction",
  "Literary",
];

export default function FilterSidebar() {
  return (
    <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Filter header */}
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="size-4 text-sky-600"
        >
          <path d="M4 4h16l-6 7v6l-4 3v-9z" />
        </svg>

        <span className="text-sm font-semibold text-slate-600">Filters</span>
      </div>

      {/* Genre */}
      <FilterSection title="GENRE">
        {genres.map((genre) => (
          <label
            key={genre}
            className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
          >
            <input
              type="checkbox"
              className="checkbox checkbox-sm checkbox-info"
            />

            {genre}
          </label>
        ))}
      </FilterSection>

      {/* Availability */}
      <FilterSection title="AVAILABILITY">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input
            type="radio"
            name="availability"
            defaultChecked
            className="radio radio-sm radio-info"
          />
          All
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input
            type="radio"
            name="availability"
            className="radio radio-sm radio-info"
          />
          Available
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input
            type="radio"
            name="availability"
            className="radio radio-sm radio-info"
          />
          On Loan
        </label>
      </FilterSection>

      {/* Format */}
      <FilterSection title="FORMAT">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input
            type="radio"
            name="format"
            defaultChecked
            className="radio radio-sm radio-info"
          />
          All Formats
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input
            type="radio"
            name="format"
            className="radio radio-sm radio-info"
          />
          Physical
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input
            type="radio"
            name="format"
            className="radio radio-sm radio-info"
          />
          Digital
        </label>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="MINIMUM RATING">
        <div className="flex items-center gap-1 text-sm text-sky-600">
          ★★★☆☆
          <span className="ml-2 text-xs text-slate-600">1.0+</span>
        </div>

        <div className="flex justify-between px-1 text-[10px] text-slate-400">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </FilterSection>

      {/* Year */}
      <FilterSection title="YEAR PUBLISHED">
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600">
            2000
          </button>

          <span className="text-slate-400">-</span>

          <button className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600">
            2024
          </button>
        </div>
      </FilterSection>

      {/* Reset */}
      <div className="p-4 text-center">
        <button className="text-xs font-medium text-slate-500 hover:text-sky-600">
          Reset all filters
        </button>
      </div>
    </aside>
  );
}

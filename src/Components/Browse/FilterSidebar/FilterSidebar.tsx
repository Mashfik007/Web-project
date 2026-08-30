"use client";

import Image from "next/image";
import filterIcon from "@svg/filter.svg";
import FilterSection from "@/Components/Browse/FilterSection/FilterSection";

const genres = [
  "Fiction",
  "Mystery",
  "Sci-Fi",
  "Romance",
  "Fantasy",
  "Non-Fiction",
  "Literary",
];

export type AvailabilityFilter = "All" | "Available" | "On Loan";
export type FormatFilter = "All" | "Physical" | "Digital";

export type BrowseFilters = {
  genres: string[];
  availability: AvailabilityFilter;
  format: FormatFilter;
  minRating: number;
  yearFrom: number;
  yearTo: number;
};

export const defaultBrowseFilters: BrowseFilters = {
  genres: [],
  availability: "All",
  format: "All",
  minRating: 1,
  yearFrom: 2000,
  yearTo: 2024,
};

interface FilterSidebarProps {
  filters: BrowseFilters;
  onChange: (filters: BrowseFilters) => void;
}

export default function FilterSidebar({
  filters,
  onChange,
}: FilterSidebarProps) {
  const toggleGenre = (genre: string) => {
    const selected = filters.genres.includes(genre)
      ? filters.genres.filter((item) => item !== genre)
      : [...filters.genres, genre];

    onChange({ ...filters, genres: selected });
  };

  return (
    <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Filter header */}
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
        <Image
          src={filterIcon}
          alt="Filter"
          width={16}
          height={16}
          className="size-4 text-sky-600"
        />

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
              checked={filters.genres.includes(genre)}
              onChange={() => toggleGenre(genre)}
              className="checkbox checkbox-sm checkbox-info"
            />

            {genre}
          </label>
        ))}
      </FilterSection>

      {/* Availability */}
      <FilterSection title="AVAILABILITY">
        {(["All", "Available", "On Loan"] as AvailabilityFilter[]).map(
          (option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
            >
              <input
                type="radio"
                name="availability"
                checked={filters.availability === option}
                onChange={() => onChange({ ...filters, availability: option })}
                className="radio radio-sm radio-info"
              />
              {option}
            </label>
          ),
        )}
      </FilterSection>

      {/* Format */}
      <FilterSection title="FORMAT">
        {(["All", "Physical", "Digital"] as FormatFilter[]).map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
          >
            <input
              type="radio"
              name="format"
              checked={filters.format === option}
              onChange={() => onChange({ ...filters, format: option })}
              className="radio radio-sm radio-info"
            />
            {option === "All" ? "All Formats" : option}
          </label>
        ))}
      </FilterSection>

      {/* Rating */}
      <FilterSection title="MINIMUM RATING">
        <div className="flex items-center gap-1 text-sm text-sky-600">
          {"★".repeat(Math.round(filters.minRating))}
          {"☆".repeat(5 - Math.round(filters.minRating))}
          <span className="ml-2 text-xs text-slate-600">
            {filters.minRating.toFixed(1)}+
          </span>
        </div>

        <input
          type="range"
          min={1}
          max={5}
          step={0.5}
          value={filters.minRating}
          onChange={(event) =>
            onChange({ ...filters, minRating: Number(event.target.value) })
          }
          className="range range-xs range-info"
        />

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
          <input
            type="number"
            min={1900}
            max={filters.yearTo}
            value={filters.yearFrom}
            onChange={(event) =>
              onChange({ ...filters, yearFrom: Number(event.target.value) })
            }
            className="input input-sm w-20"
          />

          <span className="text-slate-400">-</span>

          <input
            type="number"
            min={filters.yearFrom}
            max={2026}
            value={filters.yearTo}
            onChange={(event) =>
              onChange({ ...filters, yearTo: Number(event.target.value) })
            }
            className="input input-sm w-20"
          />
        </div>
      </FilterSection>

      {/* Reset */}
      <div className="p-4 text-center">
        <button
          type="button"
          onClick={() => onChange(defaultBrowseFilters)}
          className="btn btn-ghost btn-xs"
        >
          Reset all filters
        </button>
      </div>
    </aside>
  );
}

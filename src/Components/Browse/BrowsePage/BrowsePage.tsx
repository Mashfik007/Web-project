"use client";

import { useMemo, useState } from "react";
import BookGrid from "@/Components/Browse/BookGrid/BookGrid";
import BrowseToolbar from "@/Components/Browse/BrowseToolbar/BrowseToolbar";
import FilterSidebar, {
  defaultBrowseFilters,
  type BrowseFilters,
} from "@/Components/Browse/FilterSidebar/FilterSidebar";
import type { BrowsePageData } from "@/types/browse";
import type { Book } from "@/types/book";

interface BrowsePageProps {
  browse: BrowsePageData;
}

function matchesFilters(book: Book, filters: BrowseFilters) {
  const formatMatches =
    filters.format === "All" ||
    (filters.format === "Physical" && book.format === "PHYSICAL") ||
    (filters.format === "Digital" && book.format === "DIGITAL");

  return (
    (filters.genres.length === 0 || filters.genres.includes(book.genre)) &&
    (filters.availability === "All" ||
      book.availability === filters.availability) &&
    formatMatches &&
    book.rating >= filters.minRating &&
    book.year >= filters.yearFrom &&
    book.year <= filters.yearTo
  );
}

function sortBooks(list: Book[], sort: string) {
  const next = [...list];

  switch (sort) {
    case "Highest Rated":
      return next.sort((a, b) => b.rating - a.rating);
    case "Newest First":
      return next.sort((a, b) => b.year - a.year);
    case "Oldest First":
      return next.sort((a, b) => a.year - b.year);
    case "Title A-Z":
      return next.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return next;
  }
}

export default function BrowsePage({ browse }: BrowsePageProps) {
  const [filters, setFilters] = useState(defaultBrowseFilters);
  const [sort, setSort] = useState("Most Relevant");

  const visibleBooks = useMemo(
    () =>
      sortBooks(
        browse.books.filter((book) => matchesFilters(book, filters)),
        sort,
      ),
    [browse.books, filters, sort],
  );

  return (
    <main className="min-h-screen w-full bg-slate-50 p-4 md:p-6">
      <h1 className="font-serif text-3xl font-bold text-slate-800">
        {browse.title}
      </h1>

      <p className="mt-1 text-sm text-slate-500">{browse.subtitle}</p>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <FilterSidebar filters={filters} onChange={setFilters} />

        <section className="min-w-0">
          <BrowseToolbar
            total={visibleBooks.length}
            sort={sort}
            onSortChange={setSort}
          />

          <div className="mt-5">
            <BookGrid books={visibleBooks} userId={browse.userId} />
          </div>

          <p className="mt-8 text-center text-xs text-slate-500">
            Showing {visibleBooks.length} of {browse.books.length} results
          </p>
        </section>
      </div>
    </main>
  );
}

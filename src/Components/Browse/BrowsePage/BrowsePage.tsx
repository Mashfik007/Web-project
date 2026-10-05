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

function matchesQuery(book: Book, query: string) {
  const term = query.trim().toLowerCase();
  if (!term) return true;

  return (
    book.title.toLowerCase().includes(term) ||
    book.author.toLowerCase().includes(term) ||
    book.category.toLowerCase().includes(term)
  );
}

function matchesFilters(book: Book, filters: BrowseFilters, query: string) {
  const formatMatches =
    filters.format === "All" ||
    (filters.format === "Physical" && book.format === "PHYSICAL") ||
    (filters.format === "Digital" && book.format === "DIGITAL");

  return (
    matchesQuery(book, query) &&
    (filters.categories.length === 0 ||
      filters.categories.includes(book.category)) &&
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

function catalogFilters(books: Book[]): BrowseFilters {
  const years = books
    .map((book) => book.year)
    .filter((year) => Number.isFinite(year));

  return {
    ...defaultBrowseFilters,
    yearFrom: years.length > 0 ? Math.min(...years) : 0,
    yearTo:
      years.length > 0 ? Math.max(...years) : new Date().getFullYear(),
  };
}

export default function BrowsePage({ browse }: BrowsePageProps) {
  const defaults = useMemo(
    () => catalogFilters(browse.books),
    [browse.books],
  );
  const categories = useMemo(
    () =>
      [
        ...new Set(browse.books.map((book) => book.category).filter(Boolean)),
      ].sort((a, b) => a.localeCompare(b)),
    [browse.books],
  );
  const [filters, setFilters] = useState(defaults);
  const [sort, setSort] = useState("Most Relevant");
  const [query, setQuery] = useState("");

  const visibleBooks = useMemo(
    () =>
      sortBooks(
        browse.books.filter((book) => matchesFilters(book, filters, query)),
        sort,
      ),
    [browse.books, filters, query, sort],
  );

  return (
    <main className="min-h-screen w-full bg-slate-50 p-4 md:p-6">
      <h1 className="font-serif text-3xl font-bold text-slate-800">
        {browse.title}
      </h1>

      <p className="mt-1 text-sm text-slate-500">{browse.subtitle}</p>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <FilterSidebar
          filters={filters}
          categories={categories}
          defaults={defaults}
          onChange={setFilters}
        />

        <section className="min-w-0">
          <BrowseToolbar
            total={visibleBooks.length}
            sort={sort}
            query={query}
            onSortChange={setSort}
            onQueryChange={setQuery}
          />

          <div className="mt-5">
            {visibleBooks.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500">
                {query.trim()
                  ? `No books match “${query.trim()}”.`
                  : "No books match the selected filters."}
              </p>
            ) : (
              <BookGrid books={visibleBooks} userId={browse.userId} />
            )}
          </div>

          <p className="mt-8 text-center text-xs text-slate-500">
            Showing {visibleBooks.length} of {browse.books.length} results
            {query.trim() ? ` for “${query.trim()}”` : ""}
          </p>
        </section>
      </div>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import BookGrid from "@/Components/user.BookGrid";
import BrowseToolbar from "@/Components/user.BrowseToolbar";
import FilterSidebar, {
  defaultBrowseFilters,
  type BrowseFilters,
} from "@/Components/user.FilterSiderBar";
import type { Book } from "@/types/book";

const books: Book[] = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    rating: 4.8,
    year: 2020,
    format: "PHYSICAL",
    availability: "On Loan",
    genre: "Fiction",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    rating: 4.6,
    year: 2021,
    format: "DIGITAL",
    availability: "Available",
    genre: "Sci-Fi",
    image:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "The Vanishing Half",
    author: "Brit Bennett",
    rating: 4.7,
    year: 2020,
    format: "PHYSICAL",
    availability: "Available",
    genre: "Literary",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    title: "Piranesi",
    author: "Susanna Clarke",
    rating: 4.9,
    year: 2020,
    format: "PHYSICAL",
    availability: "On Loan",
    genre: "Fantasy",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    title: "Project Hail Mary",
    author: "Andy Weir",
    rating: 4.8,
    year: 2021,
    format: "DIGITAL",
    availability: "Available",
    genre: "Sci-Fi",
    image:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    title: "Demon Copperhead",
    author: "Barbara Kingsolver",
    rating: 4.5,
    year: 2022,
    format: "PHYSICAL",
    availability: "Available",
    genre: "Literary",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    title: "The Paris Apartment",
    author: "Lucy Foley",
    rating: 4.3,
    year: 2022,
    format: "PHYSICAL",
    availability: "On Loan",
    genre: "Mystery",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 8,
    title: "Orbital",
    author: "Samantha Harvey",
    rating: 4.7,
    year: 2023,
    format: "DIGITAL",
    availability: "Available",
    genre: "Literary",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 9,
    title: "The Atlas Six",
    author: "Olivie Blake",
    rating: 4.4,
    year: 2022,
    format: "PHYSICAL",
    availability: "Available",
    genre: "Fantasy",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 10,
    title: "Lessons in Chemistry",
    author: "Bonnie Garmus",
    rating: 4.6,
    year: 2022,
    format: "DIGITAL",
    availability: "On Loan",
    genre: "Fiction",
    image:
      "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 11,
    title: "Crying in H Mart",
    author: "Michelle Zauner",
    rating: 4.5,
    year: 2021,
    format: "PHYSICAL",
    availability: "Available",
    genre: "Non-Fiction",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 12,
    title: "In the Woods",
    author: "Tana French",
    rating: 4.4,
    year: 2007,
    format: "PHYSICAL",
    availability: "Available",
    genre: "Mystery",
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
  },
];

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

export default function Page() {
  const [filters, setFilters] = useState(defaultBrowseFilters);
  const [sort, setSort] = useState("Most Relevant");

  const visibleBooks = useMemo(
    () => sortBooks(books.filter((book) => matchesFilters(book, filters)), sort),
    [filters, sort],
  );

  return (
    <main className="min-h-screen w-full bg-slate-50 p-4 md:p-6">
      <h1 className="font-serif text-3xl font-bold text-slate-800">
        Browse Collection
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        24,817 books across all genres and branches
      </p>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <FilterSidebar filters={filters} onChange={setFilters} />

        <section className="min-w-0">
          <BrowseToolbar
            total={visibleBooks.length}
            sort={sort}
            onSortChange={setSort}
          />

          <div className="mt-5">
            <BookGrid books={visibleBooks} />
          </div>

          <p className="mt-8 text-center text-xs text-slate-500">
            Showing {visibleBooks.length} of {books.length} results
          </p>
        </section>
      </div>
    </main>
  );
}

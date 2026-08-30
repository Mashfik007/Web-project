import type { BrowsePageData } from "@/types/browse";
import type { Book } from "@/types/book";

export const browseBooks: Book[] = [
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

const TOTAL_CATALOG_COUNT = 24817;

export async function getBrowseBooksData(
  userId: string,
): Promise<BrowsePageData> {
  return {
    userId,
    title: "Browse Collection",
    subtitle: `${TOTAL_CATALOG_COUNT.toLocaleString()} books across all genres and branches`,
    totalCatalogCount: TOTAL_CATALOG_COUNT,
    books: browseBooks,
  };
}

export function getBrowseBookById(bookId: string | number) {
  const id = Number(bookId);
  return browseBooks.find((book) => book.id === id);
}

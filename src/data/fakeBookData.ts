import { getBrowseBookById } from "@/data/fakeBrowseData";
import type { BookDetails } from "@/types/bookDetails";
import type { Book } from "@/types/book";

export const fakeBookData: BookDetails = {
  id: 1,
  title: "The Midnight Library",
  author: "Matt Haig",
  coverImage:
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
  tags: ["Fiction", "2020", "288 pages"],
  rating: {
    score: 4.8,
    totalRatings: 1836,
    totalReviews: 581,
  },
  description:
    "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. Nora Seed finds herself faced with this decision. Faced with the possibility of changing her life for a new one, following a different career, undoing old breakups, realizing her dreams of becoming a glaciologist — she must search within herself as she travels through the Midnight Library to decide what is truly fulfilling in life, and what makes it worth living in the first place.",
  price: {
    amount: 350,
    currency: "৳",
  },
  availability: {
    current: 2,
    total: 4,
  },
  metadata: {
    publisher: "Canongate Books",
    language: "English",
    series: "Standalone",
    isbn: "978-1-78689-274-4",
    published: 2020,
    copiesHeld: "4 copies across 3 branches",
    pages: 288,
    category: "Fiction",
    deweyDecimal: "823.14",
  },
  community: {
    totalOnShelf: 7,
    members: [
      { id: "1", name: "Elena V.", initials: "EV", color: "bg-sky-500" },
      { id: "2", name: "Marcus C.", initials: "MC", color: "bg-violet-500" },
      { id: "3", name: "Priya N.", initials: "PN", color: "bg-emerald-500" },
      { id: "4", name: "James T.", initials: "JT", color: "bg-amber-500" },
      { id: "5", name: "Sofia R.", initials: "SR", color: "bg-rose-500" },
      { id: "6", name: "David K.", initials: "DK", color: "bg-indigo-500" },
      { id: "7", name: "Amira H.", initials: "AH", color: "bg-teal-500" },
    ],
  },
  matchScore: {
    score: 87,
    maxScore: 100,
    label: "Strong Match",
    description:
      "You tend to enjoy introspective fiction with hopeful themes and parallel-life narratives.",
  },
};

function buildBookDetailsFromCatalog(catalogBook: Book): BookDetails {
  const id = Number(catalogBook.id);
  const pages = 280 + (id % 120);

  return {
    id,
    title: catalogBook.title,
    author: catalogBook.author,
    coverImage: catalogBook.image,
    tags: [catalogBook.category, String(catalogBook.year), `${pages} pages`],
    rating: {
      score: catalogBook.rating,
      totalRatings: 500 + id * 137,
      totalReviews: 120 + id * 41,
    },
    description: `Discover ${catalogBook.title} by ${catalogBook.author}, a ${catalogBook.category.toLowerCase()} title from ${catalogBook.year}. Borrow it today from your local branch or add it to your shelf.`,
    price: {
      amount: 300 + (id % 5) * 50,
      currency: "৳",
    },
    availability: {
      current: catalogBook.availability === "Available" ? 3 : 1,
      total: 4,
    },
    metadata: {
      publisher: "Library Press",
      language: "English",
      series: "Standalone",
      isbn: `978-1-78689-${2740 + id}`,
      published: catalogBook.year,
      copiesHeld: "4 copies across 3 branches",
      pages,
      category: catalogBook.category,
      deweyDecimal: "823.14",
    },
    community: fakeBookData.community,
    matchScore: {
      score: 70 + (id % 25),
      maxScore: 100,
      label: "Good Match",
      description: `Based on your interest in ${catalogBook.category.toLowerCase()} books.`,
    },
  };
}

export async function getBookDetailsData(
  userId: string,
  bookId: string,
): Promise<{
  book: BookDetails;
  backHref: string;
  checkoutHref: string;
} | null> {
  const catalogBook = getBrowseBookById(bookId);

  if (!catalogBook) {
    return null;
  }

  const book =
    Number(catalogBook.id) === fakeBookData.id
      ? fakeBookData
      : buildBookDetailsFromCatalog(catalogBook);

  return {
    book: { ...book, id: Number(catalogBook.id) },
    backHref: `/user/${userId}/browsebook`,
    checkoutHref: `/user/${userId}/checkout/${bookId}`,
  };
}

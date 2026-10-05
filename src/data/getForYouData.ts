import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import type {
  BorrowingHabitCategory,
  ExploreCategory,
  ForYouData,
  RecommendedBook,
} from "@/types/forYou";

type StoredBook = {
  _id: { toString(): string };
  title: string;
  author: string;
  coverImage?: string;
  createdAt?: Date;
  rating?: {
    score?: number;
  };
  metadata?: {
    category?: string;
  };
  matchScore?: {
    score?: number;
    maxScore?: number;
  };
};

const palette = [
  { color: "#0ea5e9", backgroundColor: "#e0f2fe" },
  { color: "#8b5cf6", backgroundColor: "#ede9fe" },
  { color: "#f43f5e", backgroundColor: "#ffe4e6" },
  { color: "#f59e0b", backgroundColor: "#fef3c7" },
  { color: "#10b981", backgroundColor: "#d1fae5" },
  { color: "#ec4899", backgroundColor: "#fce7f3" },
  { color: "#14b8a6", backgroundColor: "#ccfbf1" },
];

function colorAt(index: number) {
  return palette[index % palette.length];
}

function matchPercent(book: StoredBook) {
  const score = book.matchScore?.score ?? 0;
  const maxScore = book.matchScore?.maxScore ?? 0;
  if (maxScore > 0) {
    return Math.min(100, Math.round((score / maxScore) * 100));
  }

  const rating = book.rating?.score ?? 0;
  return Math.min(100, Math.round((rating / 5) * 100));
}

function toRecommendedBook(book: StoredBook, isNew = false): RecommendedBook {
  const category = book.metadata?.category?.trim() || "General";

  return {
    id: book._id.toString(),
    title: book.title,
    author: book.author,
    coverImage: book.coverImage
      ? `/api/uploads/${book.coverImage}`
      : "/svg/book.svg",
    rating: book.rating?.score ?? 0,
    matchPercent: matchPercent(book),
    category,
    isNew,
  };
}

export async function getForYouData(userId: string): Promise<ForYouData> {
  await connectDB();

  const records = await Book.find()
    .sort({ createdAt: -1 })
    .lean<StoredBook[]>();
  const newestCutoff = Date.now() - 7 * 86400000;
  const books = records.map((book) =>
    toRecommendedBook(
      book,
      book.createdAt ? new Date(book.createdAt).getTime() >= newestCutoff : false,
    ),
  );

  const counts = new Map<string, number>();
  for (const book of books) {
    const category = book.category ?? "General";
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const total = books.length || 1;
  const habits: BorrowingHabitCategory[] = ranked.map(
    ([category, count], index) => ({
      category,
      count,
      percentage: Math.round((count / total) * 100),
      color: colorAt(index).color,
    }),
  );
  const top = habits.slice(0, 2);
  const topNames = new Set(top.map((item) => item.category));
  const inTopCategories = books.filter((book) =>
    topNames.has(book.category ?? ""),
  );
  const outside = books.filter((book) => !topNames.has(book.category ?? ""));
  const perfectMix = (inTopCategories.length > 0 ? inTopCategories : books).slice(
    0,
    4,
  );
  const used = new Set(perfectMix.map((book) => book.id));
  const somethingNew = (outside.length > 0 ? outside : books)
    .filter((book) => !used.has(book.id))
    .slice(0, 4);

  const left = top[0]?.category ?? "Fiction";
  const right = top[1]?.category ?? left;

  const exploreCategories: ExploreCategory[] = ranked.map(
    ([category], index) => ({
      id: category.toLowerCase().replace(/\s+/g, "-"),
      label: category,
      color: colorAt(index).color,
      backgroundColor: colorAt(index).backgroundColor,
    }),
  );

  return {
    header: {
      label: "CURATED FOR YOU",
      title: "Your",
      titleAccent: "Personalized Remix.",
      description: `Based on ${books.length} books in the catalog. These picks come from the titles stored in the library.`,
      topCategories: top.map((item, index) => ({
        rank: index + 1,
        category: item.category,
        percentage: item.percentage,
        color: item.color,
      })),
    },
    borrowingHabits: {
      totalBooks: books.length,
      months: 12,
      categoryCount: ranked.length,
      categories: habits,
    },
    sections: [
      {
        id: "perfect-mix",
        title: "Perfect Mix",
        description:
          top.length > 1
            ? `Books from ${left} and ${right} — the largest categories in the catalog`
            : `Books from ${left}`,
        highlightCategories: top.map((item) => item.category),
        badge: "From the catalog",
        iconTheme: "blue",
        books: perfectMix,
      },
      {
        id: "try-something-new",
        title: "Try Something New",
        description: "More titles from the library, outside the top categories",
        iconTheme: "orange",
        books: somethingNew,
      },
    ],
    exploreCategories,
    catalogHref: `/user/${userId}/browsebook`,
  };
}

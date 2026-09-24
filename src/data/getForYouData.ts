import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import type {
  BorrowingHabitGenre,
  ExploreGenre,
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
    genre?: string;
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
  const genre = book.metadata?.genre?.trim() || "General";

  return {
    id: book._id.toString(),
    title: book.title,
    author: book.author,
    coverImage: book.coverImage
      ? `/api/uploads/${book.coverImage}`
      : "/svg/book.svg",
    rating: book.rating?.score ?? 0,
    matchPercent: matchPercent(book),
    genre,
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
    const genre = book.genre ?? "General";
    counts.set(genre, (counts.get(genre) ?? 0) + 1);
  }

  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const total = books.length || 1;
  const habits: BorrowingHabitGenre[] = ranked.map(([genre, count], index) => ({
    genre,
    count,
    percentage: Math.round((count / total) * 100),
    color: colorAt(index).color,
  }));
  const top = habits.slice(0, 2);
  const topNames = new Set(top.map((genre) => genre.genre));
  const inTopGenres = books.filter((book) => topNames.has(book.genre ?? ""));
  const outside = books.filter((book) => !topNames.has(book.genre ?? ""));
  const perfectMix = (inTopGenres.length > 0 ? inTopGenres : books).slice(0, 4);
  const used = new Set(perfectMix.map((book) => book.id));
  const somethingNew = (outside.length > 0 ? outside : books)
    .filter((book) => !used.has(book.id))
    .slice(0, 4);

  const left = top[0]?.genre ?? "Fiction";
  const right = top[1]?.genre ?? left;
  const leftCount = top[0]?.count ?? 0;
  const rightCount = top[1]?.count ?? 0;
  const blend =
    leftCount + rightCount === 0
      ? 50
      : Math.round((leftCount / (leftCount + rightCount)) * 100);

  const exploreGenres: ExploreGenre[] = ranked.map(([genre], index) => ({
    id: genre.toLowerCase().replace(/\s+/g, "-"),
    label: genre,
    color: colorAt(index).color,
    backgroundColor: colorAt(index).backgroundColor,
  }));

  return {
    header: {
      label: "CURATED FOR YOU",
      title: "Your",
      titleAccent: "Personalized Remix.",
      description: `Based on ${books.length} books in the catalog. These picks come from the titles stored in the library.`,
      topGenres: top.map((genre, index) => ({
        rank: index + 1,
        genre: genre.genre,
        percentage: genre.percentage,
        color: genre.color,
      })),
    },
    borrowingHabits: {
      totalBooks: books.length,
      months: 12,
      genreCount: ranked.length,
      genres: habits,
      blendSlider: {
        leftLabel: left,
        rightLabel: right,
        value: blend,
        balanceLabel: left === right ? left : "Catalog mix",
        hint: "Shares follow the genres on the books in the library.",
      },
    },
    sections: [
      {
        id: "perfect-mix",
        title: "Perfect Mix",
        description:
          top.length > 1
            ? `Books from ${left} and ${right} — the largest genres in the catalog`
            : `Books from ${left}`,
        highlightGenres: top.map((genre) => genre.genre),
        badge: "From the catalog",
        iconTheme: "blue",
        books: perfectMix,
      },
      {
        id: "try-something-new",
        title: "Try Something New",
        description: "More titles from the library, outside the top genres",
        iconTheme: "orange",
        books: somethingNew,
      },
    ],
    exploreGenres,
    catalogHref: `/user/${userId}/browsebook`,
  };
}

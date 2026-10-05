import connectDB from "@/dbConfig/dbConfig";
import { suggestBlindDateBook } from "@/Helper/suggestBlindDateBook";
import { publishShelfUpdate } from "@/Helper/publishDomain";
import { requireUserId } from "@/Helper/userFromToken";
import { Book } from "@/Model/Books";
import { ShelfLoan } from "@/Model/ShelfLoans";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";

const moods = new Set([
  "Curious",
  "Cozy",
  "Dark",
  "Hopeful",
  "Adventurous",
]);

const lengths = new Set(["Short read", "Standard", "Epic"]);

const moodHints: Record<string, string[]> = {
  Curious: ["mystery", "science", "discovery", "history", "non-fiction"],
  Cozy: ["romance", "fiction", "slice", "family", "feel"],
  Dark: ["thriller", "horror", "crime", "suspense", "gothic"],
  Hopeful: ["fiction", "inspiration", "self", "memoir", "young"],
  Adventurous: ["adventure", "fantasy", "action", "epic", "quest"],
};

function pagesForLength(length: string) {
  if (length === "Short read") return { min: 1, max: 250 };
  if (length === "Epic") return { min: 451, max: 100000 };
  return { min: 200, max: 450 };
}

type CandidateBook = {
  _id: { toString(): string };
  title?: string;
  author?: string;
  description?: string;
  tags?: string[];
  metadata?: { category?: string; pages?: number };
};

function scoreBook(book: CandidateBook, mood: string) {
  const hints = moodHints[mood] ?? [];
  const haystack = [
    book.title,
    book.description,
    book.metadata?.category,
    ...(book.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return hints.reduce(
    (score, hint) => (haystack.includes(hint) ? score + 1 : score),
    0,
  );
}

function fallbackPick(books: CandidateBook[], mood: string) {
  const ranked = [...books].sort(
    (left, right) => scoreBook(right, mood) - scoreBook(left, mood),
  );
  const topScore = scoreBook(ranked[0], mood);
  const pool = ranked.filter((book) => scoreBook(book, mood) === topScore);
  return pool[Math.floor(Math.random() * pool.length)];
}

async function wrapBlindDate(userId: string, bookId: string) {
  const existing = await ShelfLoan.findOne({ userId, bookId });
  if (existing?.status === "reading") {
    return {
      ok: false as const,
      error: "This book is already on your shelf",
    };
  }

  if (existing) {
    existing.status = "wishlist";
    existing.blindDate = true;
    existing.currentPage = existing.currentPage ?? 0;
    await existing.save();
  } else {
    await ShelfLoan.create({
      userId,
      bookId,
      status: "wishlist",
      currentPage: 0,
      dueDate: null,
      blindDate: true,
    });
  }

  await publishShelfUpdate({
    action: "wishlist",
    userId: String(userId),
    bookId,
  });

  return { ok: true as const };
}

export async function POST(request: Request) {
  try {
    const session = await requireUserId();
    if (session instanceof Response) return session;
    const userId = session;

    const body = await request.json();
    const mood = String(body.mood ?? "").trim();
    const length = String(body.length ?? "").trim();

    if (!moods.has(mood) || !lengths.has(length)) {
      return new Response(
        JSON.stringify(new ApiError(400, "Choose a mood and length")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    await connectDB();

    const loans = await ShelfLoan.find({ userId })
      .select("bookId status")
      .lean<{ bookId: string; status: string }[]>();
    const blockedIds = new Set(
      loans
        .filter((loan) => loan.status === "reading" || loan.status === "wishlist")
        .map((loan) => loan.bookId),
    );
    const historyIds = loans.map((loan) => loan.bookId);

    const pageRange = pagesForLength(length);
    const candidates = await Book.find({
      "availability.current": { $gt: 0 },
      "metadata.pages": { $gte: pageRange.min, $lte: pageRange.max },
    })
      .select("title author description tags metadata availability")
      .lean<CandidateBook[]>();

    const available = candidates.filter(
      (book) => !blockedIds.has(book._id.toString()),
    );

    if (available.length === 0) {
      return new Response(
        JSON.stringify(
          new ApiError(
            404,
            "No matching available books right now. Try another mood or length.",
          ),
        ),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const historyBooks =
      historyIds.length > 0
        ? await Book.find({ _id: { $in: historyIds } })
            .select("metadata.category tags")
            .lean<{ metadata?: { category?: string }; tags?: string[] }[]>()
        : [];

    const taste = [
      ...new Set(
        historyBooks.flatMap((book) => [
          book.metadata?.category?.trim() || "",
          ...(book.tags ?? []).map((tag) => tag.trim()),
        ]),
      ),
    ].filter(Boolean);

    const byId = new Map(
      available.map((book) => [book._id.toString(), book] as const),
    );
    const aiCandidates = available
      .map((book) => ({
        id: book._id.toString(),
        title: book.title || "Untitled",
        author: book.author || "Unknown",
        category: book.metadata?.category || "General",
        pages: book.metadata?.pages || 0,
        tags: book.tags ?? [],
        description: book.description || "",
        moodScore: scoreBook(book, mood),
      }))
      .sort((left, right) => right.moodScore - left.moodScore)
      .map(({ moodScore: _moodScore, ...book }) => book);

    const suggestion = await suggestBlindDateBook({
      mood,
      length,
      candidates: aiCandidates,
      taste,
    });

    let pick =
      suggestion.ok ? byId.get(suggestion.pick.bookId) ?? null : null;
    let reason = suggestion.ok ? suggestion.pick.reason : "";
    let usedAi = Boolean(pick);

    if (!pick) {
      pick = fallbackPick(available, mood);
      reason =
        "Matched from your library catalog using mood and length (AI unavailable).";
      usedAi = false;
    }

    const bookId = pick._id.toString();
    const wrapped = await wrapBlindDate(userId, bookId);
    if (!wrapped.ok) {
      return new Response(JSON.stringify(new ApiError(400, wrapped.error)), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify(
        new ApiResponce(
          201,
          {
            bookId,
            category: pick.metadata?.category ?? "General",
            usedAi,
            reason,
          },
          usedAi
            ? `AI wrapped a surprise pick for your shelf. ${reason}`
            : "Wrapped and added to Want to Read on your shelf",
        ),
      ),
      { status: 201, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(new ApiError(500, error.message || "Internal Server Error")),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

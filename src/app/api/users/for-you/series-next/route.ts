import connectDB from "@/dbConfig/dbConfig";
import { suggestSeriesNextBook } from "@/Helper/suggestSeriesNextBook";
import { requireUserId } from "@/Helper/userFromToken";
import { Book } from "@/Model/Books";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function volumeFromTitle(title: string) {
  const match =
    title.match(/\b(?:vol(?:ume)?|book|#)\s*(\d+)\b/i) ||
    title.match(/(?:^|\s)(\d+)$/);
  return match ? Number(match[1]) : null;
}

type SeriesBook = {
  _id: { toString(): string };
  title: string;
  author: string;
  coverImage?: string;
  availability?: { current?: number; total?: number };
  metadata?: {
    series?: string;
    published?: number;
    pages?: number;
    category?: string;
  };
};

function isStandalone(series?: string) {
  return /^standalone$/i.test(series?.trim() || "");
}

function withVolume(books: SeriesBook[]) {
  const sorted = [...books].sort((left, right) => {
    const leftVol = volumeFromTitle(left.title);
    const rightVol = volumeFromTitle(right.title);
    if (leftVol != null && rightVol != null && leftVol !== rightVol) {
      return leftVol - rightVol;
    }
    const leftYear = left.metadata?.published ?? 0;
    const rightYear = right.metadata?.published ?? 0;
    if (leftYear !== rightYear) return leftYear - rightYear;
    return left.title.localeCompare(right.title);
  });

  return sorted.map((book, index) => ({
    book,
    volume: volumeFromTitle(book.title) ?? index + 1,
  }));
}

function toPayload(
  book: SeriesBook,
  volume: number,
  seriesFallback: string,
  usedAi: boolean,
  reason?: string,
) {
  const available = (book.availability?.current ?? 0) > 0;
  return {
    bookId: book._id.toString(),
    title: book.title,
    author: book.author,
    series: book.metadata?.series || seriesFallback,
    volume,
    available,
    availability: {
      current: book.availability?.current ?? 0,
      total: book.availability?.total ?? 0,
    },
    coverImage: book.coverImage
      ? `/api/uploads/${book.coverImage}`
      : "/svg/book.svg",
    usedAi,
    reason: reason || "",
  };
}

async function loadCandidates(series: string) {
  const exact = await Book.find({
    "metadata.series": {
      $regex: `^${escapeRegex(series)}$`,
      $options: "i",
    },
  })
    .select("title author coverImage availability metadata")
    .lean<SeriesBook[]>();

  const exactSeries = exact.filter(
    (book) => !isStandalone(book.metadata?.series),
  );
  if (exactSeries.length > 0) return exactSeries;

  const words = series
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 1);

  const fuzzy = await Book.find({
    $or: [
      {
        "metadata.series": {
          $regex: escapeRegex(series),
          $options: "i",
        },
      },
      { title: { $regex: escapeRegex(series), $options: "i" } },
      ...words.flatMap((word) => [
        {
          "metadata.series": {
            $regex: escapeRegex(word),
            $options: "i",
          },
        },
        { title: { $regex: escapeRegex(word), $options: "i" } },
      ]),
    ],
  })
    .select("title author coverImage availability metadata")
    .limit(80)
    .lean<SeriesBook[]>();

  const filtered = fuzzy.filter((book) => !isStandalone(book.metadata?.series));
  if (filtered.length > 0) return filtered;

  return Book.find({
    "metadata.series": { $exists: true, $nin: ["", "Standalone", "standalone"] },
  })
    .select("title author coverImage availability metadata")
    .limit(80)
    .lean<SeriesBook[]>();
}

function fallbackNext(books: SeriesBook[], series: string, lastVolume: number) {
  const ordered = withVolume(books);
  const nextVolume = lastVolume + 1;
  return (
    ordered.find((item) => item.volume === nextVolume) ??
    ordered.find((item) => item.volume > lastVolume) ??
    null
  );
}

export async function POST(request: Request) {
  try {
    const session = await requireUserId();
    if (session instanceof Response) return session;

    const body = await request.json();
    const series = String(body.series ?? "").trim();
    const lastVolume = Number(body.volume ?? 1);

    if (!series) {
      return new Response(
        JSON.stringify(new ApiError(400, "Enter a series name")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!Number.isInteger(lastVolume) || lastVolume < 0) {
      return new Response(
        JSON.stringify(new ApiError(400, "Enter a valid last volume number")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    await connectDB();
    const candidates = await loadCandidates(series);

    if (candidates.length === 0) {
      return new Response(
        JSON.stringify(
          new ApiError(
            404,
            `No series books found for "${series}" in your catalog.`,
          ),
        ),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const byId = new Map(
      candidates.map((book) => [book._id.toString(), book] as const),
    );

    const suggestion = await suggestSeriesNextBook({
      series,
      lastVolume,
      candidates: candidates.map((book) => ({
        id: book._id.toString(),
        title: book.title,
        author: book.author,
        series: book.metadata?.series || "",
        published: book.metadata?.published || 0,
        available: book.availability?.current ?? 0,
        total: book.availability?.total ?? 0,
      })),
    });

    let book: SeriesBook | null = null;
    let volume = lastVolume + 1;
    let usedAi = false;
    let reason = "";

    if (suggestion.ok && suggestion.pick.bookId) {
      const picked = byId.get(suggestion.pick.bookId) ?? null;
      if (picked && suggestion.pick.volume > lastVolume) {
        book = picked;
        volume = suggestion.pick.volume;
        usedAi = true;
        reason = suggestion.pick.reason;
      }
    }

    if (!book) {
      const fallback = fallbackNext(candidates, series, lastVolume);
      if (!fallback) {
        return new Response(
          JSON.stringify(
            new ApiError(
              404,
              suggestion.ok && suggestion.pick.reason
                ? suggestion.pick.reason
                : `No volume after ${lastVolume} was found for "${series}".`,
            ),
          ),
          { status: 404, headers: { "Content-Type": "application/json" } },
        );
      }
      book = fallback.book;
      volume = fallback.volume;
      reason =
        "Matched from your library catalog (AI unavailable or unsure).";
    }

    const payload = toPayload(book, volume, series, usedAi, reason);

    return new Response(
      JSON.stringify(
        new ApiResponce(
          200,
          payload,
          payload.available
            ? usedAi
              ? `AI found volume ${payload.volume}: ${payload.title}`
              : `Volume ${payload.volume} is available to reserve`
            : `Volume ${payload.volume} was found but is not available right now`,
        ),
      ),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(new ApiError(500, error.message || "Internal Server Error")),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

import { GoogleGenAI } from "@google/genai";

export type SeriesCandidate = {
  id: string;
  title: string;
  author: string;
  series: string;
  published: number;
  available: number;
  total: number;
};

const SYSTEM = `You are Folio's Series Navigator for a library app.
The user gives a series name (maybe misspelled or partial) and the last volume they read.
From the provided real catalog list, pick the NEXT unread volume after that number.
Reply with ONLY valid JSON:
{"bookId":"...","volume":2,"seriesName":"...","reason":"..."}.
bookId MUST be one of the ids from the list.
volume must be an integer greater than the last volume read.
seriesName is the catalog series label for that book.
reason max 160 characters, clear and helpful.
If nothing fits, reply: {"bookId":"","volume":0,"seriesName":"","reason":"why not found"}.
No markdown, no code fences, no extra keys.`;

function geminiApiKey() {
  return (
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.Gemini_API_Key?.trim() ||
    ""
  );
}

function parsePick(
  raw: string,
  allowedIds: Set<string>,
): {
  bookId: string;
  volume: number;
  seriesName: string;
  reason: string;
} | null {
  const text = raw.trim();
  if (!text) return null;

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? text).trim();

  try {
    const parsed = JSON.parse(candidate) as {
      bookId?: unknown;
      volume?: unknown;
      seriesName?: unknown;
      reason?: unknown;
    };
    const bookId = String(parsed.bookId ?? "").trim();
    const volume = Number(parsed.volume);
    const seriesName = String(parsed.seriesName ?? "").trim();
    const reason = String(parsed.reason ?? "").trim();

    if (!bookId) {
      return {
        bookId: "",
        volume: 0,
        seriesName,
        reason: reason || "No matching next volume in the catalog.",
      };
    }
    if (!allowedIds.has(bookId) || !Number.isInteger(volume) || volume < 1) {
      return null;
    }

    return {
      bookId,
      volume,
      seriesName: seriesName || "Series",
      reason: (reason || "Next volume found in your library catalog.").slice(
        0,
        160,
      ),
    };
  } catch {
    return null;
  }
}

export async function suggestSeriesNextBook(input: {
  series: string;
  lastVolume: number;
  candidates: SeriesCandidate[];
}) {
  const apiKey = geminiApiKey();
  if (!apiKey) {
    return { ok: false as const, error: "GEMINI_API_KEY is missing" };
  }

  if (input.candidates.length === 0) {
    return { ok: false as const, error: "No candidate books available" };
  }

  const shortlist = input.candidates.slice(0, 60).map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    series: book.series,
    published: book.published,
    available: book.available,
    total: book.total,
  }));
  const allowedIds = new Set(shortlist.map((book) => book.id));

  const prompt = [
    `Series query from reader: ${input.series}`,
    `Last volume read: ${input.lastVolume}`,
    "Find the next volume from this real catalog JSON:",
    JSON.stringify(shortlist),
  ].join("\n");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      system_instruction: SYSTEM,
      input: prompt,
    });

    const pick = parsePick(interaction.output_text ?? "", allowedIds);
    if (!pick) {
      return {
        ok: false as const,
        error: "AI returned an unreadable series match. Try again.",
      };
    }

    return { ok: true as const, pick };
  } catch (error: any) {
    return {
      ok: false as const,
      error: error?.message || "AI series search failed",
    };
  }
}

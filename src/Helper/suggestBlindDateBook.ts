import { GoogleGenAI } from "@google/genai";

export type BlindDateCandidate = {
  id: string;
  title: string;
  author: string;
  category: string;
  pages: number;
  tags: string[];
  description: string;
};

const SYSTEM = `You are Folio's Blind Date matcher for a library app.
You MUST pick exactly one book from the provided catalog list.
Reply with ONLY valid JSON: {"bookId":"...","reason":"..."}.
bookId must be one of the ids from the list.
reason max 160 characters, friendly, spoiler-free, do not reveal the title.
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
): { bookId: string; reason: string } | null {
  const text = raw.trim();
  if (!text) return null;

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? text).trim();

  try {
    const parsed = JSON.parse(candidate) as {
      bookId?: unknown;
      reason?: unknown;
    };
    const bookId = String(parsed.bookId ?? "").trim();
    const reason = String(parsed.reason ?? "").trim();
    if (!bookId || !allowedIds.has(bookId)) return null;
    return {
      bookId,
      reason: (reason || "A surprise match from the library catalog.").slice(
        0,
        160,
      ),
    };
  } catch {
    return null;
  }
}

export async function suggestBlindDateBook(input: {
  mood: string;
  length: string;
  candidates: BlindDateCandidate[];
  taste?: string[];
}) {
  const apiKey = geminiApiKey();
  if (!apiKey) {
    return { ok: false as const, error: "GEMINI_API_KEY is missing" };
  }

  if (input.candidates.length === 0) {
    return { ok: false as const, error: "No candidate books available" };
  }

  // Keep the prompt small enough for reliable responses.
  const shortlist = input.candidates.slice(0, 40).map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    category: book.category,
    pages: book.pages,
    tags: book.tags.slice(0, 6),
    blurb: book.description.slice(0, 180),
  }));

  const allowedIds = new Set(shortlist.map((book) => book.id));
  const taste =
    input.taste && input.taste.length > 0
      ? input.taste.slice(0, 8).join(", ")
      : "unknown";

  const prompt = [
    `Reader mood: ${input.mood}`,
    `Preferred length: ${input.length}`,
    `Reader taste signals from their shelf history: ${taste}`,
    "Pick the best surprise Blind Date book from this real catalog JSON:",
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
        error: "AI returned an unreadable book pick. Try again.",
      };
    }

    return { ok: true as const, pick };
  } catch (error: any) {
    return {
      ok: false as const,
      error: error?.message || "AI suggestion failed",
    };
  }
}

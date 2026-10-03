import { GoogleGenAI } from "@google/genai";

const SYSTEM = `You write library notifications for Folio, a library app.
Reply with ONLY valid JSON: {"title":"...","message":"..."}.
Title max 120 characters. Message max 2000 characters.
Tone: friendly, clear, professional. No markdown, no code fences, no extra keys.`;

function geminiApiKey() {
  return (
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.Gemini_API_Key?.trim() ||
    ""
  );
}

function parseDraft(raw: string): { title: string; message: string } | null {
  const text = raw.trim();
  if (!text) return null;

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? text).trim();

  try {
    const parsed = JSON.parse(candidate) as {
      title?: unknown;
      message?: unknown;
    };
    const title = String(parsed.title ?? "").trim();
    const message = String(parsed.message ?? "").trim();
    if (!title || !message) return null;
    return {
      title: title.slice(0, 120),
      message: message.slice(0, 2000),
    };
  } catch {
    return null;
  }
}

export async function draftNotificationEmail(prompt: string) {
  const apiKey = geminiApiKey();
  if (!apiKey) {
    return { ok: false as const, error: "GEMINI_API_KEY is missing" };
  }

  const ai = new GoogleGenAI({ apiKey });
  const interaction = await ai.interactions.create({
    model: "gemini-3.8-flash",
    system_instruction: SYSTEM,
    input: prompt,
  });

  const draft = parseDraft(interaction.output_text ?? "");
  if (!draft) {
    return {
      ok: false as const,
      error: "AI returned an unreadable draft. Try again.",
    };
  }

  return { ok: true as const, draft };
}

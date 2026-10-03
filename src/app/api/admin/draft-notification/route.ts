import { draftNotificationEmail } from "@/Helper/draftNotificationEmail";
import { requireAdmin } from "@/Helper/requireAdmin";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (admin instanceof Response) return admin;

    const { prompt } = await request.json();
    const ask = String(prompt ?? "").trim();

    if (!ask) {
      return new Response(
        JSON.stringify(new ApiError(400, "Tell the AI what to write")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    if (ask.length > 1000) {
      return new Response(
        JSON.stringify(new ApiError(400, "Prompt is too long")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const result = await draftNotificationEmail(ask);
    if (!result.ok) {
      return new Response(JSON.stringify(new ApiError(500, result.error)), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify(
        new ApiResponce(200, result.draft, "Draft ready — review and copy"),
      ),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(
        new ApiError(500, error.message || "Could not draft with AI"),
      ),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

import { lookupScannedBook } from "@/data/lookupScannedBook";
import { requireUserId } from "@/Helper/userFromToken";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await requireUserId();
    if (session instanceof Response) return session;

    const code = new URL(request.url).searchParams.get("code")?.trim() ?? "";
    if (!code) {
      return new Response(JSON.stringify(new ApiError(400, "Scan or enter a code")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const book = await lookupScannedBook(code);
    if (!book) {
      return new Response(JSON.stringify(new ApiError(404, "Invalid QR code")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(new ApiResponce(200, book, "Book found")), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify(new ApiError(500, message)), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

import { getBrowseBooks } from "@/data/getBrowseBooks";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const books = await getBrowseBooks();

    return new Response(
      JSON.stringify(new ApiResponce(200, books, "Books found")),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(
        new ApiError(500, error.message || "Internal Server Error"),
      ),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

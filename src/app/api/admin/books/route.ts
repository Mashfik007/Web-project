import { getBooksData } from "@/data/getBooksData";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";

function filterValue(value: string | null) {
  if (!value) return "all";
  const cleaned = value.trim().replace(/^"+|"+$/g, "");
  return cleaned || "all";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const books = await getBooksData("", {
      author: filterValue(searchParams.get("author")),
      category: filterValue(
        searchParams.get("category") ?? searchParams.get("catergory"),
      ),
      available: filterValue(searchParams.get("available")),
    });

    return new Response(JSON.stringify(new ApiResponce(200, books, "Books found")), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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

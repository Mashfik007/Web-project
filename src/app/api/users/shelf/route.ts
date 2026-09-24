import { getMyShelf } from "@/data/getMyShelf";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";

export async function GET(request: Request) {
  try {
    const userId = new URL(request.url).searchParams.get("userId")?.trim();
    if (!userId) {
      return new Response(JSON.stringify(new ApiError(400, "User is required")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const shelf = await getMyShelf(userId);
    return new Response(JSON.stringify(new ApiResponce(200, shelf, "Shelf found")), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify(new ApiError(500, error.message || "Internal Server Error")),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

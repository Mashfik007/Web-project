import connectDB from "@/dbConfig/dbConfig";
import { Author } from "@/Model/Authors";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, nationality } = await request.json();
    const authorName = String(name ?? "").trim();
    const authorNationality = String(nationality ?? "").trim();

    if (!authorName || !authorNationality) {
      return new Response(
        JSON.stringify(new ApiError(400, "Name and nationality are required")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const existing = await Author.findOne({
      name: new RegExp(`^${escapeRegex(authorName)}$`, "i"),
    });
    if (existing) {
      return new Response(
        JSON.stringify(new ApiError(400, "An author with this name already exists")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const author = await Author.create({
      name: authorName,
      nationality: authorNationality,
      status: "Active",
    });

    return new Response(
      JSON.stringify(new ApiResponce(201, author, "Author added")),
      {
        status: 201,
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

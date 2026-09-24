import connectDB from "@/dbConfig/dbConfig";
import { Author } from "@/Model/Authors";
import { Book } from "@/Model/Books";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id, name, nationality } = await request.json();
    const authorName = String(name ?? "").trim();
    const authorNationality = String(nationality ?? "").trim();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid author id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!authorName || !authorNationality) {
      return new Response(
        JSON.stringify(new ApiError(400, "Name and nationality are required")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const author = await Author.findById(id);
    if (!author) {
      return new Response(JSON.stringify(new ApiError(404, "Author not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const duplicate = await Author.findOne({
      _id: { $ne: author._id },
      name: new RegExp(`^${escapeRegex(authorName)}$`, "i"),
    });
    if (duplicate) {
      return new Response(
        JSON.stringify(new ApiError(400, "An author with this name already exists")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const previousName = author.name;
    author.name = authorName;
    author.nationality = authorNationality;
    await author.save();

    if (previousName !== authorName) {
      await Book.updateMany(
        { author: previousName },
        { $set: { author: authorName } },
      );
    }

    return new Response(
      JSON.stringify(new ApiResponce(200, author, "Author updated")),
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

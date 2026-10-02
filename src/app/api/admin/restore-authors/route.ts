import connectDB from "@/dbConfig/dbConfig";
import { ArchivedAuthor } from "@/Model/ArchivedAuthors";
import { Author } from "@/Model/Authors";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";
import { publishCatalogUpdate } from "@/Helper/publishDomain";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify(new ApiError(400, "Invalid archive id")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const archived = await ArchivedAuthor.findById(id);
    if (!archived?.author) {
      return new Response(
        JSON.stringify(new ApiError(404, "Archived author not found")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const snapshot = { ...archived.author };
    delete snapshot.__v;

    await Author.create(snapshot);
    await ArchivedAuthor.deleteOne({ _id: archived._id });

    await publishCatalogUpdate({ entity: "author", action: "restore", id: String(archived.originalId || archived._id) });
    return new Response(
      JSON.stringify(new ApiResponce(200, null, "Author restored")),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    const message =
      error?.code === 11000
        ? "An author with this name is already in the list."
        : error.message || "Internal Server Error";

    return new Response(JSON.stringify(new ApiError(500, message)), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

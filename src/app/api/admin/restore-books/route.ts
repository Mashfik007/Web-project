import connectDB from "@/dbConfig/dbConfig";
import { ArchivedBook } from "@/Model/ArchivedBooks";
import { Book } from "@/Model/Books";
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

    const archived = await ArchivedBook.findById(id);
    if (!archived?.book) {
      return new Response(
        JSON.stringify(new ApiError(404, "Archived book not found")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const snapshot = { ...archived.book };
    delete snapshot.__v;

    await Book.create(snapshot);
    await ArchivedBook.deleteOne({ _id: archived._id });

    await publishCatalogUpdate({ entity: "book", action: "restore", id: String(archived.originalId || archived._id) });
    return new Response(
      JSON.stringify(new ApiResponce(200, null, "Book restored")),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    const message =
      error?.code === 11000
        ? "A book with this ISBN is already in the catalog."
        : error.message || "Internal Server Error";

    return new Response(JSON.stringify(new ApiError(500, message)), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

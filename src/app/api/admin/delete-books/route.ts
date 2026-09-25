import connectDB from "@/dbConfig/dbConfig";
import { ArchivedBook } from "@/Model/ArchivedBooks";
import { Book } from "@/Model/Books";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid book id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const book = await Book.findById(id);
    if (!book) {
      return new Response(JSON.stringify(new ApiError(404, "Book not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await ArchivedBook.create({
      originalId: book._id,
      book: book.toObject(),
      archivedAt: new Date(),
    });

    await Book.deleteOne({ _id: book._id });

    return new Response(
      JSON.stringify(
        new ApiResponce(
          200,
          null,
          "Book removed from the catalog. Readers who already borrowed it keep their copy.",
        ),
      ),
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

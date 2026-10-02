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
      return new Response(JSON.stringify(new ApiError(400, "Invalid author id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const author = await Author.findById(id);
    if (!author) {
      return new Response(JSON.stringify(new ApiError(404, "Author not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await ArchivedAuthor.create({
      originalId: author._id,
      author: author.toObject(),
      archivedAt: new Date(),
    });
    await Author.deleteOne({ _id: author._id });

    await publishCatalogUpdate({ entity: "author", action: "delete", id: String(author._id) });
    return new Response(
      JSON.stringify(new ApiResponce(200, null, "Author archived and deleted")),
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

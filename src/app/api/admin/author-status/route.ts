import connectDB from "@/dbConfig/dbConfig";
import { Author } from "@/Model/Authors";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

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

    author.status = author.status === "Active" ? "Inactive" : "Active";
    await author.save();

    const message =
      author.status === "Active" ? "Author activated" : "Author deactivated";

    return new Response(JSON.stringify(new ApiResponce(200, author, message)), {
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

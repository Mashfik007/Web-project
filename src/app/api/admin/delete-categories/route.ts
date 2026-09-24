import connectDB from "@/dbConfig/dbConfig";
import { ArchivedCategory } from "@/Model/ArchivedCategories";
import { Category } from "@/Model/Categories";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid category id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return new Response(JSON.stringify(new ApiError(404, "Category not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await ArchivedCategory.create({
      originalId: category._id,
      category: category.toObject(),
      archivedAt: new Date(),
    });
    await Category.deleteOne({ _id: category._id });

    return new Response(
      JSON.stringify(new ApiResponce(200, null, "Category archived and deleted")),
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

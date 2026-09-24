import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import { Category } from "@/Model/Categories";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id, name, description } = await request.json();
    const categoryName = String(name ?? "").trim();
    const categoryDescription = String(description ?? "").trim();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid category id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!categoryName || !categoryDescription) {
      return new Response(
        JSON.stringify(new ApiError(400, "Name and description are required")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const category = await Category.findById(id);
    if (!category) {
      return new Response(JSON.stringify(new ApiError(404, "Category not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const duplicate = await Category.findOne({
      _id: { $ne: category._id },
      name: new RegExp(`^${escapeRegex(categoryName)}$`, "i"),
    });
    if (duplicate) {
      return new Response(
        JSON.stringify(new ApiError(400, "A category with this name already exists")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const previousName = category.name;
    category.name = categoryName;
    category.description = categoryDescription;
    await category.save();

    if (previousName !== categoryName) {
      await Book.updateMany(
        { "metadata.genre": previousName },
        { $set: { "metadata.genre": categoryName } },
      );
    }

    return new Response(
      JSON.stringify(new ApiResponce(200, category, "Category updated")),
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

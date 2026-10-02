import connectDB from "@/dbConfig/dbConfig";
import { ArchivedCategory } from "@/Model/ArchivedCategories";
import { Category } from "@/Model/Categories";
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

    const archived = await ArchivedCategory.findById(id);
    if (!archived?.category) {
      return new Response(
        JSON.stringify(new ApiError(404, "Archived category not found")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const snapshot = { ...archived.category };
    delete snapshot.__v;

    await Category.create(snapshot);
    await ArchivedCategory.deleteOne({ _id: archived._id });

    await publishCatalogUpdate({ entity: "category", action: "restore", id: String(archived.originalId || archived._id) });
    return new Response(
      JSON.stringify(new ApiResponce(200, null, "Category restored")),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    const message =
      error?.code === 11000
        ? "A category with this name is already in the list."
        : error.message || "Internal Server Error";

    return new Response(JSON.stringify(new ApiError(500, message)), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

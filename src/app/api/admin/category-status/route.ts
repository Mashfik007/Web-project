import connectDB from "@/dbConfig/dbConfig";
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

    category.status = category.status === "Active" ? "Inactive" : "Active";
    await category.save();

    const message =
      category.status === "Active" ? "Category activated" : "Category deactivated";

    await publishCatalogUpdate({ entity: "category", action: "status", id: String(category._id) });
    return new Response(JSON.stringify(new ApiResponce(200, category, message)), {
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

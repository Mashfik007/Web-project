import connectDB from "@/dbConfig/dbConfig";
import { Category } from "@/Model/Categories";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import { publishCatalogUpdate } from "@/Helper/publishDomain";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, description } = await request.json();
    const categoryName = String(name ?? "").trim();
    const categoryDescription = String(description ?? "").trim();

    if (!categoryName || !categoryDescription) {
      return new Response(
        JSON.stringify(new ApiError(400, "Name and description are required")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const existing = await Category.findOne({
      name: new RegExp(`^${escapeRegex(categoryName)}$`, "i"),
    });
    if (existing) {
      return new Response(
        JSON.stringify(new ApiError(400, "A category with this name already exists")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const category = await Category.create({
      name: categoryName,
      description: categoryDescription,
      status: "Active",
    });

    await publishCatalogUpdate({ entity: "category", action: "create", id: String(category._id) });
    return new Response(
      JSON.stringify(new ApiResponce(201, category, "Category added")),
      {
        status: 201,
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

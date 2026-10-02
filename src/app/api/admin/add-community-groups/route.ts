import connectDB from "@/dbConfig/dbConfig";
import { requireAdmin } from "@/Helper/requireAdmin";
import { CommunityGroup } from "@/Model/CommunityGroups";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import { publishGroupUpdate } from "@/Helper/publishDomain";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (admin instanceof Response) return admin;

    await connectDB();
    const { name, description } = await request.json();
    const groupName = String(name ?? "").trim();
    const groupDescription = String(description ?? "").trim();

    if (!groupName || !groupDescription) {
      return new Response(
        JSON.stringify(new ApiError(400, "Name and description are required")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    if (groupName.length > 80 || groupDescription.length > 280) {
      return new Response(
        JSON.stringify(new ApiError(400, "Name or description is too long")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const existing = await CommunityGroup.findOne({
      name: new RegExp(`^${escapeRegex(groupName)}$`, "i"),
    });
    if (existing) {
      return new Response(
        JSON.stringify(new ApiError(400, "A community group with this name already exists")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const group = await CommunityGroup.create({
      name: groupName,
      description: groupDescription,
      createdBy: admin._id,
    });

    await publishGroupUpdate({ action: "create", id: String(group._id) });
    return new Response(
      JSON.stringify(new ApiResponce(201, group, "Community group created")),
      { status: 201, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify(new ApiError(500, message)), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

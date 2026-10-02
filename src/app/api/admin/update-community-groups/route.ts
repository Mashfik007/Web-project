import connectDB from "@/dbConfig/dbConfig";
import { requireAdmin } from "@/Helper/requireAdmin";
import { CommunityGroup } from "@/Model/CommunityGroups";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";
import { publishGroupUpdate } from "@/Helper/publishDomain";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (admin instanceof Response) return admin;

    await connectDB();
    const { id, name, description } = await request.json();
    const groupId = String(id ?? "").trim();
    const groupName = String(name ?? "").trim();
    const groupDescription = String(description ?? "").trim();

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return new Response(JSON.stringify(new ApiError(400, "Group not found")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!groupName || !groupDescription) {
      return new Response(
        JSON.stringify(new ApiError(400, "Name and description are required")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const duplicate = await CommunityGroup.findOne({
      _id: { $ne: groupId },
      name: new RegExp(`^${escapeRegex(groupName)}$`, "i"),
    });
    if (duplicate) {
      return new Response(
        JSON.stringify(new ApiError(400, "A community group with this name already exists")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const group = await CommunityGroup.findByIdAndUpdate(
      groupId,
      { name: groupName, description: groupDescription },
      { new: true },
    );
    if (!group) {
      return new Response(JSON.stringify(new ApiError(404, "Group not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await publishGroupUpdate({ action: "update", id: String(group._id) });
    return new Response(
      JSON.stringify(new ApiResponce(200, group, "Community group updated")),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify(new ApiError(500, message)), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

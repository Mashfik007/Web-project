import connectDB from "@/dbConfig/dbConfig";
import { requireAdmin } from "@/Helper/requireAdmin";
import { CommunityGroup } from "@/Model/CommunityGroups";
import { GroupMember } from "@/Model/GroupMembers";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";
import { publishGroupUpdate } from "@/Helper/publishDomain";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (admin instanceof Response) return admin;

    await connectDB();
    const { id } = await request.json();
    const groupId = String(id ?? "").trim();
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return new Response(JSON.stringify(new ApiError(400, "Group not found")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const group = await CommunityGroup.findByIdAndDelete(groupId);
    if (!group) {
      return new Response(JSON.stringify(new ApiError(404, "Group not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await GroupMember.deleteMany({ groupId });

    await publishGroupUpdate({ action: "delete", id: String(group._id) });
    return new Response(
      JSON.stringify(new ApiResponce(200, null, "Community group deleted")),
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

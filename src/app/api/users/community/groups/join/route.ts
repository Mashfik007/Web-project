import connectDB from "@/dbConfig/dbConfig";
import { requireUserId } from "@/Helper/userFromToken";
import { CommunityGroup } from "@/Model/CommunityGroups";
import { GroupMember } from "@/Model/GroupMembers";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const session = await requireUserId();
    if (session instanceof Response) return session;

    const body = await request.json().catch(() => null);
    const groupId =
      body && typeof body === "object" && "groupId" in body
        ? String(body.groupId ?? "").trim()
        : "";

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return new Response(JSON.stringify(new ApiError(400, "Group not found")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();
    const group = await CommunityGroup.findById(groupId).select("_id").lean();
    if (!group) {
      return new Response(JSON.stringify(new ApiError(404, "Group not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existing = await GroupMember.findOne({ groupId, userId: session }).select("_id").lean();
    if (!existing) {
      try {
        await GroupMember.create({ groupId, userId: session });
      } catch (error) {
        const duplicate = typeof error === "object" && error !== null && "code" in error && error.code === 11000;
        if (!duplicate) throw error;
      }
    }

    return new Response(
      JSON.stringify(new ApiResponce(200, { joined: true }, "You joined the group")),
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

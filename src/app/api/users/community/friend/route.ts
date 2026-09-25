import connectDB from "@/dbConfig/dbConfig";
import { requireUserId } from "@/Helper/userFromToken";
import { FriendRequest } from "@/Model/FriendRequests";
import { User } from "@/Model/Users";
import { FriendAction_schema } from "@/Shchema/shelf";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const parsed = FriendAction_schema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify(
          new ApiError(400, parsed.error.issues[0]?.message || "Invalid friend request"),
        ),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const session = await requireUserId();
    if (session instanceof Response) return session;
    const userId = session;
    const { targetId, action } = parsed.data;
    if (userId === targetId) {
      return new Response(
        JSON.stringify(new ApiError(400, "You cannot send a request to yourself")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return new Response(JSON.stringify(new ApiError(404, "Member not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    const [sender, member] = await Promise.all([
      User.findById(userId).select("isAdmin").lean<{ isAdmin?: boolean } | null>(),
      User.findById(targetId).select("isAdmin").lean<{ isAdmin?: boolean } | null>(),
    ]);
    if (!member) {
      return new Response(JSON.stringify(new ApiError(404, "Member not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (member.isAdmin || sender?.isAdmin) {
      return new Response(
        JSON.stringify(new ApiError(400, "Friend requests are only between members")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const outgoing = await FriendRequest.findOne({ fromId: userId, toId: targetId });
    const incoming = await FriendRequest.findOne({ fromId: targetId, toId: userId });

    if (action === "request") {
      if (outgoing?.status === "accepted" || incoming?.status === "accepted") {
        return new Response(
          JSON.stringify(new ApiError(400, "You are already friends")),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
      if (incoming?.status === "pending") {
        incoming.status = "accepted";
        await incoming.save();
        return new Response(
          JSON.stringify(
            new ApiResponce(200, { friendStatus: "friends" }, "Friend request accepted"),
          ),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (outgoing) {
        outgoing.status = "pending";
        await outgoing.save();
      } else {
        await FriendRequest.create({ fromId: userId, toId: targetId, status: "pending" });
      }
      return new Response(
        JSON.stringify(new ApiResponce(201, { friendStatus: "outgoing" }, "Friend request sent")),
        { status: 201, headers: { "Content-Type": "application/json" } },
      );
    }

    if (action === "accept") {
      if (!incoming || incoming.status !== "pending") {
        return new Response(
          JSON.stringify(new ApiError(404, "No friend request to accept")),
          { status: 404, headers: { "Content-Type": "application/json" } },
        );
      }
      incoming.status = "accepted";
      await incoming.save();
      if (outgoing?.status === "pending") {
        outgoing.status = "accepted";
        await outgoing.save();
      }
      return new Response(
        JSON.stringify(new ApiResponce(200, { friendStatus: "friends" }, "You are now friends")),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    if (action === "decline") {
      if (!incoming || incoming.status !== "pending") {
        return new Response(
          JSON.stringify(new ApiError(404, "No friend request to decline")),
          { status: 404, headers: { "Content-Type": "application/json" } },
        );
      }
      incoming.status = "declined";
      await incoming.save();
      return new Response(
        JSON.stringify(new ApiResponce(200, { friendStatus: "none" }, "Friend request declined")),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!outgoing || outgoing.status !== "pending") {
      return new Response(
        JSON.stringify(new ApiError(404, "No outgoing friend request")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }
    await outgoing.deleteOne();
    return new Response(
      JSON.stringify(new ApiResponce(200, { friendStatus: "none" }, "Friend request cancelled")),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(new ApiError(500, error.message || "Internal Server Error")),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

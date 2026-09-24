import connectDB from "@/dbConfig/dbConfig";
import { Follow } from "@/Model/Follows";
import { FollowAction_schema } from "@/Shchema/shelf";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";

export async function POST(request: Request) {
  try {
    const parsed = FollowAction_schema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify(new ApiError(400, parsed.error.issues[0]?.message || "Invalid follow request")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { userId, targetId } = parsed.data;
    if (userId === targetId) {
      return new Response(JSON.stringify(new ApiError(400, "You cannot follow yourself")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();
    const existing = await Follow.findOne({
      followerId: userId,
      followingId: targetId,
    });

    if (existing) {
      await existing.deleteOne();
      return new Response(
        JSON.stringify(new ApiResponce(200, { following: false }, "Unfollowed")),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    await Follow.create({ followerId: userId, followingId: targetId });
    return new Response(
      JSON.stringify(new ApiResponce(201, { following: true }, "You are now following this member")),
      { status: 201, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(new ApiError(500, error.message || "Internal Server Error")),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

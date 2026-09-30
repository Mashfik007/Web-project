import connectDB from "@/dbConfig/dbConfig";
import { getUnreadNoticeCount } from "@/data/getUnreadNoticeCount";
import { requireUserId } from "@/Helper/userFromToken";
import { NoticeRead } from "@/Model/NoticeReads";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";

export async function POST() {
  try {
    const session = await requireUserId();
    if (session instanceof Response) return session;

    await connectDB();
    await NoticeRead.findOneAndUpdate(
      { userId: session },
      { lastReadAt: new Date() },
      { upsert: true },
    );

    const unread = await getUnreadNoticeCount(session);
    return new Response(
      JSON.stringify(new ApiResponce(200, { unread }, "Marked read")),
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

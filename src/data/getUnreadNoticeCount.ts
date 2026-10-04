import connectDB from "@/dbConfig/dbConfig";
import { Notice } from "@/Model/Notices";
import { NoticeRead } from "@/Model/NoticeReads";

/** Broadcast notices plus any notice aimed at this user. */
function audienceFilter(userId: string) {
  return {
    $or: [
      { recipientUserId: { $in: [null, ""] } },
      { recipientUserId: { $exists: false } },
      { recipientUserId: userId },
    ],
  };
}

export async function getUnreadNoticeCount(userId: string) {
  await connectDB();

  const read = await NoticeRead.findOne({ userId }).select("lastReadAt").lean();
  const lastReadAt = read?.lastReadAt as Date | undefined;
  const filter = {
    ...audienceFilter(userId),
    ...(lastReadAt ? { createdAt: { $gt: lastReadAt } } : {}),
  };

  return Notice.countDocuments(filter);
}

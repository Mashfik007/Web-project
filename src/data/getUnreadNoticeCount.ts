import connectDB from "@/dbConfig/dbConfig";
import { Notice } from "@/Model/Notices";
import { NoticeRead } from "@/Model/NoticeReads";

export async function getUnreadNoticeCount(userId: string) {
  await connectDB();

  const read = await NoticeRead.findOne({ userId }).select("lastReadAt").lean();
  const lastReadAt = read?.lastReadAt as Date | undefined;
  const filter = lastReadAt ? { createdAt: { $gt: lastReadAt } } : {};

  return Notice.countDocuments(filter);
}

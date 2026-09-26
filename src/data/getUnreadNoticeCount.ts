import connectDB from "@/dbConfig/dbConfig";
import { Notice } from "@/Model/Notices";
import { NoticeRead } from "@/Model/NoticeReads";

export async function getUnreadNoticeCount(userId: string) {
  await connectDB();
  const read = await NoticeRead.findOne({ userId }).select("lastReadAt").lean<{ lastReadAt?: Date } | null>();
  const filter = read?.lastReadAt ? { createdAt: { $gt: read.lastReadAt } } : {};
  return Notice.countDocuments(filter);
}

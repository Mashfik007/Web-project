import connectDB from "@/dbConfig/dbConfig";
import { Notice } from "@/Model/Notices";
import type { AdminNotice, LibraryNotice } from "@/types/notice";

type StoredNotice = {
  _id: { toString(): string };
  title: string;
  message: string;
  recipients?: number;
  recipientUserId?: string | null;
  recipientName?: string | null;
  createdAt?: Date;
};

function toLibraryNotice(notice: StoredNotice): LibraryNotice {
  return {
    id: notice._id.toString(),
    title: notice.title,
    message: notice.message,
    createdAt: notice.createdAt
      ? new Date(notice.createdAt).toISOString()
      : new Date().toISOString(),
  };
}

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

export async function getLibraryNotices(
  userId: string,
): Promise<LibraryNotice[]> {
  await connectDB();

  const notices = await Notice.find(audienceFilter(userId))
    .sort({ createdAt: -1 })
    .limit(100)
    .lean<StoredNotice[]>();

  return notices.map(toLibraryNotice);
}

export async function getAdminNotices(): Promise<AdminNotice[]> {
  await connectDB();

  const notices = await Notice.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .lean<StoredNotice[]>();

  return notices.map((notice) => ({
    ...toLibraryNotice(notice),
    recipients: notice.recipients ?? 0,
    recipientName: notice.recipientName ?? null,
  }));
}

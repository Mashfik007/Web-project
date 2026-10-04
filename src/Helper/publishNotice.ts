import { emitRealtime } from "@/Helper/emitRealtime";
import { NOTICES_ROOM, userRoom } from "@/Helper/realtimeRooms";
import type { LibraryNotice } from "@/types/notice";
import type { NoticeUpdatePayload } from "@/types/realtime";

export { NOTICES_ROOM } from "@/Helper/realtimeRooms";

export async function publishNotice(
  notice: LibraryNotice,
  recipientUserId?: string | null,
) {
  const payload: NoticeUpdatePayload = {
    id: notice.id,
    title: notice.title,
    message: notice.message,
    createdAt: notice.createdAt,
  };

  const rooms = recipientUserId
    ? [userRoom(recipientUserId)]
    : [NOTICES_ROOM];

  try {
    await emitRealtime("notice:new", rooms, payload);
  } catch (error) {
    console.error("[publishNotice] failed:", error);
    throw new Error("Live notification could not be delivered");
  }
}

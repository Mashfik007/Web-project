import { emitRealtime } from "@/Helper/emitRealtime";
import { NOTICES_ROOM } from "@/Helper/realtimeRooms";
import type { LibraryNotice } from "@/types/notice";
import type { NoticeUpdatePayload } from "@/types/realtime";

export { NOTICES_ROOM } from "@/Helper/realtimeRooms";

export async function publishNotice(notice: LibraryNotice) {
  const payload: NoticeUpdatePayload = {
    id: notice.id,
    title: notice.title,
    message: notice.message,
    createdAt: notice.createdAt,
  };

  try {
    await emitRealtime("notice:new", [NOTICES_ROOM], payload);
  } catch (error) {
    console.error("[publishNotice] failed:", error);
    throw new Error("Live notification could not be delivered");
  }
}

import { emitRealtime } from "@/Helper/emitRealtime";
import { ADMIN_OPS_ROOM, userRoom } from "@/Helper/realtimeRooms";
import type { BorrowUpdatePayload } from "@/types/realtime";

export type { BorrowUpdatePayload } from "@/types/realtime";

export async function publishBorrowUpdate(payload: BorrowUpdatePayload) {
  const rooms = new Set<string>();

  if (payload.userId) rooms.add(userRoom(payload.userId));
  if (payload.ownerId) rooms.add(userRoom(payload.ownerId));
  if (payload.scope === "library") rooms.add(ADMIN_OPS_ROOM);

  try {
    await emitRealtime("borrow:update", [...rooms], payload);
  } catch (error) {
    console.error("[publishBorrowUpdate] failed:", error);
  }
}

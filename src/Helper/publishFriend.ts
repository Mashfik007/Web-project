import { emitRealtime } from "@/Helper/emitRealtime";
import { userRoom } from "@/Helper/realtimeRooms";
import type { FriendUpdatePayload } from "@/types/realtime";

export type { FriendUpdatePayload } from "@/types/realtime";

export async function publishFriendUpdate(payload: FriendUpdatePayload) {
  const rooms = [userRoom(payload.fromId), userRoom(payload.toId)];

  try {
    await emitRealtime("friend:update", rooms, payload);
  } catch (error) {
    console.error("[publishFriendUpdate] failed:", error);
  }
}

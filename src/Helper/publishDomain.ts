import { emitRealtime } from "@/Helper/emitRealtime";
import {
  ADMIN_OPS_ROOM,
  CATALOG_ROOM,
  NOTICES_ROOM,
  userRoom,
} from "@/Helper/realtimeRooms";
import type {
  CatalogUpdatePayload,
  DigitalUpdatePayload,
  FineUpdatePayload,
  GroupUpdatePayload,
  OrderUpdatePayload,
  ReservationUpdatePayload,
  ShelfUpdatePayload,
  UserAdminUpdatePayload,
} from "@/types/realtime";

async function safeEmit(event: string, rooms: string[], payload: unknown) {
  try {
    await emitRealtime(event, rooms, payload);
  } catch (error) {
    console.error(`[${event}] publish failed:`, error);
  }
}

export async function publishShelfUpdate(payload: ShelfUpdatePayload) {
  const rooms = [ADMIN_OPS_ROOM];
  if (payload.userId) rooms.push(userRoom(payload.userId));
  if (payload.targetUserId) rooms.push(userRoom(payload.targetUserId));
  await safeEmit("shelf:update", rooms, payload);
}

export async function publishReservationUpdate(
  payload: ReservationUpdatePayload,
) {
  const rooms = [ADMIN_OPS_ROOM];
  if (payload.userId) rooms.push(userRoom(payload.userId));
  await safeEmit("reservation:update", rooms, payload);
}

export async function publishFineUpdate(payload: FineUpdatePayload) {
  const rooms = [ADMIN_OPS_ROOM];
  if (payload.userId) rooms.push(userRoom(payload.userId));
  await safeEmit("fine:update", rooms, payload);
}

export async function publishCatalogUpdate(payload: CatalogUpdatePayload) {
  await safeEmit("catalog:update", [ADMIN_OPS_ROOM, CATALOG_ROOM], payload);
}

export async function publishUserAdminUpdate(payload: UserAdminUpdatePayload) {
  await safeEmit(
    "user:update",
    [ADMIN_OPS_ROOM, userRoom(payload.id)],
    payload,
  );
}

export async function publishGroupUpdate(payload: GroupUpdatePayload) {
  const rooms = [ADMIN_OPS_ROOM, CATALOG_ROOM, NOTICES_ROOM];
  if (payload.userId) rooms.push(userRoom(payload.userId));
  await safeEmit("group:update", rooms, payload);
}

export async function publishDigitalUpdate(payload: DigitalUpdatePayload) {
  const rooms = [ADMIN_OPS_ROOM, CATALOG_ROOM];
  if (payload.userId) rooms.push(userRoom(payload.userId));
  await safeEmit("digital:update", rooms, payload);
}

export async function publishOrderUpdate(payload: OrderUpdatePayload) {
  await safeEmit(
    "order:update",
    [userRoom(payload.userId), ADMIN_OPS_ROOM],
    payload,
  );
}

export const ADMIN_OPS_ROOM = "admin:ops";
export const NOTICES_ROOM = "notices";
export const CATALOG_ROOM = "catalog";

export function userRoom(userId: string) {
  return `user:${userId}`;
}

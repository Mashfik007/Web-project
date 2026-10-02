export const ADMIN_OPS_ROOM = "admin:ops";

export function userRoom(userId: string) {
  return `user:${userId}`;
}

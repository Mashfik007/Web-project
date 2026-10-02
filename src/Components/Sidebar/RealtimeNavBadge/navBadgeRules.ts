import type {
  BorrowUpdatePayload,
  FriendUpdatePayload,
  ReservationUpdatePayload,
  ShelfUpdatePayload,
} from "@/types/realtime";

export const ADMIN_BORROW_EVENTS = ["borrow:update"] as const;
export const ADMIN_RETURNS_EVENTS = ["shelf:update", "borrow:update"] as const;
export const ADMIN_RESERVATION_EVENTS = ["reservation:update"] as const;
export const ADMIN_FINE_EVENTS = ["fine:update"] as const;
export const USER_BORROW_EVENTS = ["borrow:update"] as const;
export const USER_COMMUNITY_EVENTS = ["friend:update"] as const;
export const USER_SHELF_EVENTS = [
  "shelf:update",
  "reservation:update",
  "borrow:update",
] as const;

export function adminBorrowShouldCount(_event: string, payload: unknown) {
  const update = payload as BorrowUpdatePayload;
  return update?.scope === "library" && update.action === "created";
}

export function adminReturnsShouldCount(event: string, payload: unknown) {
  if (event === "shelf:update") {
    const update = payload as ShelfUpdatePayload;
    return update?.action === "returned" || update?.action === "return";
  }
  if (event === "borrow:update") {
    const update = payload as BorrowUpdatePayload;
    return update?.scope === "library" && update.action === "approved";
  }
  return false;
}

export function adminReservationsShouldCount(
  _event: string,
  payload: unknown,
) {
  const update = payload as ReservationUpdatePayload;
  return Boolean(update?.action);
}

export function adminFinesShouldCount(_event: string, payload: unknown) {
  return Boolean((payload as { action?: string })?.action);
}

export function userBorrowShouldCount(
  userId: string,
  _event: string,
  payload: unknown,
) {
  const update = payload as BorrowUpdatePayload;
  if (!update?.id) return false;
  // Incoming peer request for this user to answer
  if (update.action === "created" && update.ownerId === userId) return true;
  // Library/peer decision on this user's own request
  if (
    (update.action === "approved" || update.action === "rejected") &&
    update.userId === userId
  ) {
    return true;
  }
  return false;
}

export function userCommunityShouldCount(
  userId: string,
  _event: string,
  payload: unknown,
) {
  const update = payload as FriendUpdatePayload;
  return update?.action === "request" && update.toId === userId;
}

export function userShelfShouldCount(
  userId: string,
  event: string,
  payload: unknown,
) {
  if (event === "shelf:update") {
    const update = payload as ShelfUpdatePayload;
    return update?.userId === userId;
  }
  if (event === "reservation:update") {
    const update = payload as ReservationUpdatePayload;
    return update?.userId === userId;
  }
  if (event === "borrow:update") {
    const update = payload as BorrowUpdatePayload;
    return (
      update?.userId === userId &&
      (update.action === "approved" || update.action === "rejected")
    );
  }
  return false;
}

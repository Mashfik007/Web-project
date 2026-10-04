export type FriendUpdateAction =
  | "request"
  | "accept"
  | "decline"
  | "cancel"
  | "unfriend";

export type FriendUpdatePayload = {
  action: FriendUpdateAction;
  fromId: string;
  toId: string;
  actorId: string;
  actorName: string;
};

export type BorrowUpdateAction = "created" | "approved" | "rejected";
export type BorrowUpdateScope = "library" | "peer";
export type BorrowUpdateStatus = "Pending" | "Approved" | "Rejected";

export type BorrowUpdatePayload = {
  id: string;
  action: BorrowUpdateAction;
  scope: BorrowUpdateScope;
  status: BorrowUpdateStatus;
  userId: string;
  ownerId?: string;
  member: string;
  book: string;
  bookId?: string;
  requested: string;
  expectedReturn: string;
  reason?: string;
};

export type ShelfUpdatePayload = {
  action: "return" | "renew" | "wishlist" | "follow" | "activity" | "returned";
  userId: string;
  bookId?: string;
  targetUserId?: string;
};

export type ReservationUpdatePayload = {
  action: "ready" | "cancelled" | "created";
  id: string;
  userId: string;
  book?: string;
};

export type FineUpdatePayload = {
  action: "added" | "paid" | "waived";
  id: string;
  userId: string;
  amount?: number;
  status?: string;
};

export type CatalogEntity = "book" | "author" | "category" | "publisher";
export type CatalogUpdatePayload = {
  entity: CatalogEntity;
  action: "create" | "update" | "delete" | "restore" | "status";
  id: string;
};

export type UserAdminUpdatePayload = {
  action: "create" | "update" | "status" | "delete" | "restore";
  id: string;
  status?: string;
};

export type GroupUpdatePayload = {
  action: "create" | "update" | "delete" | "joined";
  id: string;
  userId?: string;
};

export type DigitalUpdatePayload = {
  action: "add" | "delete" | "download";
  id: string;
  userId?: string;
};

export type OrderUpdatePayload = {
  action: "placed";
  id: string;
  userId: string;
  bookId?: string;
};

export type NoticeUpdatePayload = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
};

/** All domain events clients should refresh on (besides chat message:new). */
export const REALTIME_REFRESH_EVENTS = [
  "borrow:update",
  "friend:update",
  "shelf:update",
  "reservation:update",
  "fine:update",
  "catalog:update",
  "user:update",
  "group:update",
  "digital:update",
  "order:update",
  "notice:new",
] as const;

export type RealtimeRefreshEvent = (typeof REALTIME_REFRESH_EVENTS)[number];

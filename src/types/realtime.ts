export type FriendUpdateAction = "request" | "accept" | "decline" | "cancel";

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

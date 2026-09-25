import z from "zod";

export const ShelfUser_schema = z.object({
  userId: z.string().min(1, "user is required"),
});

export const ShelfLoanAction_schema = ShelfUser_schema.extend({
  loanId: z.string().min(1, "loan is required"),
});

export const ReadingLog_schema = ShelfLoanAction_schema.extend({
  page: z.number().min(0, "page is required"),
});

export const FollowAction_schema = ShelfUser_schema.extend({
  targetId: z.string().min(1, "member is required"),
});

export const FriendAction_schema = ShelfUser_schema.extend({
  targetId: z.string().min(1, "member is required"),
  action: z.enum(["request", "accept", "decline", "cancel"]),
});

export const PeerBorrow_schema = z.object({
  targetId: z.string().min(1, "member is required"),
  bookId: z.string().min(1, "book is required"),
});

export const PeerBorrowReply_schema = z.object({
  requestId: z.string().min(1, "request is required"),
  action: z.enum(["approve", "decline"]),
});

export const ShelfBookAction_schema = ShelfUser_schema.extend({
  bookId: z.string().min(1, "book is required"),
  returnDate: z.string().optional(),
  blindDate: z.boolean().optional(),
});

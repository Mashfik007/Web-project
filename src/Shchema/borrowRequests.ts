import z from "zod";

export const BorrowRequest_shema = z.object({
  member: z.string().min(1, "member is required"),
  book: z.string().min(1, "book is required"),
  requested: z.string().min(1, "requested date is required"),
  expectedReturn: z.string().min(1, "expected return is required"),
});

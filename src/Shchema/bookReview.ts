import z from "zod";

export const BookReview_schema = z.object({
  bookId: z.string().min(1, "book is required"),
  rating: z.number().int().min(1).max(5),
  note: z.string().max(1000).optional(),
});

export type BookReviewValues = z.infer<typeof BookReview_schema>;

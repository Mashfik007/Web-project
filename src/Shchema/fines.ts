import z from "zod";

export const Fine_shema = z.object({
  member: z.string().min(1, "member is required"),
  book: z.string().min(1, "book is required"),
  type: z.enum(["Overdue", "Damage", "Lost"]),
  amount: z.number().positive("amount must be greater than 0"),
  date: z.string().min(1, "date is required"),
});

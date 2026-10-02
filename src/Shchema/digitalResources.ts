import z from "zod";

export const DigitalResource_shema = z.object({
  title: z.string().min(1, "title is required"),
  author: z.string().min(1, "author is required"),
  format: z.enum(["PDF", "EPUB"]),
  category: z.string().min(1, "category is required"),
});

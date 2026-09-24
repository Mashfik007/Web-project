import z from "zod";

export const Category_shema = z.object({
  name: z.string().min(1, "name is required"),
  description: z.string().min(1, "description is required"),
});

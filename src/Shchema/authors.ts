import z from "zod";

export const Author_shema = z.object({
  name: z.string().min(1, "name is required"),
  nationality: z.string().min(1, "nationality is required"),
});

import z from "zod";

export const Publisher_shema = z.object({
  name: z.string().min(1, "name is required"),
  city: z.string().min(1, "city is required"),
  email: z.email("enter a valid email"),
});

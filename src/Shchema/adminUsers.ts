import z from "zod";

export const AdminUser_shema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.email("enter a valid email"),
  phone: z.string().min(1, "phone is required"),
  role: z.enum(["Member", "Librarian", "Admin"]),
});

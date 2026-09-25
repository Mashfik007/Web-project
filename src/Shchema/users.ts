import z from "zod";

export const Form_shema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(40, "Name must be 40 characters or fewer"),
    email: z.email("Please enter a valid email address"),
    phone: z
      .string()
      .regex(/^\+?[0-9]\d{7,14}$/, "Please enter a valid phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password is too long"),
    confirmpassword: z.string(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

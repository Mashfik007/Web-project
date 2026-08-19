import z from "zod";

export const Form_shema = z
  .object({
    name: z.string().min(8).max(10),
    email: z.email(),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{7,14}$/, "Please enter a valid phone number"),
    password: z.string(),
    confirmpassword: z.string(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // path of error
  });

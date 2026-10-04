import z from "zod";

const bdPhoneSchema = z
  .string()
  .regex(/^01[3-9]\d{8}$/, "Enter a valid Bangladesh phone number");

export const deliveryFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(60, "Full name is too long"),
  phone: bdPhoneSchema,
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(120, "Address is too long"),
  city: z.string().min(1, "City is required"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(10, "Quantity cannot exceed 10"),
});

export const paymentMethodSchema = z.object({
  methodId: z.enum(["bkash", "rocket"], {
    message: "Select a payment method",
  }),
});

export const confirmPaymentSchema = z.object({
  transactionId: z
    .string()
    .min(6, "Transaction ID must be at least 6 characters")
    .max(20, "Transaction ID is too long")
    .regex(
      /^[A-Za-z0-9]+$/,
      "Transaction ID can only contain letters and numbers",
    ),
  paymentPhone: bdPhoneSchema,
});

export const paymentFormSchema = paymentMethodSchema.merge(confirmPaymentSchema);

export type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;
export type PaymentMethodValues = z.infer<typeof paymentMethodSchema>;
export type ConfirmPaymentValues = z.infer<typeof confirmPaymentSchema>;
export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

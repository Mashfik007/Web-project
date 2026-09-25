import z from "zod";

export const SendMessage_schema = z.object({
  conversationId: z.string().trim().min(1, "conversation is required").max(160),
  body: z.string().trim().min(1, "Write a message").max(2000),
});

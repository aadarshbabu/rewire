import { z } from "zod";

export const SendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string().min(1).max(10000)
});

export type SendMessageInput =
  z.infer<typeof SendMessageSchema>;
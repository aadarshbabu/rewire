import { z } from "zod";

export const SendMessageSchema = z.object({
  conversationId: z.string().min(1, "conversationId is required"),
  content: z.string().min(1, "Message content is required").max(10000),
});

export const SendMessageBodySchema = z.object({
  content: z.string().min(1, "Message content is required").max(10000),
});

export type SendMessageInput = z.infer<typeof SendMessageSchema>;
export type SendMessageBodyInput = z.infer<typeof SendMessageBodySchema>;
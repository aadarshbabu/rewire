// src/conversation.ts

export interface Conversation {
  id: string;
  userId: string;
  createdAt: string;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}
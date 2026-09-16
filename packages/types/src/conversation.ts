// src/conversation.ts

export interface Conversation {
  id: string;
  userId: string;
  createdAt: string;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string | Date;
}

export type AiRunStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface AiRun {
  id: string;
  conversationId: string;
  triggeringMessageId?: string | null;
  status: AiRunStatus;
  error?: string | null;
  startedAt?: string | Date | null;
  completedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AiJobPayload {
  runId: string;
  conversationId: string;
  messageId: string;
  userId: string;
}

export type AiStreamEventType =
  | "run.started"
  | "node.started"
  | "message.delta"
  | "node.completed"
  | "run.completed"
  | "run.failed";

export interface AiStreamEvent {
  type: AiStreamEventType;
  runId: string;
  node?: string;
  content?: string;
  error?: string;
  messageId?: string;
  timestamp: number;
}
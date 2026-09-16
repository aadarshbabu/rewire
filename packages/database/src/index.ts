export { db, createDatabaseClient } from "./client";
export type { PrismaClient } from "@prisma/client";

// Re-export all generated Prisma types so consumers don't need
// to depend on @prisma/client directly
export {
  Prisma,
  type User,
  type Session,
  type Account,
  type Verification,
  type Conversation,
  type ConversationMessage,
  type AiRun,
  type JournalEntry,
} from "@prisma/client";

import { createTRPCRouter } from "../init";
import { userRouter } from "./user";
import { conversationRouter } from "./conversation";
import { journalRouter } from "./journal";
import { insightsRouter } from "./insights";

export const appRouter = createTRPCRouter({
  user: userRouter,
  conversation: conversationRouter,
  journal: journalRouter,
  insights: insightsRouter,
});


// Export type definition of API
export type AppRouter = typeof appRouter;

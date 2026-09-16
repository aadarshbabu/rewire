import { z } from "zod";
import { createTRPCRouter, baseProcedure } from "../init";
import { enqueueAiJob } from "@/lib/queue";

export const conversationRouter = createTRPCRouter({
  list: baseProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const targetUserId = input.userId || ctx.user?.id;
      if (!targetUserId) {
        return [];
      }

      const conversations = await ctx.db.conversation.findMany({
        where: { userId: targetUserId },
        orderBy: { updatedAt: "desc" },
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
      return conversations;
    }),

  byId: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.db.conversation.findUnique({
        where: { id: input.id },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
          aiRuns: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
      });
      return conversation;
    }),

  create: baseProcedure
    .input(z.object({ userId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const targetUserId = input.userId || ctx.user?.id;
      if (!targetUserId) {
        throw new Error("UserId is required to create a conversation");
      }

      const conversation = await ctx.db.conversation.create({
        data: { userId: targetUserId },
      });
      return conversation;
    }),

  sendMessage: baseProcedure
    .input(
      z.object({
        conversationId: z.string(),
        role: z.enum(["user", "assistant"]).default("user"),
        content: z.string().min(1).max(10000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Save message to PostgreSQL
      const message = await ctx.db.conversationMessage.create({
        data: {
          conversationId: input.conversationId,
          role: input.role,
          content: input.content,
        },
      });

      let runId: string | null = null;

      // 2. If user message, initiate AI run and enqueue SQS job
      if (input.role === "user") {
        const aiRun = await ctx.db.aiRun.create({
          data: {
            conversationId: input.conversationId,
            triggeringMessageId: message.id,
            status: "queued",
          },
        });
        runId = aiRun.id;

        // Fetch conversation to get userId if not on session
        let userId = ctx.user?.id;
        if (!userId) {
          const conv = await ctx.db.conversation.findUnique({
            where: { id: input.conversationId },
            select: { userId: true },
          });
          userId = conv?.userId;
        }

        if (userId) {
          try {
            await enqueueAiJob({
              runId: aiRun.id,
              conversationId: input.conversationId,
              messageId: message.id,
              userId,
            });
          } catch (err: any) {
            console.error(
              `[tRPC sendMessage] Error enqueuing AI job for run ${aiRun.id}:`,
              err
            );
          }
        }
      }

      return {
        ...message,
        runId,
      };
    }),
});


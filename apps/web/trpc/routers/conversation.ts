import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, baseProcedure } from "../init";
import { enqueueAiJob } from "@/lib/queue";
import { checkRateLimit } from "@/lib/rate-limiter";

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
      // 1. If user message, enforce rate limiting before writing message or enqueuing job
      let userId = ctx.user?.id;
      if (input.role === "user") {
        if (!userId) {
          const conv = await ctx.db.conversation.findUnique({
            where: { id: input.conversationId },
            select: { userId: true },
          });
          userId = conv?.userId;
        }

        if (userId) {
          const burstCheck = await checkRateLimit({
            key: `ratelimit:ai:burst:${userId}`,
            limit: 5,
            windowSeconds: 60,
          });
          if (!burstCheck.success) {
            throw new TRPCError({
              code: "TOO_MANY_REQUESTS",
              message: `Too many AI requests. Please wait ${burstCheck.retryAfter} seconds before sending another message.`,
            });
          }

          const hourlyCheck = await checkRateLimit({
            key: `ratelimit:ai:hourly:${userId}`,
            limit: 30,
            windowSeconds: 3600,
          });
          if (!hourlyCheck.success) {
            throw new TRPCError({
              code: "TOO_MANY_REQUESTS",
              message: "Hourly AI request limit reached. Please wait before asking more questions.",
            });
          }
        }
      }

      // 2. Save message to PostgreSQL
      const message = await ctx.db.conversationMessage.create({
        data: {
          conversationId: input.conversationId,
          role: input.role,
          content: input.content,
        },
      });

      let runId: string | null = null;

      // 3. If user message, initiate AI run and enqueue SQS job
      if (input.role === "user") {
        const aiRun = await ctx.db.aiRun.create({
          data: {
            conversationId: input.conversationId,
            triggeringMessageId: message.id,
            status: "queued",
          },
        });
        runId = aiRun.id;

        if (userId) {
          try {
            await enqueueAiJob({
              runId: aiRun.id,
              conversationId: input.conversationId,
              messageId: message.id,
              userId,
            });
          } catch (err: unknown) {
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


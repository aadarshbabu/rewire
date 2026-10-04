import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@rewire/database";
import { enqueueAiJob } from "@/lib/queue";
import { SendMessageBodySchema } from "@rewire/validation";
import { checkRateLimit } from "@/lib/rate-limiter";

export const dynamic = "force-dynamic";

/**
 * POST /api/conversations/:id/messages
 * Saves user message, creates an AI run ("queued"), enqueues AI job to AWS SQS,
 * and returns { message, runId } immediately.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: conversationId } = await params;

  // 1. Authenticate user
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validate input body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = SendMessageBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  // 3. Verify conversation ownership
  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  if (conversation.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Forbidden: You do not own this conversation" },
      { status: 403 }
    );
  }

  // 3.5. Enforce AI rate limiting (Burst: 5 req/min, Quota: 30 req/hr)
  const burstCheck = await checkRateLimit({
    key: `ratelimit:ai:burst:${session.user.id}`,
    limit: 5,
    windowSeconds: 60,
  });

  if (!burstCheck.success) {
    return NextResponse.json(
      {
        error: `Too many AI requests. Please wait ${burstCheck.retryAfter} seconds before sending another message.`,
        retryAfter: burstCheck.retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(burstCheck.retryAfter),
          "X-RateLimit-Limit": String(burstCheck.limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const hourlyCheck = await checkRateLimit({
    key: `ratelimit:ai:hourly:${session.user.id}`,
    limit: 30,
    windowSeconds: 3600,
  });

  if (!hourlyCheck.success) {
    return NextResponse.json(
      {
        error: "Hourly AI request limit reached. Please wait before asking more questions.",
        retryAfter: hourlyCheck.retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(hourlyCheck.retryAfter),
          "X-RateLimit-Limit": String(hourlyCheck.limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // 4. Save user message to PostgreSQL
  const message = await db.conversationMessage.create({
    data: {
      conversationId,
      role: "user",
      content: parsed.data.content,
    },
  });

  // 5. Create AI run in PostgreSQL with status "queued"
  const aiRun = await db.aiRun.create({
    data: {
      conversationId,
      triggeringMessageId: message.id,
      status: "queued",
    },
  });

  // 6. Enqueue AI job to AWS SQS
  try {
    await enqueueAiJob({
      runId: aiRun.id,
      conversationId,
      messageId: message.id,
      userId: session.user.id,
    });
  } catch (error: any) {
    console.error(
      `[Message API] Warning: Failed to enqueue AI job for run ${aiRun.id}:`,
      error
    );
    // Even if SQS dispatch fails momentarily, the run and message are saved in PostgreSQL
  }

  // 7. Return runId and saved message immediately
  return NextResponse.json(
    {
      message,
      runId: aiRun.id,
      conversationId,
    },
    { status: 201 }
  );
}

/**
 * GET /api/conversations/:id/messages
 * Retrieves chronological message list for the conversation.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: conversationId } = await params;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  if (conversation.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Forbidden: You do not own this conversation" },
      { status: 403 }
    );
  }

  const messages = await db.conversationMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ messages });
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@rewire/database";
import { redis } from "@/lib/redis";
import { AiStreamEvent } from "@rewire/types";

export const dynamic = "force-dynamic";

/**
 * SSE streaming endpoint for AI responses:
 * GET /api/ai/runs/:runId/stream
 *
 * Dedicated to the lifecycle of an individual AI run.
 * Subscribes to Redis Stream `ai:run:{runId}`, forwards events to the browser,
 * and terminates automatically upon run completion or failure.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params;

  if (!runId) {
    return NextResponse.json({ error: "Missing runId parameter" }, { status: 400 });
  }

  // 1. Authenticate user
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Authorize run ownership
  const run = await db.aiRun.findUnique({
    where: { id: runId },
    include: {
      conversation: {
        select: {
          id: true,
          userId: true,
        },
      },
    },
  });

  if (!run) {
    return NextResponse.json({ error: "AI run not found" }, { status: 404 });
  }

  if (run.conversation.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Forbidden: You do not own this conversation" },
      { status: 403 }
    );
  }

  // 3. Support recoverable streaming via Last-Event-ID or query parameter
  const searchParams = request.nextUrl.searchParams;
  const lastEventIdHeader = request.headers.get("Last-Event-ID");
  const lastEventIdParam = searchParams.get("lastEventId");
  let lastId = lastEventIdHeader || lastEventIdParam || "0-0";

  const streamKey = `ai:run:${runId}`;
  const encoder = new TextEncoder();

  // Create SSE ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      let isAborted = false;
      const abortHandler = () => {
        isAborted = true;
      };

      request.signal.addEventListener("abort", abortHandler);

      try {
        let isDone = false;
        let idleAttempts = 0;
        const maxIdleAttempts = 40; // ~60 seconds total timeout if worker never responds

        while (!isAborted && !isDone) {
          // Read from Redis Stream with 1500ms block timeout
          // Returns array: [ [streamKey, [ [id, [field, value]], ... ] ] ]
          const streamData = (await redis.xread(
            "BLOCK",
            1500,
            "STREAMS",
            streamKey,
            lastId
          )) as [string, [string, string[]][]][] | null;

          if (isAborted) break;

          if (streamData && streamData.length > 0) {
            idleAttempts = 0;
            const entries = streamData[0][1];

            for (const [entryId, fields] of entries) {
              lastId = entryId;

              // Extract event payload from 'event' field
              let eventPayloadString = "{}";
              for (let i = 0; i < fields.length; i += 2) {
                if (fields[i] === "event") {
                  eventPayloadString = fields[i + 1];
                  break;
                }
              }

              let parsedEvent: Partial<AiStreamEvent> = {};
              try {
                parsedEvent = JSON.parse(eventPayloadString);
              } catch {
                parsedEvent = { type: "message.delta", content: eventPayloadString };
              }

              const eventType = parsedEvent.type || "message";

              // Format SSE message according to SSE protocol
              const sseFormatted = `id: ${entryId}\nevent: ${eventType}\ndata: ${eventPayloadString}\n\n`;
              controller.enqueue(encoder.encode(sseFormatted));

              // Cleanly terminate SSE connection upon terminal events
              if (eventType === "run.completed" || eventType === "run.failed") {
                isDone = true;
                break;
              }
            }
          } else {
            idleAttempts++;

            // If no stream events arrived, check database status as source of truth
            const latestRun = await db.aiRun.findUnique({
              where: { id: runId },
              select: { status: true, error: true },
            });

            if (
              latestRun &&
              (latestRun.status === "completed" ||
                latestRun.status === "failed" ||
                latestRun.status === "cancelled")
            ) {
              // Send final terminal event if not already sent
              const terminalEvent = {
                type: latestRun.status === "completed" ? "run.completed" : "run.failed",
                runId,
                error: latestRun.error ?? undefined,
                timestamp: Date.now(),
              };
              controller.enqueue(
                encoder.encode(
                  `id: ${Date.now()}-0\nevent: ${terminalEvent.type}\ndata: ${JSON.stringify(terminalEvent)}\n\n`
                )
              );
              isDone = true;
              break;
            }

            if (idleAttempts >= maxIdleAttempts) {
              // Max run wait timeout reached
              const timeoutEvent = {
                type: "run.failed",
                runId,
                error: "Streaming timeout exceeded waiting for AI worker response",
                timestamp: Date.now(),
              };
              controller.enqueue(
                encoder.encode(
                  `id: ${Date.now()}-0\nevent: run.failed\ndata: ${JSON.stringify(timeoutEvent)}\n\n`
                )
              );
              isDone = true;
              break;
            }
          }
        }
      } catch (err: any) {
        if (!isAborted) {
          console.error(`[SSE Stream] Error streaming run ${runId}:`, err);
          const errorEvent = {
            type: "run.failed",
            runId,
            error: err.message || "Internal streaming error",
            timestamp: Date.now(),
          };
          controller.enqueue(
            encoder.encode(
              `event: run.failed\ndata: ${JSON.stringify(errorEvent)}\n\n`
            )
          );
        }
      } finally {
        request.signal.removeEventListener("abort", abortHandler);
        try {
          controller.close();
        } catch {
          // Controller might already be closed
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disables buffering in reverse proxies like Nginx
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@rewire/database";

export const dynamic = "force-dynamic";

/**
 * GET /api/conversations/:id
 * Retrieves a single conversation by ID, including its messages and recent AI runs.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversation = await db.conversation.findUnique({
    where: { id },
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

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  if (conversation.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Forbidden: You do not own this conversation" },
      { status: 403 }
    );
  }

  return NextResponse.json({ conversation });
}

/**
 * DELETE /api/conversations/:id
 * Deletes a conversation and cascaded messages/runs.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversation = await db.conversation.findUnique({
    where: { id },
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

  await db.conversation.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

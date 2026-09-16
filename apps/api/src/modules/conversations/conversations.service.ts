import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AiRunStatus, ConversationMessage } from '@rewire/types';

@Injectable()
export class ConversationsService {
  private readonly logger = new Logger(ConversationsService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async getConversationContext(conversationId: string, limit = 10): Promise<ConversationMessage[]> {
    const messages = await this.databaseService.client.conversationMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Return in chronological order
    return messages.reverse().map((msg) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
      createdAt: msg.createdAt,
    }));
  }

  async getConversation(conversationId: string) {
    return this.databaseService.client.conversation.findUnique({
      where: { id: conversationId },
    });
  }

  async getUser(userId: string) {
    return this.databaseService.client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async updateAiRunStatus(runId: string, status: AiRunStatus, error?: string) {
    const data: Record<string, any> = {
      status,
    };

    if (status === 'running') {
      data.startedAt = new Date();
    } else if (status === 'completed' || status === 'failed' || status === 'cancelled') {
      data.completedAt = new Date();
      if (error) {
        data.error = error;
      }
    }

    try {
      const existing = await this.databaseService.client.aiRun.findUnique({
        where: { id: runId },
      });

      if (!existing) {
        this.logger.warn(`AiRun ${runId} does not exist in database. Skipping status update.`);
        return null;
      }

      return await this.databaseService.client.aiRun.update({
        where: { id: runId },
        data,
      });
    } catch (err: any) {
      this.logger.error(`Failed to update AiRun ${runId} status to ${status}: ${err.message}`);
      return null;
    }
  }

  async saveAssistantMessage(conversationId: string, content: string): Promise<ConversationMessage | null> {
    const conversation = await this.getConversation(conversationId);
    if (!conversation) {
      this.logger.warn(`Cannot save assistant message: Conversation ${conversationId} does not exist.`);
      return null;
    }

    const created = await this.databaseService.client.conversationMessage.create({
      data: {
        conversationId,
        role: 'assistant',
        content,
      },
    });

    return {
      id: created.id,
      conversationId: created.conversationId,
      role: created.role as 'assistant',
      content: created.content,
      createdAt: created.createdAt,
    };
  }
}

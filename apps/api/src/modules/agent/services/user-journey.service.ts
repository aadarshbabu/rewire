import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { UserHistoryContext } from '../graph/states/reframing-state';
import { ReframingAnalysis } from '@rewire/types';
import { Prisma } from '@rewire/database';

@Injectable()
export class UserJourneyService {
  private readonly logger = new Logger(UserJourneyService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Retrieves holistic user history, prior journal entries, recurring distress patterns,
   * and recent conversation snippets for personalized cognitive restructuring.
   */
  async getUserHolisticHistory(userId: string): Promise<UserHistoryContext> {
    try {
      this.logger.log(`Fetching holistic user history for userId: ${userId}`);

      // 1. Fetch user identity
      const user = await this.databaseService.client.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true },
      });

      // 2. Fetch past journal entries with mood progression
      const pastEntries = await this.databaseService.client.journalEntry.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: {
          id: true,
          title: true,
          rawContent: true,
          moodBefore: true,
          moodAfter: true,
          actionTaken: true,
          distressTags: true,
          createdAt: true,
        },
      });

      // 3. Aggregate recurring distress tags
      const tagMap: Record<string, number> = {};
      for (const entry of pastEntries) {
        for (const tag of entry.distressTags) {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        }
      }
      const recurringDistressTags = Object.entries(tagMap)
        .sort((a, b) => b[1] - a[1])
        .map(([tag]) => tag);

      // 4. Fetch recent conversation snippets to capture recent life context
      const recentConversations = await this.databaseService.client.conversation.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 2,
        include: {
          messages: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            where: { role: 'user' },
          },
        },
      });

      const recentConversationSnippets = recentConversations.flatMap((c) =>
        c.messages.map((m) => m.content.slice(0, 150)),
      );

      const userHistory: UserHistoryContext = {
        userName: user?.name || undefined,
        pastEntries: pastEntries.map((e) => ({
          id: e.id,
          title: e.title,
          rawContent: e.rawContent.slice(0, 300),
          moodBefore: e.moodBefore,
          moodAfter: e.moodAfter,
          actionTaken: e.actionTaken,
          createdAt: e.createdAt,
        })),
        recentConversationSnippets,
        recurringDistressTags,
      };

      this.logger.log(
        `Successfully loaded holistic journey for ${user?.name || userId}: ${pastEntries.length} entries, ${recurringDistressTags.length} recurring tags.`,
      );

      return userHistory;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to fetch user holistic history: ${msg}`, err instanceof Error ? err.stack : undefined);
      return {
        pastEntries: [],
        recentConversationSnippets: [],
        recurringDistressTags: [],
      };
    }
  }

  /**
   * Persists reframing evolution insights back into a journal entry.
   */
  async updateEntryEvolution(entryId: string, reframingResult: ReframingAnalysis): Promise<void> {
    try {
      await this.databaseService.client.journalEntry.update({
        where: { id: entryId },
        data: {
          reframingResult: reframingResult as unknown as Prisma.InputJsonValue,
          actionTaken: 'reframed',
        },
      });
      this.logger.log(`Updated journal entry ${entryId} with reframing evolution results`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Could not update journal entry ${entryId} evolution: ${msg}`);
    }
  }
}

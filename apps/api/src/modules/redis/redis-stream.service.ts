import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AiStreamEvent } from '@rewire/types';

@Injectable()
export class RedisStreamService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisStreamService.name);
  private client: Redis | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    const host = this.configService.get<string>('REDIS_HOST') || '127.0.0.1';
    const port = Number(this.configService.get<string>('REDIS_PORT')) || 6379;
    const password = this.configService.get<string>('REDIS_PASSWORD');

    try {
      if (redisUrl) {
        this.client = new Redis(redisUrl, {
          lazyConnect: true,
          maxRetriesPerRequest: 3,
        });
      } else {
        this.client = new Redis({
          host,
          port,
          password: password || undefined,
          lazyConnect: true,
          maxRetriesPerRequest: 3,
        });
      }

      this.client.connect().catch((err) => {
        this.logger.warn(`Redis connection deferred / failed: ${err.message}`);
      });

      this.logger.log('Redis client configured for event streaming');
    } catch (error) {
      this.logger.error('Failed to initialize Redis client', error);
    }
  }

  async publishStreamEvent(runId: string, event: AiStreamEvent): Promise<string | null> {
    if (!this.client) {
      this.logger.warn(`Redis client not ready, skipped streaming event: ${event.type}`);
      return null;
    }

    const streamKey = `ai:run:${runId}`;
    try {
      const payload = {
        type: event.type,
        runId: event.runId,
        node: event.node || '',
        content: event.content || '',
        error: event.error || '',
        messageId: event.messageId || '',
        timestamp: String(event.timestamp || Date.now()),
      };

      const eventId = await this.client.xadd(
        streamKey,
        '*',
        'event',
        JSON.stringify(payload),
      );
      return eventId;
    } catch (error) {
      this.logger.error(`Failed to publish event ${event.type} to stream ${streamKey}`, error);
      return null;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit().catch(() => {});
      this.logger.log('Closed Redis connection');
    }
  }
}

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDatabaseClient, db, PrismaClient } from '@rewire/database';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  public client: PrismaClient;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (databaseUrl) {
      this.logger.log('Initializing Prisma client with configured DATABASE_URL');
      this.client = createDatabaseClient(databaseUrl);
      
    } else {
      this.logger.warn('DATABASE_URL is not configured in environment! Falling back to default.');
      this.client = db;
    }
  }

  async onModuleInit() {
    try {
      await this.client.$connect();
      this.logger.log('Successfully connected to PostgreSQL via Prisma');
    } catch (error: any) {
      this.logger.error(`Failed to connect to PostgreSQL database: ${error.message}`, error.stack);
    }
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
    this.logger.log('Disconnected from PostgreSQL');
  }
}

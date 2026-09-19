import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { Neo4jModule } from './modules/neo4j/neo4j.module';
import { RedisModule } from './modules/redis/redis.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { AgentModule } from './modules/agent/agent.module';
import { QueueModule } from './modules/queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV
        ? [
            `.env.${process.env.NODE_ENV}.local`,
            `.env.${process.env.NODE_ENV}`,
            '.env.local',
            '.env',
          ]
        : ['.env.development.local', '.env.local', '.env.development', '.env'],
    }),
    DatabaseModule,
    Neo4jModule,
    RedisModule,
    ConversationsModule,
    AgentModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

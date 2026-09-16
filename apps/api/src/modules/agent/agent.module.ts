import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { SafetyService } from './safety/safety.service';
import { GraphRagService } from './rag/graph-rag.service';
import { ConversationsModule } from '../conversations/conversations.module';
import { RedisModule } from '../redis/redis.module';
import { Neo4jModule } from '../neo4j/neo4j.module';

import { UserJourneyService } from './services/user-journey.service';
import { UserInsightsService } from './services/user-insights.service';
import { AgentController } from './agent.controller';

@Module({
  imports: [ConversationsModule, RedisModule, Neo4jModule],
  controllers: [AgentController],
  providers: [SafetyService, GraphRagService, UserJourneyService, UserInsightsService, AgentService],
  exports: [AgentService, SafetyService, GraphRagService, UserJourneyService, UserInsightsService],
})
export class AgentModule {}


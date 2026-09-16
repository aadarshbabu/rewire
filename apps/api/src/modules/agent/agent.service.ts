import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { UserJourneyService } from './services/user-journey.service';
import { SafetyService } from './safety/safety.service';
import { GraphRagService } from './rag/graph-rag.service';
import { RedisStreamService } from '../redis/redis-stream.service';
import { buildAgentGraph, CompiledAgentGraph } from './graph/agent.graph';
import { buildReframingGraph, CompiledReframingGraph } from './graph/reframing.graph';
import { AiJobPayload, ReframingAnalysis } from '@rewire/types';
import { ReframeAgentDto } from './dto/reframe-agent.dto';

@Injectable()
export class AgentService implements OnModuleInit {
  private readonly logger = new Logger(AgentService.name);
  private graph: CompiledAgentGraph | null = null;
  private reframingGraph: CompiledReframingGraph | null = null;

  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly userJourneyService: UserJourneyService,
    private readonly safetyService: SafetyService,
    private readonly ragService: GraphRagService,
    private readonly redisStreamService: RedisStreamService,
  ) {}

  onModuleInit() {
    this.graph = buildAgentGraph(
      this.conversationsService,
      this.safetyService,
      this.ragService,
      this.redisStreamService,
    );
    this.reframingGraph = buildReframingGraph(
      this.userJourneyService,
      this.ragService,
    );
    this.logger.log('Compiled LangGraph workflows (Agent & Reframing) successfully');

    const isLangSmithTracing =
      process.env.LANGSMITH_TRACING === 'true' || process.env.LANGCHAIN_TRACING_V2 === 'true';
    if (isLangSmithTracing) {
      this.logger.log(
        `LangSmith tracing enabled (Project: "${process.env.LANGSMITH_PROJECT || 'rewire'}")`,
      );
    }
  }

  /**
   * Runs the agentic cognitive reframing LangGraph workflow for a user's brain dump,
   * leveraging user history, recurring patterns, and Neo4j GraphRAG.
   */
  async reframeThought(dto: ReframeAgentDto): Promise<ReframingAnalysis> {
    if (!this.reframingGraph) {
      throw new Error('Reframing LangGraph workflow is not initialized');
    }

    this.logger.log(`Executing Agentic Reframing Graph for user: ${dto.userId || 'guest'}`);
    const state = await this.reframingGraph.invoke(
      {
        userId: dto.userId,
        rawContent: dto.rawContent,
        moodBefore: dto.moodBefore,
        distressTags: dto.distressTags || [],
        userHistory: {
          pastEntries: [],
          recentConversationSnippets: [],
          recurringDistressTags: [],
        },
        retrievedKnowledge: [],
        result: null,
        error: null,
      },
      {
        runName: 'CognitiveReframingAgent',
        tags: ['reframing', 'cognitive-restructuring'],
        metadata: {
          userId: dto.userId || 'guest',
          moodBefore: dto.moodBefore,
          distressTags: dto.distressTags || [],
        },
      },
    );

    if (!state.result) {
      throw new Error('Reframing workflow did not produce a result');
    }

    return state.result;
  }

  async processAiJob(payload: AiJobPayload): Promise<void> {
    const { runId, conversationId, messageId, userId } = payload;
    this.logger.log(`Processing AI job run: ${runId} for conversation: ${conversationId}`);

    // Verify conversation exists in database before proceeding
    const conversation = await this.conversationsService.getConversation(conversationId);
    if (!conversation) {
      this.logger.warn(`Conversation ${conversationId} does not exist in database. Discarding invalid AI job.`);
      return;
    }

    try {
      // 1. Mark run as running in PostgreSQL
      await this.conversationsService.updateAiRunStatus(runId, 'running');

      // 2. Publish run.started event to Redis Stream
      await this.redisStreamService.publishStreamEvent(runId, {
        type: 'run.started',
        runId,
        timestamp: Date.now(),
      });

      if (!this.graph) {
        throw new Error('LangGraph agent workflow is not initialized');
      }

      // 3. Execute LangGraph workflow with LangSmith tracing metadata
      await this.graph.invoke(
        {
          runId,
          conversationId,
          messageId,
          userId,
          history: [],
          currentMessage: '',
          safetyAssessment: null,
          retrievedKnowledge: [],
          isCrisis: false,
          response: '',
          error: null,
        },
        {
          runName: 'MentalHealthChatAgent',
          tags: ['mental-health', 'agent-chat', 'sqs-job'],
          metadata: {
            runId,
            conversationId,
            messageId,
            userId,
          },
        },
      );

      // 4. Mark run as completed in PostgreSQL
      await this.conversationsService.updateAiRunStatus(runId, 'completed');
      this.logger.log(`AI job run ${runId} completed successfully`);
    } catch (error: any) {
      this.logger.error(`AI job run ${runId} failed: ${error.message}`, error.stack);

      // Publish run.failed event to Redis Stream
      await this.redisStreamService.publishStreamEvent(runId, {
        type: 'run.failed',
        runId,
        error: error.message,
        timestamp: Date.now(),
      });

      // Mark run as failed in PostgreSQL
      await this.conversationsService.updateAiRunStatus(runId, 'failed', error.message);
      throw error;
    }
  }

  /**
   * Returns the Mermaid definition of the compiled LangGraph workflow.
   */
  getGraphMermaid(): string {
    if (!this.graph) {
      throw new Error('LangGraph agent workflow is not initialized');
    }
    return this.graph.getGraph().drawMermaid();
  }

  /**
   * Returns a PNG buffer of the compiled LangGraph workflow image.
   */
  async getGraphImage(): Promise<Buffer> {
    if (!this.graph) {
      throw new Error('LangGraph agent workflow is not initialized');
    }
    const drawable = this.graph.getGraph();
    const imageBlob = await drawable.drawMermaidPng();
    const arrayBuffer = await imageBlob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}

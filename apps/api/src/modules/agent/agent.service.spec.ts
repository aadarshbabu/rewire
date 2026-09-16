import { Test, TestingModule } from '@nestjs/testing';
import { AgentService } from './agent.service';
import { ConversationsService } from '../conversations/conversations.service';
import { SafetyService } from './safety/safety.service';
import { GraphRagService } from './rag/graph-rag.service';
import { RedisStreamService } from '../redis/redis-stream.service';
import { UserJourneyService } from './services/user-journey.service';

describe('AgentService', () => {
  let service: AgentService;

  const mockConversationsService = {
    getConversation: jest.fn().mockResolvedValue({ id: 'conv-456' }),
    updateAiRunStatus: jest.fn().mockResolvedValue({}),
    getConversationContext: jest.fn().mockResolvedValue([]),
    saveAssistantMessage: jest.fn().mockResolvedValue({ id: 'msg-1' }),
  };

  const mockUserJourneyService = {
    getUserHolisticHistory: jest.fn().mockResolvedValue({
      userName: 'Alex',
      pastEntries: [],
      recentConversationSnippets: [],
      recurringDistressTags: ['Overwhelmed'],
    }),
    updateEntryEvolution: jest.fn().mockResolvedValue(undefined),
  };

  const mockSafetyService = {
    assessInputRisk: jest.fn().mockReturnValue({ isCrisis: false, severity: 'none', matchedTriggers: [] }),
    validateGeneratedResponse: jest.fn().mockReturnValue({ isValid: true, sanitizedText: 'safe text' }),
  };

  const mockRagService = {
    retrieveContext: jest.fn().mockResolvedValue([]),
  };

  const mockRedisStreamService = {
    publishStreamEvent: jest.fn().mockResolvedValue('event-id-1'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentService,
        { provide: ConversationsService, useValue: mockConversationsService },
        { provide: UserJourneyService, useValue: mockUserJourneyService },
        { provide: SafetyService, useValue: mockSafetyService },
        { provide: GraphRagService, useValue: mockRagService },
        { provide: RedisStreamService, useValue: mockRedisStreamService },
      ],
    }).compile();

    service = module.get<AgentService>(AgentService);
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process AI job and update status to running then completed', async () => {
    const payload = {
      runId: 'run-123',
      conversationId: 'conv-456',
      messageId: 'msg-789',
      userId: 'user-001',
    };

    await service.processAiJob(payload);

    expect(mockConversationsService.updateAiRunStatus).toHaveBeenCalledWith('run-123', 'running');
    expect(mockRedisStreamService.publishStreamEvent).toHaveBeenCalledWith('run-123', expect.objectContaining({ type: 'run.started' }));
    expect(mockConversationsService.updateAiRunStatus).toHaveBeenCalledWith('run-123', 'completed');
  });

  it('should return mermaid definition from compiled graph', () => {
    const mermaid = service.getGraphMermaid();
    expect(mermaid).toBeDefined();
    expect(mermaid).toContain('loadContext');
    expect(mermaid).toContain('assessSafety');
    expect(mermaid).toContain('neo4jRag');
    expect(mermaid).toContain('generate');
    expect(mermaid).toContain('persist');
  });

  it('should return graph image buffer', async () => {
    const imageBuffer = await service.getGraphImage();
    expect(imageBuffer).toBeInstanceOf(Buffer);
    expect(imageBuffer.length).toBeGreaterThan(0);
  });

  it('should run agentic reframeThought graph and return structured analysis with evolution insights', async () => {
    const result = await service.reframeThought({
      userId: 'user-001',
      rawContent: 'I have so much work and everything is ruined. I will never catch up.',
      moodBefore: 8,
      distressTags: ['Overwhelmed', 'Racing Thoughts'],
    });

    expect(result).toBeDefined();
    expect(result.summary).toBeDefined();
    expect(result.circleOfControl).toBeDefined();
    expect(result.circleOfControl.inControl).toBeInstanceOf(Array);
    expect(result.circleOfControl.outsideControl).toBeInstanceOf(Array);
    expect(result.distortions.length).toBeGreaterThan(0);
    expect(result.evolutionNote).toBeDefined();
    expect(result.microAction).toBeDefined();
  });
});

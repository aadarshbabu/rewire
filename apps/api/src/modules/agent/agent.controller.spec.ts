import { Test, TestingModule } from '@nestjs/testing';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { UserInsightsService } from './services/user-insights.service';
import { Neo4jSeedService } from '../neo4j/seed/neo4j-seed.service';

describe('AgentController', () => {
  let controller: AgentController;

  const mockAgentService = {
    processAiJob: jest.fn().mockResolvedValue(undefined),
    reframeThought: jest.fn().mockResolvedValue({ summary: 'test' }),
    getGraphImage: jest.fn(),
    getGraphMermaid: jest.fn(),
  };

  const mockUserInsightsService = {
    getUserInsights: jest.fn().mockResolvedValue({
      topTriggers: [],
      effectiveStrategies: [],
      distortionTrends: [],
      totalEntriesAnalyzed: 0,
      overallPositiveRate: 0,
      personalizedSummary: 'test',
    }),
    syncEntryToGraph: jest.fn().mockResolvedValue(undefined),
    syncAllUserEntries: jest.fn().mockResolvedValue({ syncedCount: 2 }),
  };

  const mockNeo4jSeedService = {
    seedDatabase: jest.fn().mockResolvedValue({
      conceptsSeeded: 10,
      strategiesSeeded: 12,
      triggersSeeded: 8,
      emotionsSeeded: 10,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentController],
      providers: [
        {
          provide: AgentService,
          useValue: mockAgentService,
        },
        {
          provide: UserInsightsService,
          useValue: mockUserInsightsService,
        },
        {
          provide: Neo4jSeedService,
          useValue: mockNeo4jSeedService,
        },
      ],
    }).compile();

    controller = module.get<AgentController>(AgentController);
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should accept AI job trigger and delegate to AgentService', async () => {
    const payload = {
      runId: 'run-1',
      conversationId: 'conv-1',
      messageId: 'msg-1',
      userId: 'user-1',
    };

    const res = await controller.runJob(payload);
    expect(res).toEqual({ status: 'accepted', runId: 'run-1' });
    expect(mockAgentService.processAiJob).toHaveBeenCalledWith(payload);
  });

  it('should return graph image buffer with Content-Type image/png', async () => {
    mockAgentService.getGraphImage = jest.fn().mockResolvedValue(Buffer.from('fake-image-bytes'));

    const mockRes = {
      setHeader: jest.fn(),
      end: jest.fn(),
    } as any;

    await controller.getGraphImage(mockRes);

    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'image/png');
    expect(mockRes.end).toHaveBeenCalledWith(Buffer.from('fake-image-bytes'));
  });

  it('should return mermaid diagram syntax', () => {
    mockAgentService.getGraphMermaid = jest.fn().mockReturnValue('graph TD; a --> b;');

    const mermaid = controller.getGraphMermaid();
    expect(mermaid).toBe('graph TD; a --> b;');
  });

  it('should return interactive HTML visualizer', () => {
    mockAgentService.getGraphMermaid = jest.fn().mockReturnValue('graph TD; a --> b;');

    const html = controller.getGraphHtml();
    expect(html).toContain('LangGraph Workflow Visualizer');
    expect(html).toContain('graph TD; a --> b;');
  });

  it('should return user insights from userInsightsService', async () => {
    const result = await controller.getInsights('user-1');
    expect(result).toBeDefined();
    expect(result.personalizedSummary).toBe('test');
    expect(mockUserInsightsService.getUserInsights).toHaveBeenCalledWith('user-1');
  });

  it('should sync entry to graph', async () => {
    const payload = {
      userId: 'user-1',
      entryId: 'entry-1',
      distressTags: ['Work'],
    };
    const result = await controller.syncEntry(payload);
    expect(result).toEqual({ success: true });
    expect(mockUserInsightsService.syncEntryToGraph).toHaveBeenCalledWith(payload);
  });

  it('should sync all entries for user', async () => {
    const result = await controller.syncAllEntries('user-1');
    expect(result).toEqual({ syncedCount: 2 });
    expect(mockUserInsightsService.syncAllUserEntries).toHaveBeenCalledWith('user-1');
  });

  it('should trigger neo4j seed', async () => {
    const result = await controller.seedKnowledge();
    expect(result.conceptsSeeded).toBe(10);
    expect(mockNeo4jSeedService.seedDatabase).toHaveBeenCalled();
  });
});


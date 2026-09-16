import { Test, TestingModule } from '@nestjs/testing';
import { UserInsightsService } from './user-insights.service';
import { Neo4jService } from '../../neo4j/neo4j.service';
import { DatabaseService } from '../../database/database.service';

describe('UserInsightsService', () => {
  let service: UserInsightsService;

  const mockNeo4jService = {
    write: jest.fn().mockResolvedValue([]),
    read: jest.fn(),
  };

  const mockDatabaseService = {
    client: {
      journalEntry: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserInsightsService,
        { provide: Neo4jService, useValue: mockNeo4jService },
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<UserInsightsService>(UserInsightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sync entry to graph with triggers, distortions, and strategy', async () => {
    await service.syncEntryToGraph({
      userId: 'usr_1',
      entryId: 'entry_1',
      moodBefore: 3,
      moodAfter: 7,
      distressTags: ['Work & Deadlines'],
      actionTaken: 'reframed',
      distortions: [{ name: 'Catastrophizing', detectedThought: 'Everything will fail' }],
      strategyUsed: 'Circle of Control Delineation',
    });

    expect(mockNeo4jService.write).toHaveBeenCalled();
    // Verify parameters passed to write
    const writeCalls = mockNeo4jService.write.mock.calls;
    expect(writeCalls.length).toBeGreaterThanOrEqual(4); // User/Entry, Trigger, Distortion, Strategy
  });

  it('should compute user dynamic insights from Neo4j queries', async () => {
    mockNeo4jService.read.mockImplementation((cypher: string) => {
      if (cypher.includes('APPLIED_STRATEGY')) {
        return Promise.resolve([
          {
            strategy: 'Circle of Control Delineation',
            timesApplied: 3,
            avgMoodImprovement: 3.8,
            successRate: 100,
            triggersHandled: ['Work & Deadlines'],
          },
        ]);
      }
      if (cypher.includes('EXHIBITS_DISTORTION')) {
        return Promise.resolve([
          { distortion: 'Catastrophizing', occurrences: 3, associatedTriggers: ['Work & Deadlines'] },
        ]);
      }
      if (cypher.includes('WITH count(e) AS total')) {
        return Promise.resolve([{ total: 4, positiveRate: 100 }]);
      }
      if (cypher.includes('HAS_TRIGGER')) {
        return Promise.resolve([
          { trigger: 'Work & Deadlines', occurrences: 4, avgDistressLevel: 3.2, avgMoodDelta: 3.5 },
        ]);
      }
      return Promise.resolve([]);
    });


    const insights = await service.getUserInsights('usr_1');

    expect(insights.totalEntriesAnalyzed).toBe(4);
    expect(insights.overallPositiveRate).toBe(100);
    expect(insights.topTriggers).toHaveLength(1);
    expect(insights.topTriggers[0].trigger).toBe('Work & Deadlines');
    expect(insights.effectiveStrategies).toHaveLength(1);
    expect(insights.effectiveStrategies[0].strategy).toBe('Circle of Control Delineation');
    expect(insights.distortionTrends).toHaveLength(1);
    expect(insights.distortionTrends[0].distortion).toBe('Catastrophizing');
    expect(insights.personalizedSummary).toContain('Work & Deadlines');
    expect(insights.personalizedSummary).toContain('Circle of Control Delineation');
  });

  it('should handle Neo4j failures gracefully and return safe defaults', async () => {
    mockNeo4jService.read.mockRejectedValue(new Error('Neo4j disconnected'));

    const insights = await service.getUserInsights('usr_1');

    expect(insights.totalEntriesAnalyzed).toBe(0);
    expect(insights.topTriggers).toEqual([]);
    expect(insights.effectiveStrategies).toEqual([]);
    expect(insights.personalizedSummary).toContain('No graph data currently available');
  });
});

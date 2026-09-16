import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SqsConsumerService } from './sqs-consumer.service';
import { AgentService } from '../agent/agent.service';

describe('SqsConsumerService', () => {
  let service: SqsConsumerService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'AWS_REGION') return 'us-east-1';
      if (key === 'AWS_SQS_QUEUE_URL') return 'https://sqs.us-east-1.amazonaws.com/123/queue';
      return null;
    }),
  };

  const mockAgentService = {
    processAiJob: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SqsConsumerService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AgentService, useValue: mockAgentService },
      ],
    }).compile();

    service = module.get<SqsConsumerService>(SqsConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should parse valid SQS message body and dispatch to agentService', async () => {
    const payload = {
      runId: 'run-999',
      conversationId: 'conv-888',
      messageId: 'msg-777',
      userId: 'user-666',
    };

    await service.processMessageBody(JSON.stringify(payload));
    expect(mockAgentService.processAiJob).toHaveBeenCalledWith(payload);
  });

  it('should ignore malformed JSON gracefully', async () => {
    await service.processMessageBody('not-valid-json');
    expect(mockAgentService.processAiJob).not.toHaveBeenCalled();
  });
});
